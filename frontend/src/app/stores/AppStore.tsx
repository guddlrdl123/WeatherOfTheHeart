import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { mailboxService } from "../services/mailboxService";
import { type CreateMemoryInput, type UpdateMemoryPositionInput, memoryService } from "../services/memoryService";
import { type CreatePlazaEntryInput, type CreatePlazaInput, plazaService } from "../services/plazaService";
import type { AppUser, LoginInput, SignupInput } from "../types/auth";
import type { MailboxItem } from "../types/mailbox";
import type { Memory } from "../types/memory";
import type { Plaza, PlazaEntry } from "../types/plaza";
import type { AppRoute } from "../types/route";
import type { WeatherKey } from "../types/weather";
import { getTodayString } from "../utils/date";
import { readStorage, writeStorage } from "../lib/storage";

export type AppTheme = "dark" | "light";
export type RoomObjectPosition = {
  positionX: number;
  positionY: number;
  flipX?: boolean;
  tiltDeg?: number;
};
export type RoomObjectPositionInput = RoomObjectPosition & {
  objectKey: string;
};

const ROOM_OBJECT_POSITIONS_KEY = "maeum-weather:room-object-positions";

// 화면 대부분이 공유하는 전역 상태와 액션의 모양입니다.
type AppStore = {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  user: AppUser | null;
  login: (input: LoginInput) => Promise<AppUser>;
  signup: (input: SignupInput) => Promise<AppUser>;
  logout: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  memories: Memory[];
  isMemoriesLoading: boolean;
  selectedMemory: Memory | null;
  currentWeather: WeatherKey;
  addMemory: (input: CreateMemoryInput) => Promise<{ ok: true; memory: Memory } | { ok: false; reason: "duplicate" | "duplicate_object" }>;
  updateMemoryPosition: (input: UpdateMemoryPositionInput) => Promise<{ ok: true; memory: Memory } | { ok: false; reason: "not_found" }>;
  roomObjectPositions: Record<string, RoomObjectPosition>;
  updateRoomObjectPosition: (input: RoomObjectPositionInput) => void;
  plazas: Plaza[];
  plazaEntries: PlazaEntry[];
  createPlaza: (input: CreatePlazaInput) => Plaza;
  addPlazaEntry: (input: CreatePlazaEntryInput) => { ok: true; entry: PlazaEntry } | { ok: false; reason: "already_joined" | "complete" };
  mailboxItems: MailboxItem[];
  markMailboxRead: (id: string) => void;
};

const AppStoreContext = createContext<AppStore | null>(null);

// 새로고침했을 때 현재 브라우저 주소를 초기 route로 사용합니다.
function getInitialRoute(): AppRoute {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname || "/";
}

// 사용자가 마지막으로 고른 테마를 localStorage에서 복원합니다.
function getInitialTheme(): AppTheme {
  return readStorage<AppTheme>("maeum-weather:theme", "dark");
}

function getInitialRoomObjectPositions() {
  const positions = readStorage<Record<string, RoomObjectPosition>>(ROOM_OBJECT_POSITIONS_KEY, {});
  return positions && typeof positions === "object" ? positions : {};
}

// 백엔드 API와 일부 로컬 UI 설정을 조합해 앱 전체 상태를 Context로 내려줍니다.
export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<AppRoute>(() => getInitialRoute());
  const [theme, setThemeState] = useState<AppTheme>(() => getInitialTheme());
  const [user, setUser] = useState<AppUser | null>(() => authService.getCurrentUser());
  const [selectedDate, setSelectedDate] = useState(getTodayString);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isMemoriesLoading, setIsMemoriesLoading] = useState(false);
  const [roomObjectPositions, setRoomObjectPositions] = useState<Record<string, RoomObjectPosition>>(() => getInitialRoomObjectPositions());
  const [plazas, setPlazas] = useState<Plaza[]>(() => plazaService.listPlazas());
  const [plazaEntries, setPlazaEntries] = useState<PlazaEntry[]>(() => plazaService.listEntries());
  const [mailboxItems, setMailboxItems] = useState<MailboxItem[]>(() => mailboxService.list());

  // 브라우저 뒤로가기/앞으로가기를 눌렀을 때 route 상태를 주소와 맞춥니다.
  useEffect(() => {
    function handlePopState() {
      setRoute(getInitialRoute());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 테마 상태가 바뀔 때 html 태그에 data-theme/class를 반영합니다.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    writeStorage("maeum-weather:theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user || user.isAdmin) {
      setMemories([]);
      setIsMemoriesLoading(false);
      return;
    }

    let ignore = false;
    setIsMemoriesLoading(true);

    // 이번 DB 저장 변경: 로그인된 사용자 id로 서버의 private_memories 목록을 불러옵니다.
    memoryService
      .list(user.id)
      .then((nextMemories) => {
        if (!ignore) {
          setMemories(nextMemories);
        }
      })
      .catch(() => {
        if (!ignore) {
          setMemories([]);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsMemoriesLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user]);

  const setTheme = useCallback((nextTheme: AppTheme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const navigate = useCallback((nextRoute: AppRoute) => {
    // 실제 페이지 이동 없이 주소만 바꾸고 React 상태로 화면을 교체합니다.
    window.history.pushState(null, "", nextRoute);
    setRoute(nextRoute);
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const nextUser = await authService.login(input);
      setUser(nextUser);
      navigate("/room");
      return nextUser;
    },
    [navigate],
  );

  const signup = useCallback(
    async (input: SignupInput) => {
      const nextUser = await authService.signup(input);
      setUser(nextUser);
      navigate("/room");
      return nextUser;
    },
    [navigate],
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate("/");
  }, [navigate]);

  const selectedMemory = useMemo(
    () => memories.find((memory) => memory.memoryDate === selectedDate) ?? null,
    [memories, selectedDate],
  );

  // 선택된 날짜의 기록이 있으면 그 기록의 날씨를, 없으면 기본 흐림 날씨를 사용합니다.
  const currentWeather = selectedMemory?.weatherKey ?? "cloudy";

  const addMemory = useCallback(async (input: CreateMemoryInput) => {
    if (!user || user.isAdmin) {
      return { ok: false as const, reason: "duplicate" as const };
    }

    // localStorage 대신 백엔드 POST 결과를 기준으로 화면 상태를 갱신합니다.
    const result = await memoryService.create(user.id, input);

    // 저장 성공 후에는 service에서 다시 목록을 읽어 화면 상태를 최신화합니다.
    if (result.ok) {
      setMemories(await memoryService.list(user.id));
    }

    return result;
  }, [user]);

  const updateMemoryPosition = useCallback(async (input: UpdateMemoryPositionInput) => {
    if (!user || user.isAdmin) {
      return { ok: false as const, reason: "not_found" as const };
    }

    // 위치 변경도 서버에 저장해 새로고침 후 같은 배치가 유지되게 합니다.
    const result = await memoryService.updatePosition(user.id, input);

    if (result.ok) {
      setMemories(await memoryService.list(user.id));
    }

    return result;
  }, [user]);

  const updateRoomObjectPosition = useCallback((input: RoomObjectPositionInput) => {
    setRoomObjectPositions((currentPositions) => {
      const nextPositions = {
        ...currentPositions,
        [input.objectKey]: {
          positionX: input.positionX,
          positionY: input.positionY,
          flipX: input.flipX,
          tiltDeg: input.tiltDeg,
        },
      };
      writeStorage(ROOM_OBJECT_POSITIONS_KEY, nextPositions);
      return nextPositions;
    });
  }, []);

  const createPlaza = useCallback((input: CreatePlazaInput) => {
    const plaza = plazaService.createPlaza(input);
    setPlazas(plazaService.listPlazas());
    return plaza;
  }, []);

  const addPlazaEntry = useCallback((input: CreatePlazaEntryInput) => {
    const result = plazaService.createEntry(input);

    if (result.ok) {
      setPlazaEntries(plazaService.listEntries());
    }

    return result;
  }, []);

  const markMailboxRead = useCallback((id: string) => {
    setMailboxItems(mailboxService.markRead(id));
  }, []);

  const value = useMemo<AppStore>(
    // Context 값은 여러 컴포넌트가 읽으므로 useMemo로 불필요한 객체 재생성을 줄입니다.
    () => ({
      route,
      navigate,
      theme,
      setTheme,
      toggleTheme,
      user,
      login,
      signup,
      logout,
      selectedDate,
      setSelectedDate,
      memories,
      isMemoriesLoading,
      selectedMemory,
      currentWeather,
      addMemory,
      updateMemoryPosition,
      roomObjectPositions,
      updateRoomObjectPosition,
      plazas,
      plazaEntries,
      createPlaza,
      addPlazaEntry,
      mailboxItems,
      markMailboxRead,
    }),
    [
      route,
      navigate,
      theme,
      setTheme,
      toggleTheme,
      user,
      login,
      signup,
      logout,
      selectedDate,
      memories,
      isMemoriesLoading,
      selectedMemory,
      currentWeather,
      addMemory,
      updateMemoryPosition,
      roomObjectPositions,
      updateRoomObjectPosition,
      plazas,
      plazaEntries,
      createPlaza,
      addPlazaEntry,
      mailboxItems,
      markMailboxRead,
    ],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

// AppStoreProvider 밖에서 실수로 호출하면 바로 알아차릴 수 있게 에러를 던집니다.
export function useAppStore() {
  const value = useContext(AppStoreContext);

  if (!value) {
    throw new Error("useAppStore must be used inside AppStoreProvider");
  }

  return value;
}

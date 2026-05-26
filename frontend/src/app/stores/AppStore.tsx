import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { mailboxService } from "../services/mailboxService";
import { type CreateMemoryInput, memoryService } from "../services/memoryService";
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

type AppStore = {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  user: AppUser | null;
  login: (input: LoginInput) => AppUser;
  signup: (input: SignupInput) => AppUser;
  logout: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  memories: Memory[];
  selectedMemory: Memory | null;
  currentWeather: WeatherKey;
  addMemory: (input: CreateMemoryInput) => { ok: true; memory: Memory } | { ok: false; reason: "duplicate" };
  plazas: Plaza[];
  plazaEntries: PlazaEntry[];
  createPlaza: (input: CreatePlazaInput) => Plaza;
  addPlazaEntry: (input: CreatePlazaEntryInput) => { ok: true; entry: PlazaEntry } | { ok: false; reason: "already_joined" | "complete" };
  mailboxItems: MailboxItem[];
  markMailboxRead: (id: string) => void;
};

const AppStoreContext = createContext<AppStore | null>(null);

function getInitialRoute(): AppRoute {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname || "/";
}

function getInitialTheme(): AppTheme {
  return readStorage<AppTheme>("maeum-weather:theme", "dark");
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<AppRoute>(() => getInitialRoute());
  const [theme, setThemeState] = useState<AppTheme>(() => getInitialTheme());
  const [user, setUser] = useState<AppUser | null>(() => authService.getCurrentUser());
  const [selectedDate, setSelectedDate] = useState(getTodayString);
  const [memories, setMemories] = useState<Memory[]>(() => memoryService.list());
  const [plazas, setPlazas] = useState<Plaza[]>(() => plazaService.listPlazas());
  const [plazaEntries, setPlazaEntries] = useState<PlazaEntry[]>(() => plazaService.listEntries());
  const [mailboxItems, setMailboxItems] = useState<MailboxItem[]>(() => mailboxService.list());

  useEffect(() => {
    function handlePopState() {
      setRoute(getInitialRoute());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    writeStorage("maeum-weather:theme", theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: AppTheme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const navigate = useCallback((nextRoute: AppRoute) => {
    window.history.pushState(null, "", nextRoute);
    setRoute(nextRoute);
  }, []);

  const login = useCallback(
    (input: LoginInput) => {
      const nextUser = authService.login(input);
      setUser(nextUser);
      navigate("/room");
      return nextUser;
    },
    [navigate],
  );

  const signup = useCallback(
    (input: SignupInput) => {
      const nextUser = authService.signup(input);
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

  const currentWeather = selectedMemory?.weatherKey ?? "cloudy";

  const addMemory = useCallback((input: CreateMemoryInput) => {
    const result = memoryService.create(input);

    if (result.ok) {
      setMemories(memoryService.list());
    }

    return result;
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
      selectedMemory,
      currentWeather,
      addMemory,
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
      selectedMemory,
      currentWeather,
      addMemory,
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

export function useAppStore() {
  const value = useContext(AppStoreContext);

  if (!value) {
    throw new Error("useAppStore must be used inside AppStoreProvider");
  }

  return value;
}

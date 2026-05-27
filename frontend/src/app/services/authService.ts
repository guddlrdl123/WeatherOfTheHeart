import type { AppUser, LoginInput, SignupInput } from "../types/auth";
import { readStorage, writeStorage } from "../lib/storage";
import { requestApi } from "./api";

const USER_KEY = "maeum-weather:user";
const ADMIN_EMAIL = "admin@maeum.weather";
const ADMIN_PASSWORD = "admin1234";

const ADMIN_USER: AppUser = {
  id: "admin",
  email: ADMIN_EMAIL,
  nickname: "Admin",
  joinedAt: "2026-05-01T00:00:00.000Z",
  isAdmin: true,
};

// 같은 이메일을 같은 사용자로 처리하기 위해 입력값을 정규화합니다.
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type AuthResponse = {
  id: number;
  email: string;
  nickname: string;
  joinedAt: string;
};

function toAppUser(response: AuthResponse): AppUser {
  // 백엔드 DB id는 숫자지만 기존 프론트 타입과 맞추기 위해 문자열로 보관합니다.
  return {
    id: String(response.id),
    email: response.email,
    nickname: response.nickname,
    joinedAt: response.joinedAt,
  };
}

// 이번 API 연동 변경: 인증은 백엔드 API를 호출하고, 새로고침 복원을 위해 현재 사용자만 localStorage에 보관합니다.
export const authService = {
  getCurrentUser(): AppUser | null {
    const user = readStorage<AppUser | null>(USER_KEY, null);

    if (user?.email === ADMIN_EMAIL) {
      return ADMIN_USER;
    }

    // 예전 mock 로그인 id("me")가 남아 있으면 /api/users/me 요청으로 500이 나므로 자동 정리합니다.
    if (user && !/^\d+$/.test(user.id)) {
      writeStorage<AppUser | null>(USER_KEY, null);
      return null;
    }

    return user;
  },

  async login(input: LoginInput): Promise<AppUser> {
    const email = normalizeEmail(input.email);

    if (email === ADMIN_EMAIL && input.password !== ADMIN_PASSWORD) {
      throw new Error("invalid_admin_password");
    }

    if (email === ADMIN_EMAIL) {
      writeStorage(USER_KEY, ADMIN_USER);
      return ADMIN_USER;
    }

    // mock 로그인 대신 DB에 저장된 유저를 백엔드에서 조회합니다.
    const user = toAppUser(await requestApi<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: input.password,
      }),
    }));
    writeStorage(USER_KEY, user);
    return user;
  },

  async signup(input: SignupInput): Promise<AppUser> {
    // 회원가입도 백엔드에 저장된 사용자 id를 받아 이후 메모리 API의 userId로 사용합니다.
    const user = toAppUser(await requestApi<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: normalizeEmail(input.email),
        password: input.password,
        nickname: input.nickname.trim(),
      }),
    }));
    writeStorage(USER_KEY, user);
    return user;
  },

  logout() {
    writeStorage<AppUser | null>(USER_KEY, null);
  },
};

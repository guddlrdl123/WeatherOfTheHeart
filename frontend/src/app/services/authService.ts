import type { AppUser, LoginInput, SignupInput } from "../types/auth";
import { readStorage, writeStorage } from "../lib/storage";
import { requestApi } from "./api";

const USER_KEY = "maeum-weather:user";

// 같은 이메일을 같은 사용자로 처리하기 위해 입력값을 정규화합니다.
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type AuthResponse = {
  id: number;
  email: string;
  nickname: string;
  isAdmin: boolean;
  joinedAt: string;
};

function toAppUser(response: AuthResponse): AppUser {
  // 백엔드 DB id는 숫자지만 기존 프론트 타입과 맞추기 위해 문자열로 보관합니다.
  return {
    id: String(response.id),
    email: response.email,
    nickname: response.nickname,
    joinedAt: response.joinedAt,
    // 관리자 여부는 이제 프론트 하드코딩이 아니라 백엔드 users.is_admin 값에서 내려옵니다.
    isAdmin: response.isAdmin,
  };
}

// 이번 API 연동 변경: 인증은 백엔드 API를 호출하고, 새로고침 복원을 위해 현재 사용자만 localStorage에 보관합니다.
export const authService = {
  getCurrentUser(): AppUser | null {
    const user = readStorage<AppUser | null>(USER_KEY, null);

    // 예전 mock 로그인 id("me", "admin")가 남아 있으면 백엔드 숫자 userId 요청이 깨지므로 자동 정리합니다.
    if (user && !/^\d+$/.test(user.id)) {
      writeStorage<AppUser | null>(USER_KEY, null);
      return null;
    }

    return user;
  },

  async login(input: LoginInput): Promise<AppUser> {
    const email = normalizeEmail(input.email);

    // 일반 사용자와 관리자 모두 백엔드 로그인 API를 통해 DB 권한 값을 받습니다.
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

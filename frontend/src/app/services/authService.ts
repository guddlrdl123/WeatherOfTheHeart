import { MOCK_USER } from "../constants/mockData";
import type { AppUser, LoginInput, SignupInput } from "../types/auth";
import { createId, readStorage, writeStorage } from "../lib/storage";

const USER_KEY = "maeum-weather:user";

// 같은 이메일을 같은 사용자로 처리하기 위해 입력값을 정규화합니다.
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// 실제 인증 API가 생기기 전까지 localStorage로 동작하는 mock auth 서비스입니다.
export const authService = {
  getCurrentUser(): AppUser | null {
    return readStorage<AppUser | null>(USER_KEY, null);
  },

  login(input: LoginInput): AppUser {
    const saved = this.getCurrentUser();

    // 이미 저장된 사용자가 같은 이메일이면 그 사용자를 그대로 로그인시킵니다.
    if (saved && saved.email === normalizeEmail(input.email)) {
      return saved;
    }

    const user: AppUser = {
      ...MOCK_USER,
      email: normalizeEmail(input.email),
    };
    writeStorage(USER_KEY, user);
    return user;
  },

  signup(input: SignupInput): AppUser {
    // 회원가입은 새 사용자 id와 가입 시각을 만들어 저장합니다.
    const user: AppUser = {
      id: createId("user"),
      email: normalizeEmail(input.email),
      nickname: input.nickname.trim(),
      joinedAt: new Date().toISOString(),
    };
    writeStorage(USER_KEY, user);
    return user;
  },

  logout() {
    writeStorage<AppUser | null>(USER_KEY, null);
  },
};

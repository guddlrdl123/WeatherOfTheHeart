import { MOCK_USER } from "../constants/mockData";
import type { AppUser, LoginInput, SignupInput } from "../types/auth";
import { createId, readStorage, writeStorage } from "../lib/storage";

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

// 실제 인증 API가 생기기 전까지 localStorage로 동작하는 mock auth 서비스입니다.
export const authService = {
  getCurrentUser(): AppUser | null {
    const user = readStorage<AppUser | null>(USER_KEY, null);

    if (user?.email === ADMIN_EMAIL) {
      return ADMIN_USER;
    }

    return user;
  },

  login(input: LoginInput): AppUser {
    const email = normalizeEmail(input.email);

    if (email === ADMIN_EMAIL && input.password !== ADMIN_PASSWORD) {
      throw new Error("invalid_admin_password");
    }

    if (email === ADMIN_EMAIL) {
      writeStorage(USER_KEY, ADMIN_USER);
      return ADMIN_USER;
    }

    const saved = this.getCurrentUser();

    // 이미 저장된 사용자가 같은 이메일이면 그 사용자를 그대로 로그인시킵니다.
    if (saved && saved.email === email) {
      return saved;
    }

    const user: AppUser = {
      ...MOCK_USER,
      email,
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

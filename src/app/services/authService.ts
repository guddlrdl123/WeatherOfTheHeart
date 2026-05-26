import { MOCK_USER } from "../constants/mockData";
import type { AppUser, LoginInput, SignupInput } from "../types/auth";
import { createId, readStorage, writeStorage } from "../lib/storage";

const USER_KEY = "maeum-weather:user";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const authService = {
  getCurrentUser(): AppUser | null {
    return readStorage<AppUser | null>(USER_KEY, null);
  },

  login(input: LoginInput): AppUser {
    const saved = this.getCurrentUser();

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

export type AppUser = {
  id: string;
  email: string;
  nickname: string;
  joinedAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = LoginInput & {
  nickname: string;
};

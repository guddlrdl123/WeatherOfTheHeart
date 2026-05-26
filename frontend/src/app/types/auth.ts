// 로그인/회원가입 이후 앱 전역에서 사용하는 사용자 정보입니다.
export type AppUser = {
  id: string;
  email: string;
  nickname: string;
  joinedAt: string;
};

// 로그인 폼에서 서비스로 전달하는 입력값입니다.
export type LoginInput = {
  email: string;
  password: string;
};

// 회원가입은 로그인 입력값에 닉네임을 추가로 받습니다.
export type SignupInput = LoginInput & {
  nickname: string;
};

// 간단한 브라우저 history 라우터에서 사용하는 경로 타입입니다.
// /plazas/:id 같은 동적 경로 때문에 마지막에 string을 허용합니다.
export type AppRoute =
  | "/"
  | "/login"
  | "/signup"
  | "/room"
  | "/plazas"
  | "/plazas/new"
  | "/mailbox"
  | "/profile"
  | string;

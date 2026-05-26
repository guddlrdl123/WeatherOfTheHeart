import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";

// 모든 페이지가 공통 헤더와 같은 배경 컨테이너를 공유하도록 감싸는 컴포넌트입니다.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mw-app">
      <AppHeader />
      {children}
    </div>
  );
}

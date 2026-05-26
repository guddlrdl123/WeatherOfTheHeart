import "./app.css";
import { AppShell } from "./components/layout/AppShell";
import { AuthRequired } from "./components/layout/AuthRequired";
import { AppStoreProvider, useAppStore } from "./stores/AppStore";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { MailboxPage } from "./pages/MailboxPage";
import { PlazaDetailPage } from "./pages/PlazaDetailPage";
import { PlazaListPage } from "./pages/PlazaListPage";
import { PlazaNewPage } from "./pages/PlazaNewPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RoomPage } from "./pages/RoomPage";
import { SignupPage } from "./pages/SignupPage";

// AppStore의 route 값을 보고 현재 보여줄 페이지 컴포넌트를 고릅니다.
// react-router 없이 window.history와 Context만으로 만든 가벼운 라우터입니다.
function AppRouter() {
  const { route, user } = useAppStore();
  const isProtectedRoute =
    route === "/room" || route === "/plazas" || route === "/plazas/new" || route === "/mailbox" || route === "/profile" || route.startsWith("/plazas/");

  // 로그인하지 않은 사용자가 보호된 화면에 접근하면 로그인 안내 화면을 보여줍니다.
  if (isProtectedRoute && !user) {
    return <AuthRequired />;
  }

  if (route === "/") {
    return <LandingPage />;
  }

  if (route === "/login") {
    return <LoginPage />;
  }

  if (route === "/signup") {
    return <SignupPage />;
  }

  if (route === "/room") {
    return <RoomPage />;
  }

  if (route === "/plazas") {
    return <PlazaListPage />;
  }

  if (route === "/plazas/new") {
    return <PlazaNewPage />;
  }

  if (route.startsWith("/plazas/")) {
    return <PlazaDetailPage plazaId={route.replace("/plazas/", "")} />;
  }

  if (route === "/mailbox") {
    return <MailboxPage />;
  }

  if (route === "/profile") {
    return <ProfilePage />;
  }

  return <LandingPage />;
}

// 앱 전체에 전역 상태 Provider와 공통 레이아웃을 씌우는 최상위 컴포넌트입니다.
export default function App() {
  return (
    <AppStoreProvider>
      <AppShell>
        <AppRouter />
      </AppShell>
    </AppStoreProvider>
  );
}

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

function AppRouter() {
  const { route, user } = useAppStore();
  const isProtectedRoute =
    route === "/room" || route === "/plazas" || route === "/plazas/new" || route === "/mailbox" || route === "/profile" || route.startsWith("/plazas/");

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

export default function App() {
  return (
    <AppStoreProvider>
      <AppShell>
        <AppRouter />
      </AppShell>
    </AppStoreProvider>
  );
}

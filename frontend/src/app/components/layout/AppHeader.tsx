import { LogOut, Moon, Plus, Sun } from "lucide-react";
import { useAppStore } from "../../stores/AppStore";
import type { AppRoute } from "../../types/route";

const authLinks: { label: string; route: AppRoute }[] = [
  { label: "로그인", route: "/login" },
  { label: "회원가입", route: "/signup" },
];

const appLinks: { label: string; route: AppRoute }[] = [
  { label: "내 방", route: "/room" },
  { label: "광장", route: "/plazas" },
  { label: "우편함", route: "/mailbox" },
  { label: "마이페이지", route: "/profile" },
];

// 로그인 여부에 따라 다른 메뉴를 보여주는 공통 상단 내비게이션입니다.
export function AppHeader() {
  const { route, navigate, user, logout, theme, toggleTheme } = useAppStore();
  const links = user ? appLinks : authLinks;

  return (
    <header className="mw-header sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mw-brand text-left text-[0.9rem] tracking-[0.08em]"
          style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}
        >
          마음의 날씨
        </button>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            // 광장 상세 페이지도 광장 메뉴가 활성화된 것으로 표시합니다.
            const active = route === link.route || (link.route === "/plazas" && route.startsWith("/plazas"));

            return (
              <button
                key={link.route}
                type="button"
                onClick={() => navigate(link.route)}
                className="mw-nav-link rounded-md px-3 py-2 text-[0.78rem] transition"
                data-active={active ? "true" : "false"}
              >
                {link.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={toggleTheme}
            className="mw-icon-button ml-2 grid h-9 w-9 place-items-center rounded-md border"
            aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
            title={theme === "dark" ? "라이트 모드" : "다크 모드"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user && (
            // 로그인 후에만 빠른 이동 아이콘들을 보여줍니다.
            <>
              <button
                type="button"
                onClick={() => navigate("/plazas/new")}
                className="mw-icon-button grid h-9 w-9 place-items-center rounded-md border"
                aria-label="새 광장 만들기"
              >
                <Plus size={16} />
              </button>
              <button
                type="button"
                onClick={logout}
                className="mw-icon-button grid h-9 w-9 place-items-center rounded-md border"
                aria-label="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

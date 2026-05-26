import { LockKeyhole } from "lucide-react";
import { useAppStore } from "../../stores/AppStore";

export function AuthRequired() {
  const { navigate } = useAppStore();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[760px] items-center justify-center px-5">
      <section className="mw-surface w-full rounded-xl p-10 text-center">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full border border-white/10 text-[#d8bd9a]">
          <LockKeyhole size={20} />
        </div>
        <h1 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
          잠시 로그인하고 들어갈게요
        </h1>
        <p className="mx-auto mt-4 max-w-[420px] text-sm leading-7 text-white/48">
          개인 방과 광장, 우편함은 기록이 조용히 보관되는 공간이라 로그인 후 사용할 수 있어요.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <button type="button" onClick={() => navigate("/login")} className="mw-button-solid rounded-md px-5 py-2 text-sm">
            로그인
          </button>
          <button type="button" onClick={() => navigate("/signup")} className="mw-button rounded-md px-5 py-2 text-sm">
            회원가입
          </button>
        </div>
      </section>
    </main>
  );
}

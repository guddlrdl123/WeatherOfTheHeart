import { FormEvent, useState } from "react";
import { useAppStore } from "../../stores/AppStore";

// 백엔드 로그인 API를 호출하는 로그인 폼입니다.
export function LoginForm() {
  const { login, navigate } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // 사용자가 바로 이해할 수 있는 최소한의 프론트 validation만 수행합니다.
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("올바른 이메일 형식으로 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      // 이번 API 연동 변경: 제출 시 authService가 /api/auth/login을 호출합니다.
      await login({ email, password });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setError(message.includes("Failed to fetch") ? "서버와 연결할 수 없어요. 백엔드 실행 상태를 확인해 주세요." : "이메일 또는 비밀번호가 맞지 않습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mw-surface mx-auto flex w-full max-w-[420px] flex-col gap-4 rounded-xl p-8">
      <div>
        <p className="mb-2 text-[0.68rem] tracking-[0.2em] text-white/30">LOGIN</p>
        <h1 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
          다시 방으로 돌아가기
        </h1>
      </div>

      <label className="flex flex-col gap-2 text-sm text-white/54">
        이메일
        <input
          className="mw-input h-11 px-3 text-sm"
          type="email"
          value={email}
          autoComplete="email"
          disabled={isSubmitting}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/54">
        비밀번호
        <input
          className="mw-input h-11 px-3 text-sm"
          type="password"
          value={password}
          autoComplete="current-password"
          disabled={isSubmitting}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {error && (
        <p role="alert" className="rounded-md border border-[#e6a1a1]/30 bg-[#e6a1a1]/10 px-3 py-2 text-sm leading-6 text-[#e6a1a1]">
          {error}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="mw-button-solid mt-2 rounded-md px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50">
        {isSubmitting ? "로그인 중" : "로그인"}
      </button>

      <p className="text-center text-sm text-white/38">
        처음 오셨나요?
        <button type="button" onClick={() => navigate("/signup")} className="ml-2 text-[#d8bd9a] hover:text-[#ead2b1]">
          회원가입
        </button>
      </p>
    </form>
  );
}

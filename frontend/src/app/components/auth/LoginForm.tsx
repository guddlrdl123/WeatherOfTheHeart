import { FormEvent, useState } from "react";
import { useAppStore } from "../../stores/AppStore";

// 실제 API 대신 authService mock 로그인으로 연결되는 로그인 폼입니다.
export function LoginForm() {
  const { login, navigate } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    login({ email, password });
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
        <input className="mw-input h-11 px-3 text-sm" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/54">
        비밀번호
        <input
          className="mw-input h-11 px-3 text-sm"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {error && <p className="text-sm text-[#e6a1a1]">{error}</p>}

      <button type="submit" className="mw-button-solid mt-2 rounded-md px-5 py-3 text-sm">
        로그인
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

import { FormEvent, useState } from "react";
import { useAppStore } from "../../stores/AppStore";

// mock 회원가입을 수행하고 성공하면 내 방으로 이동시키는 폼입니다.
export function SignupForm() {
  const { signup, navigate } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // 백엔드가 붙기 전에도 사용 흐름을 확인할 수 있도록 기본 검증을 둡니다.
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("올바른 이메일 형식으로 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (nickname.trim().length < 2) {
      setError("닉네임은 2자 이상 입력해주세요.");
      return;
    }

    signup({ email, password, nickname });
  }

  return (
    <form onSubmit={handleSubmit} className="mw-surface mx-auto flex w-full max-w-[440px] flex-col gap-4 rounded-xl p-8">
      <div>
        <p className="mb-2 text-[0.68rem] tracking-[0.2em] text-white/30">SIGNUP</p>
        <h1 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
          조용한 방 하나 만들기
        </h1>
      </div>

      <label className="flex flex-col gap-2 text-sm text-white/54">
        이메일
        <input className="mw-input h-11 px-3 text-sm" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/54">
        닉네임
        <input className="mw-input h-11 px-3 text-sm" value={nickname} onChange={(event) => setNickname(event.target.value)} />
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

      <label className="flex flex-col gap-2 text-sm text-white/54">
        비밀번호 확인
        <input
          className="mw-input h-11 px-3 text-sm"
          type="password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />
      </label>

      {error && <p className="text-sm text-[#e6a1a1]">{error}</p>}

      <button type="submit" className="mw-button-solid mt-2 rounded-md px-5 py-3 text-sm">
        회원가입
      </button>

      <p className="text-center text-sm text-white/38">
        이미 계정이 있나요?
        <button type="button" onClick={() => navigate("/login")} className="ml-2 text-[#d8bd9a] hover:text-[#ead2b1]">
          로그인
        </button>
      </p>
    </form>
  );
}

import { SignupForm } from "../components/auth/SignupForm";

// 회원가입 폼을 가운데 배치하는 페이지 래퍼입니다.
export function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10">
      <SignupForm />
    </main>
  );
}

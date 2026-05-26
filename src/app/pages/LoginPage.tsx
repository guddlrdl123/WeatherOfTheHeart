import { LoginForm } from "../components/auth/LoginForm";

export function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10">
      <LoginForm />
    </main>
  );
}

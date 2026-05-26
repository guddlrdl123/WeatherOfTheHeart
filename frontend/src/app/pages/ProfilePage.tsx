import { ProfileSummary } from "../components/profile/ProfileSummary";

// 마이페이지는 실제 내용 컴포넌트를 페이지 여백 안에 배치합니다.
export function ProfilePage() {
  return (
    <main className="px-5 py-8">
      <ProfileSummary />
    </main>
  );
}

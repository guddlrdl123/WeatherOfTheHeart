import { Archive, Mail, PanelsTopLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useAppStore } from "../../stores/AppStore";

export function ProfileSummary() {
  const { user, memories, plazaEntries, mailboxItems, logout } = useAppStore();
  const myPlazaCount = user ? plazaEntries.filter((entry) => entry.ownerId === user.id).length : 0;

  if (!user) {
    return null;
  }

  return (
    <section className="mx-auto grid max-w-[980px] gap-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="mw-surface rounded-xl p-7">
        <p className="mb-2 text-[0.68rem] tracking-[0.22em] text-white/28">PROFILE</p>
        <h1 className="text-2xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
          {user.nickname}의 조용한 기록
        </h1>
        <dl className="mt-7 space-y-4 text-sm">
          <div className="flex justify-between gap-4 border-b border-white/7 pb-3">
            <dt className="text-white/34">이메일</dt>
            <dd className="text-white/58">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/7 pb-3">
            <dt className="text-white/34">닉네임</dt>
            <dd className="text-white/58">{user.nickname}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-white/7 pb-3">
            <dt className="text-white/34">가입일</dt>
            <dd className="text-white/58">{user.joinedAt.slice(0, 10).replaceAll("-", ".")}</dd>
          </div>
        </dl>
        <button type="button" onClick={logout} className="mw-button mt-7 rounded-md px-5 py-2 text-sm">
          로그아웃
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Archive size={18} />} label="남긴 기록" value={memories.length} />
          <StatCard icon={<PanelsTopLeft size={18} />} label="참여 광장" value={myPlazaCount} />
          <StatCard icon={<Mail size={18} />} label="받은 우편" value={mailboxItems.length} />
        </div>
        <div className="mw-surface rounded-xl p-7">
          <h2 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
            마음의 날씨는 조용한 보관함이에요.
          </h2>
          <p className="mt-4 text-sm leading-8 text-white/52">
            개인 방의 기록은 본인만 보는 전제로 남겨집니다. 광장에서는 닉네임 대신 오브젝트만 놓여요.
            말하지 못한 이야기가 너무 크게 들리지 않도록, 이곳에서는 천천히 머물 수 있게 만들고 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="mw-surface rounded-xl p-5">
      <div className="mb-3 text-[#d8bd9a]">{icon}</div>
      <p className="text-[0.72rem] text-white/34">{label}</p>
      <strong className="mt-1 block text-2xl font-normal text-[#e0d2ba]">{value}</strong>
    </div>
  );
}

import { useState } from "react";
import { X } from "lucide-react";
import { MailboxCard } from "../components/mailbox/MailboxCard";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useAppStore } from "../stores/AppStore";
import type { MailboxItem } from "../types/mailbox";
import { formatDotDate } from "../utils/date";

// 광장이 완성되었을 때 도착하는 메시지를 보여주는 우편함 화면입니다.
export function MailboxPage() {
  const { mailboxItems, markMailboxRead } = useAppStore();
  const [selected, setSelected] = useState<MailboxItem | null>(null);

  function handleSelect(item: MailboxItem) {
    // 우편을 열면 읽음 처리하고, 모달에는 읽음 상태로 표시합니다.
    markMailboxRead(item.id);
    setSelected({ ...item, read: true });
  }

  return (
    <main className="mx-auto max-w-[920px] px-5 py-8">
      <div className="mb-7">
        <p className="mb-2 text-[0.68rem] tracking-[0.22em] text-white/28">MAILBOX</p>
        <h1 className="text-3xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
          광장이 완성되면 우편이 도착해요.
        </h1>
      </div>
      <div className="grid gap-4">
        {mailboxItems.map((item) => (
          <MailboxCard key={item.id} item={item} onClick={handleSelect} />
        ))}
      </div>
      {selected && <MailboxModal item={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

// 우편 항목을 눌렀을 때 보여주는 상세 모달입니다.
function MailboxModal({ item, onClose }: { item: MailboxItem; onClose: () => void }) {
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm">
      <section className="mw-fade-in mw-surface w-full max-w-[460px] rounded-xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[0.68rem] tracking-[0.18em] text-white/30">{formatDotDate(item.completedAt)}</p>
            <h2 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
              {item.title}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border border-white/10 hover:bg-white/5" aria-label="닫기">
            <X size={17} />
          </button>
        </div>
        {item.generatedImageData && (
          <img
            src={item.generatedImageData}
            alt={`${item.plazaTitle} 완성 이미지`}
            className="mb-5 aspect-square w-full rounded-md border border-white/10 object-cover"
          />
        )}
        <p className="text-sm leading-8 text-white/56">{item.message}</p>
        <p className="mt-5 rounded-md border border-white/8 bg-white/[0.03] p-4 text-sm text-white/42">관련 광장: {item.plazaTitle}</p>
      </section>
    </div>
  );
}

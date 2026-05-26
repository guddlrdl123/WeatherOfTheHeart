import type { MailboxItem } from "../../types/mailbox";
import { formatDotDate } from "../../utils/date";

// 우편함 목록에서 우편 하나를 보여주는 카드 버튼입니다.
export function MailboxCard({
  item,
  onClick,
}: {
  item: MailboxItem;
  onClick: (item: MailboxItem) => void;
}) {
  return (
    <button type="button" onClick={() => onClick(item)} className="mw-surface w-full rounded-xl p-5 text-left transition hover:bg-white/[0.055]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] text-white/38">{item.plazaTitle}</span>
        <span
          className="rounded-full border px-3 py-1 text-[0.68rem]"
          style={{
            borderColor: item.read ? "rgba(255,255,255,0.1)" : "rgba(200,150,106,0.4)",
            color: item.read ? "rgba(224,216,200,0.36)" : "#d8bd9a",
          }}
        >
          {item.read ? "읽음" : "안읽음"}
        </span>
      </div>
      <h2 className="text-lg font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
        {item.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/50">{item.message}</p>
      <p className="mt-4 text-[0.72rem] text-white/30">{formatDotDate(item.completedAt)}</p>
    </button>
  );
}

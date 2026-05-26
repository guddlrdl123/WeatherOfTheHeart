import { X } from "lucide-react";
import { OBJECT_BY_KEY } from "../../constants/objects";
import { WEATHER_BY_KEY } from "../../constants/weather";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { formatDotDate } from "../../utils/date";
import type { SceneObjectRecord } from "../object/RoomObjectItem";

// 오브젝트를 클릭했을 때 해당 기록 내용을 보여주는 팝업입니다.
export function MemoryPopup({
  record,
  onClose,
}: {
  record: SceneObjectRecord;
  onClose: () => void;
}) {
  const object = OBJECT_BY_KEY[record.objectKey];
  const weather = WEATHER_BY_KEY[record.weatherKey];
  // 모달을 열었을 때 ESC 키로 닫을 수 있게 합니다.
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm">
      <section className="mw-fade-in mw-surface w-full max-w-[430px] rounded-xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl" style={{ fontFamily: '"Apple Color Emoji","Noto Color Emoji",system-ui,sans-serif' }}>
              {object?.icon ?? "•"}
            </span>
            <div>
              <p className="text-[0.68rem] text-white/30">{record.memoryDate ? formatDotDate(record.memoryDate) : weather.label}</p>
              <h2 className="text-lg font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
                {record.title?.trim() || "제목 없는 기억"}
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border border-white/10 hover:bg-white/5" aria-label="닫기">
            <X size={17} />
          </button>
        </div>
        <p className="text-sm leading-8 text-[#d6c8ae]/74">{record.content}</p>
        <p className="mt-5 text-[0.72rem] leading-6 text-white/34">
          {weather.quietText} 오늘의 이야기가 방에 남았어요.
        </p>
      </section>
    </div>
  );
}

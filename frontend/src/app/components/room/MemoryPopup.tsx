import { X } from "lucide-react";
import { OBJECT_BY_KEY } from "../../constants/objects";
import { WEATHER_BY_KEY } from "../../constants/weather";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { formatDotDate } from "../../utils/date";
import type { SceneObjectRecord } from "../object/RoomObjectItem";

export function MemoryPopup({
  record,
  onClose,
}: {
  record: SceneObjectRecord;
  onClose: () => void;
}) {
  const object = OBJECT_BY_KEY[record.objectKey];
  const weather = WEATHER_BY_KEY[record.weatherKey] ?? WEATHER_BY_KEY.cloudy;
  const popupImageSize = Math.round(48 * Math.min(object?.imageScale ?? 1.15, 2.2));

  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm">
      <section className="mw-fade-in mw-surface w-full max-w-[430px] rounded-xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {object?.imageUrl ? (
              <img
                src={object.imageUrl}
                alt=""
                className="object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.3)]"
                style={{ width: popupImageSize, height: popupImageSize }}
              />
            ) : (
              <span className="text-3xl" style={{ fontFamily: '"Apple Color Emoji","Noto Color Emoji",system-ui,sans-serif' }}>
                {object?.icon ?? "?"}
              </span>
            )}
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
          {weather.quietText} 오늘의 이야기가 방에 남아 있어요.
        </p>
      </section>
    </div>
  );
}

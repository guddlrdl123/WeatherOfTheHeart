import { OBJECT_BY_KEY } from "../../constants/objects";
import type { ObjectSlotKey } from "../../types/object";
import type { WeatherKey } from "../../types/weather";

export type SceneObjectRecord = {
  id: string;
  title?: string;
  content: string;
  memoryDate?: string;
  weatherKey: WeatherKey;
  objectKey: string;
  slotKey: ObjectSlotKey;
  ownerId?: string;
};

export function RoomObjectItem({
  record,
  left,
  top,
  faded,
  onClick,
}: {
  record: SceneObjectRecord;
  left: number;
  top: number;
  faded?: boolean;
  onClick: (record: SceneObjectRecord) => void;
}) {
  const object = OBJECT_BY_KEY[record.objectKey];
  const title = record.title?.trim() || "제목 없는 기억";

  return (
    <button
      type="button"
      className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        opacity: faded ? 0.28 : 1,
      }}
      onClick={() => onClick(record)}
      aria-label={`${object?.name ?? "오브젝트"} 글 보기`}
    >
      <span
        className="block text-center transition-transform group-hover:scale-110"
        style={{
          minWidth: 34,
          fontSize: object?.objectKey === "rug" ? "2.2rem" : "1.9rem",
          color: "#d8bd9a",
          fontFamily: '"Apple Color Emoji","Noto Color Emoji",system-ui,sans-serif',
        }}
      >
        {object?.icon ?? "•"}
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#101421] px-2 py-1 text-[0.68rem] text-[#e0d8c8] group-hover:block">
        {title}
      </span>
    </button>
  );
}

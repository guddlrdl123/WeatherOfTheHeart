import { OBJECT_BY_KEY, ROOM_OBJECTS } from "../../constants/objects";
import type { RoomObject } from "../../types/object";

// 글 작성 모달에서 오브젝트를 고르는 선택 영역입니다.
export function ObjectPicker({
  value,
  onChange,
  scope = "private",
}: {
  value: string;
  onChange: (object: RoomObject) => void;
  scope?: "private" | "plaza";
}) {
  // 개인 방과 광장에 허용된 오브젝트가 다르므로 scope에 맞춰 필터링합니다.
  const objects = ROOM_OBJECTS.filter((object) => (scope === "private" ? object.allowPrivate : object.allowPlaza));

  return (
    <div className="grid max-h-[210px] grid-cols-3 gap-2 overflow-y-auto pr-1 md:grid-cols-4">
      {objects.map((object) => {
        const selected = value === object.objectKey;

        return (
          <button
            key={object.objectKey}
            type="button"
            onClick={() => onChange(OBJECT_BY_KEY[object.objectKey])}
            className="rounded-md border p-3 text-left transition hover:bg-white/5"
            style={{
              borderColor: selected ? "rgba(200,150,106,0.62)" : "rgba(255,255,255,0.08)",
              background: selected ? "rgba(200,150,106,0.12)" : "rgba(255,255,255,0.025)",
            }}
          >
            <span className="mb-2 block text-xl" style={{ fontFamily: '"Apple Color Emoji","Noto Color Emoji",system-ui,sans-serif' }}>
              {object.icon}
            </span>
            <span className="block text-[0.74rem] text-[#e0d8c8]">{object.name}</span>
            <span className="mt-1 block text-[0.64rem] leading-4 text-white/35">{object.description}</span>
          </button>
        );
      })}
    </div>
  );
}

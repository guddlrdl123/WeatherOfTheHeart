import { OBJECT_BY_KEY, ROOM_OBJECTS } from "../../constants/objects";
import type { RoomObject } from "../../types/object";

export function ObjectPicker({
  value,
  onChange,
  scope = "private",
}: {
  value: string;
  onChange: (object: RoomObject) => void;
  scope?: "private" | "plaza";
}) {
  const objects = ROOM_OBJECTS.filter((object) => (scope === "private" ? object.allowPrivate : object.allowPlaza));

  return (
    <div className="grid max-h-[210px] grid-cols-3 gap-2 overflow-y-auto pr-1 md:grid-cols-4">
      {objects.map((object) => {
        const selected = value === object.objectKey;
        const pickerImageSize = Math.round(56 * Math.min(object.imageScale ?? 1.15, 2.2));

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
            <span className="mb-2 flex h-16 items-center justify-center rounded-md bg-black/10">
              {object.imageUrl ? (
                <img
                  src={object.imageUrl}
                  alt=""
                  className="object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.28)]"
                  style={{ width: pickerImageSize, height: pickerImageSize }}
                />
              ) : (
                <span className="text-xl" style={{ fontFamily: '"Apple Color Emoji","Noto Color Emoji",system-ui,sans-serif' }}>
                  {object.icon}
                </span>
              )}
            </span>
            <span className="block text-[0.74rem] text-[#e0d8c8]">{object.name}</span>
            <span className="mt-1 block text-[0.64rem] leading-4 text-white/35">{object.description}</span>
          </button>
        );
      })}
    </div>
  );
}

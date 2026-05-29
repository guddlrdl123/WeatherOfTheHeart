import { OBJECT_BY_KEY, ROOM_OBJECTS } from "../../constants/objects";
import type { RoomObject } from "../../types/object";
import { ObjectImage } from "./ObjectImage";

export function ObjectPicker({
  value,
  onChange,
  scope = "private",
  disabledObjectKeys = [],
}: {
  value: string;
  onChange: (object: RoomObject) => void;
  scope?: "private" | "plaza";
  disabledObjectKeys?: string[];
}) {
  const objects = ROOM_OBJECTS.filter((object) => (scope === "private" ? object.allowPrivate : object.allowPlaza));
  const disabledKeys = new Set(disabledObjectKeys);

  return (
    <div className="grid max-h-[210px] grid-cols-3 gap-2 overflow-y-auto pr-1 md:grid-cols-4">
      {objects.map((object) => {
        const selected = value === object.objectKey;
        const disabled = disabledKeys.has(object.objectKey);
        const pickerImageSize = Math.round(56 * Math.min(object.imageScale ?? 1.15, 2.2));
        const pickerTransform = `scaleX(${object.flipX ? -1 : 1}) rotate(${object.tiltDeg ?? 0}deg)`;

        return (
          <button
            key={object.objectKey}
            type="button"
            disabled={disabled}
            onClick={() => onChange(OBJECT_BY_KEY[object.objectKey])}
            title={disabled ? "Already used this month" : undefined}
            className="rounded-md border p-3 text-left transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-35"
            style={{
              borderColor: selected ? "rgba(200,150,106,0.62)" : "rgba(255,255,255,0.08)",
              background: selected ? "rgba(200,150,106,0.12)" : "rgba(255,255,255,0.025)",
            }}
          >
            <span className="mb-2 flex h-16 items-center justify-center rounded-md bg-black/10">
              <ObjectImage
                object={object}
                width={pickerImageSize}
                height={pickerImageSize}
                transform={pickerTransform}
                className="object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.28)]"
                fallbackClassName="text-xl"
              />
            </span>
            <span className="block text-[0.74rem] text-[#e0d8c8]">{object.name}</span>
            <span className="mt-1 block text-[0.64rem] leading-4 text-white/35">{object.description}</span>
          </button>
        );
      })}
    </div>
  );
}

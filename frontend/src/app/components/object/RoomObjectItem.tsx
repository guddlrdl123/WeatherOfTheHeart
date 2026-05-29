import type { PointerEventHandler } from "react";
import { OBJECT_BY_KEY } from "../../constants/objects";
import type { ObjectSlotKey } from "../../types/object";
import type { WeatherKey } from "../../types/weather";
import { ObjectImage } from "./ObjectImage";

export type SceneObjectRecord = {
  id: string;
  title?: string;
  content: string;
  memoryDate?: string;
  weatherKey: WeatherKey;
  objectKey: string;
  slotKey: ObjectSlotKey;
  positionX?: number;
  positionY?: number;
  flipX?: boolean;
  tiltDeg?: number;
  ownerId?: string;
};

export function RoomObjectItem({
  record,
  left,
  top,
  zIndex,
  flipX,
  tiltDeg,
  faded,
  isDraft,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  record: SceneObjectRecord;
  left: number;
  top: number;
  zIndex?: number;
  flipX?: boolean;
  tiltDeg?: number;
  faded?: boolean;
  isDraft?: boolean;
  onClick: (record: SceneObjectRecord) => void;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
  onPointerMove?: PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: PointerEventHandler<HTMLButtonElement>;
  onPointerCancel?: PointerEventHandler<HTMLButtonElement>;
}) {
  const object = OBJECT_BY_KEY[record.objectKey];
  const title = record.title?.trim() || "제목 없는 기억";
  const baseImageSize = object?.objectKey === "carpet" ? { width: 76, height: 58 } : { width: 62, height: 62 };
  const imageScale = object?.imageScale ?? 1.35;
  const imageSize = {
    width: Math.round(baseImageSize.width * imageScale),
    height: Math.round(baseImageSize.height * imageScale),
  };
  const hitAreaSize = Math.max(72, Math.max(imageSize.width, imageSize.height));
  const shouldFlipX = flipX ?? record.flipX ?? object?.flipX ?? false;
  const objectTiltDeg = tiltDeg ?? record.tiltDeg ?? object?.tiltDeg ?? 0;
  const objectTransform = `scaleX(${shouldFlipX ? -1 : 1}) rotate(${objectTiltDeg}deg)`;

  return (
    <button
      type="button"
      className={`group absolute -translate-x-1/2 -translate-y-1/2 transition ${
        isDraft ? "z-30 cursor-grab touch-none active:cursor-grabbing" : "cursor-pointer"
      }`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        zIndex,
        opacity: faded ? 0.28 : 1,
      }}
      onClick={() => {
        if (!isDraft) {
          onClick(record);
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      aria-label={isDraft ? `${object?.name ?? "오브젝트"} 위치 옮기기` : `${object?.name ?? "오브젝트"} 기억 보기`}
    >
      <span
        className={`flex items-center justify-center transition-transform group-hover:scale-110 ${
          isDraft ? "rounded-full ring-2 ring-[#d8bd9a]/70 ring-offset-4 ring-offset-transparent" : ""
        }`}
        style={{
          minWidth: hitAreaSize,
          minHeight: hitAreaSize,
        }}
      >
        <ObjectImage
          object={object}
          width={imageSize.width}
          height={imageSize.height}
          transform={objectTransform}
          className="object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.36)]"
          fallbackClassName="block text-center"
        />
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#101421] px-2 py-1 text-[0.68rem] text-[#e0d8c8] group-hover:block">
        {title}
      </span>
    </button>
  );
}

import { useState } from "react";
import type { RoomObject } from "../../types/object";

export function ObjectImage({
  object,
  width,
  height,
  transform,
  className,
  fallbackClassName,
}: {
  object?: RoomObject;
  width: number;
  height: number;
  transform?: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);

  if (object?.imageUrl && !hasImageError) {
    return (
      <img
        src={object.imageUrl}
        alt=""
        draggable={false}
        className={className}
        style={{ width, height, transform }}
        // DB에 잘못된 imageUrl이 남아 있어도 깨진 이미지 아이콘 대신 fallback 표시를 사용합니다.
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <span
      className={fallbackClassName}
      style={{
        minWidth: Math.min(width, 48),
        fontSize: Math.max(20, Math.min(width, height, 34)),
        color: "#d8bd9a",
        fontFamily: '"Apple Color Emoji","Noto Color Emoji",system-ui,sans-serif',
        transform,
      }}
    >
      {object?.icon ?? "?"}
    </span>
  );
}

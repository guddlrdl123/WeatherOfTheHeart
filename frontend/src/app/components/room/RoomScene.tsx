import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { WEATHER_BY_KEY } from "../../constants/weather";
import { useAppStore } from "../../stores/AppStore";
import type { WeatherKey } from "../../types/weather";
import { WeatherEffect } from "./WeatherEffect";
import { RoomObjectLayer } from "../object/RoomObjectLayer";
import { RoomObjectItem, type SceneObjectRecord } from "../object/RoomObjectItem";

type SceneTone = {
  wall: string;
  wallTop: string;
  floor: string;
  windowTop: string;
  windowBottom: string;
};

type PlazaSceneBackground =
  | {
      type: "color";
      color: string;
    }
  | {
      type: "weather";
      weatherKey: WeatherKey;
    };

const LIGHT_SCENE_TONES: Record<WeatherKey, SceneTone> = {
  sunny: {
    wall: "#efe4d3",
    wallTop: "#f6eddd",
    floor: "#d9c6ae",
    windowTop: "#f0c77a",
    windowBottom: "#f6dda7",
  },
  rainy: {
    wall: "#dfe7ec",
    wallTop: "#edf3f5",
    floor: "#bdcbd0",
    windowTop: "#8ba8bd",
    windowBottom: "#607e95",
  },
  cloudy: {
    wall: "#e2e4e5",
    wallTop: "#f0efed",
    floor: "#c9c5bd",
    windowTop: "#a3b0b8",
    windowBottom: "#7f8d96",
  },
  sunset: {
    wall: "#f0dacd",
    wallTop: "#f6e5da",
    floor: "#d7b9a4",
    windowTop: "#e18b63",
    windowBottom: "#c86145",
  },
  night: {
    wall: "#dce1ed",
    wallTop: "#edf0f8",
    floor: "#bcc5d7",
    windowTop: "#607399",
    windowBottom: "#27365e",
  },
  snowy: {
    wall: "#e6edf0",
    wallTop: "#f2f6f7",
    floor: "#c8d4d8",
    windowTop: "#c9d9df",
    windowBottom: "#89a0ad",
  },
};

const FALLBACK_PLAZA_COLOR = "#65717c";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHexColor(color: string) {
  const trimmedColor = color.trim();

  if (/^#[0-9a-f]{6}$/i.test(trimmedColor)) {
    return trimmedColor;
  }

  if (/^#[0-9a-f]{3}$/i.test(trimmedColor)) {
    return `#${trimmedColor
      .slice(1)
      .split("")
      .map((value) => value + value)
      .join("")}`;
  }

  return FALLBACK_PLAZA_COLOR;
}

function hexToRgb(color: string) {
  const safeColor = normalizeHexColor(color).slice(1);

  return {
    r: Number.parseInt(safeColor.slice(0, 2), 16),
    g: Number.parseInt(safeColor.slice(2, 4), 16),
    b: Number.parseInt(safeColor.slice(4, 6), 16),
  };
}

function mixHexColor(color: string, targetColor: string, amount: number) {
  const from = hexToRgb(color);
  const to = hexToRgb(targetColor);
  const mix = (fromValue: number, toValue: number) => Math.round(fromValue + (toValue - fromValue) * amount);

  return `rgb(${mix(from.r, to.r)}, ${mix(from.g, to.g)}, ${mix(from.b, to.b)})`;
}

function getColorScene(color: string): SceneTone {
  const safeColor = normalizeHexColor(color);

  return {
    wall: safeColor,
    wallTop: mixHexColor(safeColor, "#ffffff", 0.2),
    floor: mixHexColor(safeColor, "#000000", 0.18),
    windowTop: mixHexColor(safeColor, "#ffffff", 0.28),
    windowBottom: mixHexColor(safeColor, "#000000", 0.22),
  };
}

export function RoomScene({
  weatherKey,
  records,
  mode = "room",
  myUserId,
  showMineOnly,
  onObjectClick,
  label,
  placementRecord,
  onPlacementMove,
  plazaBackground,
}: {
  weatherKey: WeatherKey;
  records: SceneObjectRecord[];
  mode?: "room" | "plaza";
  myUserId?: string;
  showMineOnly?: boolean;
  onObjectClick: (record: SceneObjectRecord) => void;
  label?: string;
  placementRecord?: SceneObjectRecord | null;
  onPlacementMove?: (position: { x: number; y: number }) => void;
  plazaBackground?: PlazaSceneBackground;
}) {
  const sceneRef = useRef<HTMLElement | null>(null);
  const isDraggingPlacementRef = useRef(false);
  const { theme } = useAppStore();
  const requestedWeatherKey = mode === "plaza" && plazaBackground?.type === "weather" ? plazaBackground.weatherKey : weatherKey;
  const safeWeatherKey = WEATHER_BY_KEY[requestedWeatherKey] ? requestedWeatherKey : "cloudy";
  const weather = WEATHER_BY_KEY[safeWeatherKey];
  const plazaColor = mode === "plaza" && plazaBackground?.type === "color" ? normalizeHexColor(plazaBackground.color) : null;
  const scene = plazaColor ? getColorScene(plazaColor) : theme === "light" ? LIGHT_SCENE_TONES[safeWeatherKey] : weather;

  function updatePlacementPosition(clientX: number, clientY: number) {
    const rect = sceneRef.current?.getBoundingClientRect();

    if (!rect || !onPlacementMove) {
      return;
    }

    const x = clamp(((clientX - rect.left) / rect.width) * 100, 5, 95);
    const y = clamp(((clientY - rect.top) / rect.height) * 100, 10, 90);
    onPlacementMove({ x: Math.round(x), y: Math.round(y) });
  }

  function handlePlacementPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    isDraggingPlacementRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePlacementPosition(event.clientX, event.clientY);
  }

  function handlePlacementPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!isDraggingPlacementRef.current) {
      return;
    }

    event.preventDefault();
    updatePlacementPosition(event.clientX, event.clientY);
  }

  function handlePlacementPointerEnd(event: ReactPointerEvent<HTMLButtonElement>) {
    isDraggingPlacementRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <section
      ref={sceneRef}
      className="relative min-h-[560px] overflow-hidden rounded-xl border border-white/8"
      style={{
        background: `linear-gradient(160deg, ${scene.wallTop}, ${scene.wall})`,
      }}
      aria-label={mode === "plaza" ? "광장 공간" : "나만의 방"}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_36%)]" />

      {mode === "room" && (
        <div className="absolute left-[8%] top-[10%] h-[46%] w-[28%]">
          <div className="relative h-full w-full overflow-hidden rounded-md border-[9px] border-[rgba(76,61,48,0.78)]">
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${scene.windowTop}, ${scene.windowBottom})` }} />
            <WeatherEffect weatherKey={safeWeatherKey} />
            <span className="absolute inset-y-0 left-1/2 w-[7px] -translate-x-1/2 bg-[rgba(76,61,48,0.72)]" />
            <span className="absolute inset-x-0 top-[47%] h-[7px] -translate-y-1/2 bg-[rgba(76,61,48,0.72)]" />
          </div>
        </div>
      )}

      {mode === "room" ? (
        <>
          <div
            className="absolute inset-x-0 bottom-0 h-[35%]"
            style={{ background: `linear-gradient(180deg, ${scene.floor}, ${theme === "light" ? "#b7aa9a" : "#050608"})` }}
          />
          <div className="absolute right-[9%] top-[18%] h-16 w-[2px] bg-[rgba(224,216,200,0.25)]" />
          <div className="absolute right-[8.2%] top-[30%] h-7 w-7 rounded-full bg-[rgba(223,191,141,0.22)]" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-x-0 bottom-0 h-[38%]"
            style={{ background: `linear-gradient(180deg, ${scene.floor}, ${theme === "light" ? "#b7aa9a" : "#050608"})` }}
          />
          <div className="absolute bottom-[32%] left-[52%] h-[2px] w-[34%] bg-[rgba(224,216,200,0.2)]" />
          <div className="absolute bottom-[26%] left-[50%] h-[9%] w-[38%] rounded-t-full border border-white/8 bg-[rgba(255,255,255,0.035)]" />
          <div className="absolute bottom-[22%] left-[12%] h-[10%] w-[20%] rounded-t-full border border-white/8 bg-[rgba(255,255,255,0.03)]" />
        </>
      )}

      {mode === "plaza" && !plazaColor && <WeatherEffect weatherKey={safeWeatherKey} />}

      <RoomObjectLayer
        records={records}
        mode={mode}
        myUserId={myUserId}
        showMineOnly={showMineOnly}
        onObjectClick={onObjectClick}
      />

      {placementRecord && (
        <RoomObjectItem
          record={placementRecord}
          left={placementRecord.positionX ?? 50}
          top={placementRecord.positionY ?? 68}
          isDraft
          onClick={() => undefined}
          onPointerDown={handlePlacementPointerDown}
          onPointerMove={handlePlacementPointerMove}
          onPointerUp={handlePlacementPointerEnd}
          onPointerCancel={handlePlacementPointerEnd}
        />
      )}

      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 text-[0.72rem] text-white/52">
        {plazaColor ? (
          <>
            <span className="h-3 w-3 rounded-full border border-white/20" style={{ background: plazaColor }} />
            <span>배경색</span>
          </>
        ) : (
          <>
            <span>{weather.icon}</span>
            <span>{weather.label}</span>
          </>
        )}
      </div>

      <div className="absolute right-5 top-5 max-w-[300px] text-right text-[0.78rem] leading-6 text-white/36">
        {label ?? weather.quietText}
      </div>
    </section>
  );
}

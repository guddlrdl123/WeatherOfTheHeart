import { WEATHER_BY_KEY } from "../../constants/weather";
import { useAppStore } from "../../stores/AppStore";
import type { WeatherKey } from "../../types/weather";
import { WeatherEffect } from "./WeatherEffect";
import { RoomObjectLayer } from "../object/RoomObjectLayer";
import type { SceneObjectRecord } from "../object/RoomObjectItem";

const LIGHT_SCENE_TONES: Record<
  WeatherKey,
  {
    wall: string;
    wallTop: string;
    floor: string;
    windowTop: string;
    windowBottom: string;
  }
> = {
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

export function RoomScene({
  weatherKey,
  records,
  mode = "room",
  myUserId,
  showMineOnly,
  onObjectClick,
  label,
}: {
  weatherKey: WeatherKey;
  records: SceneObjectRecord[];
  mode?: "room" | "plaza";
  myUserId?: string;
  showMineOnly?: boolean;
  onObjectClick: (record: SceneObjectRecord) => void;
  label?: string;
}) {
  const { theme } = useAppStore();
  const weather = WEATHER_BY_KEY[weatherKey];
  const scene = theme === "light" ? LIGHT_SCENE_TONES[weatherKey] : weather;

  return (
    <section
      className="relative min-h-[560px] overflow-hidden rounded-xl border border-white/8"
      style={{
        background: `linear-gradient(160deg, ${scene.wallTop}, ${scene.wall})`,
      }}
      aria-label={mode === "plaza" ? "광장 공간" : "나만의 방"}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_36%)]" />

      <div className={mode === "plaza" ? "absolute left-[8%] top-[10%] h-[42%] w-[34%]" : "absolute left-[8%] top-[10%] h-[46%] w-[28%]"}>
        <div className="relative h-full w-full overflow-hidden rounded-md border-[9px] border-[rgba(76,61,48,0.78)]">
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${scene.windowTop}, ${scene.windowBottom})` }} />
          <WeatherEffect weatherKey={weatherKey} />
          <span className="absolute inset-y-0 left-1/2 w-[7px] -translate-x-1/2 bg-[rgba(76,61,48,0.72)]" />
          <span className="absolute inset-x-0 top-[47%] h-[7px] -translate-y-1/2 bg-[rgba(76,61,48,0.72)]" />
        </div>
      </div>

      {mode === "room" ? (
        <>
          <div
            className="absolute inset-x-0 bottom-0 h-[35%]"
            style={{ background: `linear-gradient(180deg, ${scene.floor}, ${theme === "light" ? "#b7aa9a" : "#050608"})` }}
          />
          <div className="absolute bottom-[28%] right-[9%] h-[17%] w-[34%] rounded-t-md border border-white/7 bg-[rgba(213,183,143,0.12)]" />
          <div className="absolute bottom-[39%] right-[12%] h-[6%] w-[22%] rounded-md bg-[rgba(235,225,207,0.16)]" />
          <div className="absolute bottom-[38%] right-[7%] h-[8%] w-[10%] rounded-md bg-[rgba(104,136,174,0.14)]" />
          <div className="absolute bottom-[35%] right-[6%] h-1 w-[42%] bg-[rgba(120,86,54,0.42)]" />
          <div className="absolute bottom-[25%] right-[6%] h-[10%] w-[42%] bg-[rgba(82,60,40,0.34)]" />
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

      <RoomObjectLayer
        records={records}
        mode={mode}
        myUserId={myUserId}
        showMineOnly={showMineOnly}
        onObjectClick={onObjectClick}
      />

      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 text-[0.72rem] text-white/52">
        <span>{weather.icon}</span>
        <span>{weather.label}</span>
      </div>

      <div className="absolute right-5 top-5 max-w-[300px] text-right text-[0.78rem] leading-6 text-white/36">
        {label ?? weather.quietText}
      </div>
    </section>
  );
}

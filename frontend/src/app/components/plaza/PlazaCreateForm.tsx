import { FormEvent, useState } from "react";
import { CloudSun, Palette } from "lucide-react";
import { WEATHER_BY_KEY, WEATHER_OPTIONS } from "../../constants/weather";
import { useAppStore } from "../../stores/AppStore";
import type { PlazaBackgroundType } from "../../types/plaza";
import type { WeatherKey } from "../../types/weather";

const MIN_PLAZA_OBJECTS = 3;
const MAX_PLAZA_OBJECTS = 30;

const PLAZA_BACKGROUND_COLORS = [
  { key: "dawn", label: "새벽 분홍", value: "#8f6f7b" },
  { key: "moss", label: "이끼 초록", value: "#4f6f62" },
  { key: "ash", label: "차분한 회색", value: "#65717c" },
  { key: "amber", label: "은은한 황토", value: "#8c6d4f" },
  { key: "lake", label: "호수 파랑", value: "#4f6f8c" },
  { key: "plum", label: "자두 보라", value: "#67577c" },
];

export function PlazaCreateForm() {
  const { createPlaza, navigate } = useAppStore();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [maxObjects, setMaxObjects] = useState(8);
  const [allowSearch, setAllowSearch] = useState(true);
  const [allowInvite, setAllowInvite] = useState(true);
  const [allowDuplicateObjects, setAllowDuplicateObjects] = useState(false);
  const [backgroundType, setBackgroundType] = useState<PlazaBackgroundType>("color");
  const [backgroundColor, setBackgroundColor] = useState(PLAZA_BACKGROUND_COLORS[0].value);
  const [backgroundKey, setBackgroundKey] = useState<WeatherKey>("night");
  const [error, setError] = useState("");

  const selectedColor = PLAZA_BACKGROUND_COLORS.find((color) => color.value === backgroundColor) ?? PLAZA_BACKGROUND_COLORS[0];
  const selectedWeather = WEATHER_BY_KEY[backgroundKey] ?? WEATHER_BY_KEY.cloudy;

  function handleMaxObjectsChange(value: string) {
    const nextValue = Number(value);

    if (!Number.isFinite(nextValue)) {
      setMaxObjects(MIN_PLAZA_OBJECTS);
      return;
    }

    setMaxObjects(Math.min(MAX_PLAZA_OBJECTS, Math.max(MIN_PLAZA_OBJECTS, nextValue)));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (title.trim().length < 2) {
      setError("광장 제목을 2자 이상 입력해주세요.");
      return;
    }

    if (topic.trim().length < 4) {
      setError("주제를 조금 더 적어주세요.");
      return;
    }

    const plaza = createPlaza({
      title: title.trim(),
      topic: topic.trim(),
      maxObjects,
      allowSearch,
      allowInvite,
      allowDuplicateObjects,
      backgroundType,
      backgroundColor: backgroundType === "color" ? selectedColor.value : undefined,
      backgroundKey,
    });

    navigate(`/plazas/${plaza.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mw-surface mx-auto max-w-[760px] rounded-xl p-7">
      <div className="mb-6">
        <p className="mb-2 text-[0.68rem] tracking-[0.2em] text-white/28">NEW PLAZA</p>
        <h1 className="text-2xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
          새로운 광장 만들기
        </h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/54">
          광장 제목
          <input className="mw-input h-11 px-3 text-sm" value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/54">
          최대 인원
          <input
            className="mw-input h-11 px-3 text-sm"
            type="number"
            min={MIN_PLAZA_OBJECTS}
            max={MAX_PLAZA_OBJECTS}
            value={maxObjects}
            onChange={(event) => handleMaxObjectsChange(event.target.value)}
          />
          <span className="text-[0.72rem] leading-5 text-white/36">
            오브젝트 수가 광장의 최대 인원입니다. 최대 {MAX_PLAZA_OBJECTS}명까지 참여할 수 있어요.
          </span>
        </label>
      </div>

      <label className="mt-5 flex flex-col gap-2 text-sm text-white/54">
        주제
        <textarea
          className="mw-input min-h-[110px] resize-none p-3 text-sm leading-7"
          value={topic}
          placeholder="함께 놓고 싶은 마음의 주제를 적어주세요."
          onChange={(event) => setTopic(event.target.value)}
        />
      </label>

      <div className="mt-5">
        <p className="mb-2 text-sm text-white/54">배경 선택</p>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setBackgroundType("color")}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-white/5"
            style={{
              borderColor: backgroundType === "color" ? "rgba(200,150,106,0.62)" : "rgba(255,255,255,0.08)",
              background: backgroundType === "color" ? "rgba(200,150,106,0.12)" : "rgba(255,255,255,0.025)",
            }}
          >
            <Palette size={16} />
            배경 색상
          </button>
          <button
            type="button"
            onClick={() => setBackgroundType("weather")}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-white/5"
            style={{
              borderColor: backgroundType === "weather" ? "rgba(200,150,106,0.62)" : "rgba(255,255,255,0.08)",
              background: backgroundType === "weather" ? "rgba(200,150,106,0.12)" : "rgba(255,255,255,0.025)",
            }}
          >
            <CloudSun size={16} />
            날씨 배경
          </button>
        </div>

        {backgroundType === "color" ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {PLAZA_BACKGROUND_COLORS.map((color) => {
              const selected = backgroundColor === color.value;

              return (
                <button
                  type="button"
                  key={color.key}
                  onClick={() => setBackgroundColor(color.value)}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition hover:bg-white/5"
                  style={{
                    borderColor: selected ? "rgba(200,150,106,0.62)" : "rgba(255,255,255,0.08)",
                    background: selected ? "rgba(200,150,106,0.12)" : "rgba(255,255,255,0.025)",
                  }}
                >
                  <span className="h-5 w-5 rounded-full border border-white/20" style={{ background: color.value }} />
                  {color.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {WEATHER_OPTIONS.map((weather) => {
              const selected = backgroundKey === weather.key;

              return (
                <button
                  type="button"
                  key={weather.key}
                  onClick={() => setBackgroundKey(weather.key)}
                  className="rounded-md border px-3 py-2 text-left text-sm transition hover:bg-white/5"
                  style={{
                    borderColor: selected ? "rgba(200,150,106,0.62)" : "rgba(255,255,255,0.08)",
                    background: selected ? "rgba(200,150,106,0.12)" : "rgba(255,255,255,0.025)",
                  }}
                >
                  <span className="mr-2">{weather.icon}</span>
                  {weather.label}
                </button>
              );
            })}
          </div>
        )}

        <div
          className="mt-3 flex h-20 items-center justify-center rounded-md border border-white/8 text-sm text-white/62"
          style={{
            background:
              backgroundType === "color"
                ? `linear-gradient(135deg, ${selectedColor.value}, #0b1020)`
                : `linear-gradient(135deg, ${selectedWeather.wallTop}, ${selectedWeather.wall})`,
          }}
        >
          {backgroundType === "color" ? selectedColor.label : `${selectedWeather.icon} ${selectedWeather.label}`}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <label className="mw-soft flex items-center justify-between rounded-md p-4 text-sm text-white/54">
          검색 허용
          <input type="checkbox" checked={allowSearch} onChange={(event) => setAllowSearch(event.target.checked)} />
        </label>
        <label className="mw-soft flex items-center justify-between rounded-md p-4 text-sm text-white/54">
          초대 허용
          <input type="checkbox" checked={allowInvite} onChange={(event) => setAllowInvite(event.target.checked)} />
        </label>
        <label className="mw-soft flex items-center justify-between rounded-md p-4 text-sm text-white/54">
          오브젝트 중복
          <input type="checkbox" checked={allowDuplicateObjects} onChange={(event) => setAllowDuplicateObjects(event.target.checked)} />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-[#e6a1a1]">{error}</p>}

      <div className="mt-7 flex justify-end gap-3">
        <button type="button" onClick={() => navigate("/plazas")} className="mw-button rounded-md px-5 py-2 text-sm">
          취소
        </button>
        <button type="submit" className="mw-button-solid rounded-md px-5 py-2 text-sm">
          광장 만들기
        </button>
      </div>
    </form>
  );
}

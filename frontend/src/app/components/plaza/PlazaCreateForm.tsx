import { FormEvent, useState } from "react";
import { WEATHER_OPTIONS } from "../../constants/weather";
import { useAppStore } from "../../stores/AppStore";
import type { WeatherKey } from "../../types/weather";

// 새 광장의 기본 설정을 입력받는 폼입니다.
export function PlazaCreateForm() {
  const { createPlaza, navigate } = useAppStore();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [maxObjects, setMaxObjects] = useState(8);
  const [allowSearch, setAllowSearch] = useState(true);
  const [allowInvite, setAllowInvite] = useState(true);
  const [allowDuplicateObjects, setAllowDuplicateObjects] = useState(false);
  const [backgroundKey, setBackgroundKey] = useState<WeatherKey>("night");
  const [error, setError] = useState("");

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
      backgroundKey,
    });
    // 생성 직후 새 광장 상세 화면으로 이동합니다.
    navigate(`/plazas/${plaza.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mw-surface mx-auto max-w-[760px] rounded-xl p-7">
      <div className="mb-6">
        <p className="mb-2 text-[0.68rem] tracking-[0.2em] text-white/28">NEW PLAZA</p>
        <h1 className="text-2xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
          나그네들이 머물 광장 만들기
        </h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/54">
          광장 제목
          <input className="mw-input h-11 px-3 text-sm" value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/54">
          최대 오브젝트 수
          <input
            className="mw-input h-11 px-3 text-sm"
            type="number"
            min={3}
            max={24}
            value={maxObjects}
            onChange={(event) => setMaxObjects(Number(event.target.value))}
          />
        </label>
      </div>

      <label className="mt-5 flex flex-col gap-2 text-sm text-white/54">
        주제
        <textarea
          className="mw-input min-h-[110px] resize-none p-3 text-sm leading-7"
          value={topic}
          placeholder="예: 가장 외로웠던 밤에 남겨두고 싶은 것"
          onChange={(event) => setTopic(event.target.value)}
        />
      </label>

      <div className="mt-5">
        <p className="mb-2 text-sm text-white/54">배경 분위기</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {WEATHER_OPTIONS.map((weather) => {
            const selected = backgroundKey === weather.key;

            return (
              <button
                type="button"
                key={weather.key}
                onClick={() => setBackgroundKey(weather.key)}
                className="rounded-md border px-3 py-2 text-left text-sm hover:bg-white/5"
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

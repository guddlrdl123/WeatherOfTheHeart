import { FormEvent, useMemo, useState } from "react";
import { X } from "lucide-react";
import { OBJECT_BY_KEY } from "../../constants/objects";
import { WEATHER_OPTIONS } from "../../constants/weather";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import type { Memory } from "../../types/memory";
import type { ObjectSlotKey } from "../../types/object";
import type { MoodKey, WeatherKey } from "../../types/weather";
import { getTodayString } from "../../utils/date";
import { ObjectPicker } from "../object/ObjectPicker";

// 개인 방과 광장 글 작성이 공통으로 사용하는 제출 값입니다.
export type WriteModalValue = {
  memoryDate: string;
  title?: string;
  content: string;
  moodKey: MoodKey;
  weatherKey: WeatherKey;
  objectKey: string;
  slotKey: ObjectSlotKey;
};

// 작은 메모지처럼 동작하는 글 작성 모달입니다.
// mode 값에 따라 개인 방용/광장용 문구와 오브젝트 범위가 달라집니다.
export function MemoryWriteModal({
  mode = "private",
  initialDate,
  existingMemory,
  existingNotice,
  onClose,
  onSave,
}: {
  mode?: "private" | "plaza";
  initialDate: string;
  existingMemory?: Memory | null;
  existingNotice?: string;
  onClose: () => void;
  onSave: (value: WriteModalValue) => void;
}) {
  const [memoryDate, setMemoryDate] = useState(initialDate);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodKey, setMoodKey] = useState<MoodKey>("rainy");
  const [weatherKey, setWeatherKey] = useState<WeatherKey>("rainy");
  const [objectKey, setObjectKey] = useState("wooden_chair");
  const [error, setError] = useState("");
  const today = useMemo(getTodayString, []);

  useEscapeKey(onClose);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedContent = content.trim();

    // 이미 작성된 날짜나 이미 참여한 광장에서는 새 글 작성을 막습니다.
    if (existingMemory || existingNotice) {
      setError(existingNotice ?? "이미 이 날짜의 이야기가 방에 남아 있어요.");
      return;
    }

    if (!trimmedContent) {
      setError("내용을 적어주세요.");
      return;
    }

    if (trimmedContent.length > 500) {
      setError("내용은 500자 이내로 남겨주세요.");
      return;
    }

    const object = OBJECT_BY_KEY[objectKey];
    // 오브젝트의 slotKey를 함께 넘겨 RoomScene이 고정 위치에 자동 배치할 수 있게 합니다.
    onSave({
      memoryDate,
      title: title.trim() || undefined,
      content: trimmedContent,
      moodKey,
      weatherKey,
      objectKey,
      slotKey: object.slotKey,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="mw-fade-in mw-surface max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[0.68rem] tracking-[0.2em] text-white/28">{mode === "plaza" ? "PLAZA NOTE" : "ROOM NOTE"}</p>
            <h2 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
              {mode === "plaza" ? "광장에 이야기를 놓아주세요" : "작은 메모지에 오늘을 남겨주세요"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border border-white/10 hover:bg-white/5" aria-label="닫기">
            <X size={17} />
          </button>
        </div>

        {(existingMemory || existingNotice) && (
          <div className="mb-5 rounded-md border border-[#c8966a]/25 bg-[#c8966a]/10 p-4 text-sm leading-7 text-[#e0d2ba]">
            {existingNotice ?? "이미 이 날짜의 이야기가 방에 남아 있어요. 오브젝트를 눌러 그날의 글을 볼 수 있습니다."}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm text-white/54">
              날짜
              <input
                className="mw-input h-11 px-3 text-sm"
                type="date"
                value={memoryDate}
                max={today}
                disabled={mode === "plaza"}
                onChange={(event) => setMemoryDate(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/54">
              제목
              <input
                className="mw-input h-11 px-3 text-sm"
                value={title}
                placeholder="제목 없는 기억"
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/54">
              내용
              <textarea
                className="mw-input min-h-[170px] resize-none p-3 text-sm leading-7"
                value={content}
                maxLength={500}
                placeholder={mode === "plaza" ? "광장에 조용히 놓고 싶은 장면을 적어주세요." : "오늘은 어떤 날씨를 만들어 드릴까요?"}
                onChange={(event) => setContent(event.target.value)}
              />
              <span className="text-right text-[0.68rem] text-white/30">{content.length}/500</span>
            </label>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-sm text-white/54">마음 상태와 날씨</p>
              <div className="grid grid-cols-3 gap-2">
                {WEATHER_OPTIONS.map((weather) => {
                  const selected = moodKey === weather.key;

                  return (
                    <button
                      key={weather.key}
                      type="button"
                      onClick={() => {
                        setMoodKey(weather.key);
                        setWeatherKey(weather.key);
                      }}
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
            </div>

            <div>
              <p className="mb-2 text-sm text-white/54">이야기를 담을 오브젝트를 골라주세요.</p>
              <ObjectPicker value={objectKey} scope={mode} onChange={(object) => setObjectKey(object.objectKey)} />
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-[#e6a1a1]">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="mw-button rounded-md px-5 py-2 text-sm">
            닫기
          </button>
          <button type="submit" className="mw-button-solid rounded-md px-5 py-2 text-sm">
            {mode === "plaza" ? "광장에 놓기" : "방에 남기기"}
          </button>
        </div>
      </form>
    </div>
  );
}

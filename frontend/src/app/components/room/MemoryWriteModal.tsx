import { FormEvent, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { MOOD_OPTIONS } from "../../constants/moods";
import { OBJECT_BY_KEY, ROOM_OBJECTS } from "../../constants/objects";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import type { Memory } from "../../types/memory";
import type { ObjectSlotKey } from "../../types/object";
import type { MoodKey, WeatherKey } from "../../types/weather";
import { getTodayString } from "../../utils/date";
import { ObjectPicker } from "../object/ObjectPicker";

export type WriteModalValue = {
  memoryDate: string;
  title?: string;
  content: string;
  moodKey: MoodKey;
  weatherKey: WeatherKey;
  objectKey: string;
  slotKey: ObjectSlotKey;
  positionX?: number;
  positionY?: number;
};

export function MemoryWriteModal({
  mode = "private",
  initialDate,
  existingMemory,
  existingNotice,
  privateMemories = [],
  isSaving = false,
  onClose,
  onSave,
}: {
  mode?: "private" | "plaza";
  initialDate: string;
  existingMemory?: Memory | null;
  existingNotice?: string;
  privateMemories?: Memory[];
  isSaving?: boolean;
  onClose: () => void;
  onSave: (value: WriteModalValue) => void | Promise<void>;
}) {
  const [memoryDate, setMemoryDate] = useState(initialDate);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodKey, setMoodKey] = useState<MoodKey>("calm");
  const [objectKey, setObjectKey] = useState(ROOM_OBJECTS[0]?.objectKey ?? "carpet");
  const [error, setError] = useState("");
  const today = useMemo(getTodayString, []);
  const weatherKey: WeatherKey = "cloudy";
  const disabledObjectKeys = useMemo(() => {
    if (mode !== "private") {
      return [];
    }

    const monthKey = memoryDate.slice(0, 7);

    return privateMemories
      .filter((memory) => memory.memoryDate.startsWith(`${monthKey}-`) && memory.id !== existingMemory?.id)
      .map((memory) => memory.objectKey);
  }, [existingMemory?.id, memoryDate, mode, privateMemories]);
  const disabledObjectKeySet = useMemo(() => new Set(disabledObjectKeys), [disabledObjectKeys]);

  useEscapeKey(onClose);

  useEffect(() => {
    if (mode !== "private" || !disabledObjectKeySet.has(objectKey)) {
      return;
    }

    const nextObject = ROOM_OBJECTS.find((object) => object.allowPrivate && !disabledObjectKeySet.has(object.objectKey));

    if (nextObject) {
      setObjectKey(nextObject.objectKey);
    }
  }, [disabledObjectKeySet, mode, objectKey]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setError("");
    const trimmedContent = content.trim();

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

    const object = OBJECT_BY_KEY[objectKey] ?? ROOM_OBJECTS[0];

    if (!object) {
      setError("선택할 수 있는 오브젝트가 없어요.");
      return;
    }

    if (mode === "private" && disabledObjectKeySet.has(object.objectKey)) {
      setError("이번 달 방에 이미 놓인 오브젝트예요. 다른 오브젝트를 골라주세요.");
      return;
    }

    void onSave({
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
      <form onSubmit={handleSubmit} className="mw-fade-in mw-surface max-h-[92vh] w-full max-w-[760px] select-text overflow-y-auto rounded-xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[0.68rem] tracking-[0.2em] text-white/28">{mode === "plaza" ? "PLAZA NOTE" : "ROOM NOTE"}</p>
            <h2 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
              {mode === "plaza" ? "광장에 이야기를 놓아주세요." : "작은 메모지에 오늘을 남겨주세요."}
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
                disabled={mode === "plaza" || isSaving}
                onChange={(event) => setMemoryDate(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/54">
              제목
              <input
                className="mw-input h-11 px-3 text-sm"
                value={title}
                placeholder="제목 없는 기억"
                disabled={isSaving}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-white/54">
              내용
              <textarea
                className="mw-input min-h-[170px] resize-none p-3 text-sm leading-7"
                value={content}
                maxLength={500}
                placeholder={mode === "plaza" ? "광장에 조용히 놓고 싶은 마음을 적어주세요." : "오늘은 어떤 날씨를 만들게 될까요?"}
                disabled={isSaving}
                onChange={(event) => setContent(event.target.value)}
              />
              <span className="text-right text-[0.68rem] text-white/30">{content.length}/500</span>
            </label>
          </div>

          <div className="flex flex-col gap-4">
            {mode === "private" && (
              <div>
                <p className="mb-2 text-sm text-white/54">오늘의 기분</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {MOOD_OPTIONS.map((mood) => {
                    const selected = moodKey === mood.key;

                    return (
                      <button
                        key={mood.key}
                        type="button"
                        disabled={isSaving}
                        onClick={() => setMoodKey(mood.key)}
                        className="rounded-md border px-3 py-2 text-left text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
                        style={{
                          borderColor: selected ? "rgba(200,150,106,0.62)" : "rgba(255,255,255,0.08)",
                          background: selected ? "rgba(200,150,106,0.12)" : "rgba(255,255,255,0.025)",
                        }}
                      >
                        <span className="mr-2">{mood.icon}</span>
                        {mood.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm text-white/54">이야기를 담을 오브젝트를 골라주세요.</p>
              <ObjectPicker value={objectKey} scope={mode} disabledObjectKeys={disabledObjectKeys} onChange={(object) => setObjectKey(object.objectKey)} />
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-[#e6a1a1]">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="mw-button rounded-md px-5 py-2 text-sm">
            닫기
          </button>
          <button type="submit" disabled={isSaving} className="mw-button-solid rounded-md px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? "날씨 읽는 중" : mode === "plaza" ? "광장에 놓기" : "방에 남기기"}
          </button>
        </div>
      </form>
    </div>
  );
}

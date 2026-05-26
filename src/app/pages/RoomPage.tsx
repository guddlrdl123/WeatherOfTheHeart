import { useEffect, useMemo, useState } from "react";
import { CalendarDays, PenLine } from "lucide-react";
import { WEATHER_BY_KEY } from "../constants/weather";
import { MemoryPopup } from "../components/room/MemoryPopup";
import { MemoryWriteModal, type WriteModalValue } from "../components/room/MemoryWriteModal";
import { RoomCalendarSidebar } from "../components/calendar/RoomCalendarSidebar";
import { RoomScene } from "../components/room/RoomScene";
import { SaveToast } from "../components/common/SaveToast";
import type { SceneObjectRecord } from "../components/object/RoomObjectItem";
import { useAppStore } from "../stores/AppStore";
import { formatDotDate, getTodayString } from "../utils/date";

export function RoomPage() {
  const { selectedDate, setSelectedDate, memories, addMemory, selectedMemory, currentWeather } = useAppStore();
  const initial = new Date(`${selectedDate}T00:00:00`);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth() + 1);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [popupRecord, setPopupRecord] = useState<SceneObjectRecord | null>(null);
  const [toast, setToast] = useState("");
  const today = getTodayString();
  const weather = WEATHER_BY_KEY[currentWeather];

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const sceneRecords = useMemo<SceneObjectRecord[]>(() => {
    if (!selectedMemory) {
      return [];
    }

    return [
      {
        ...selectedMemory,
        memoryDate: selectedMemory.memoryDate,
      },
    ];
  }, [selectedMemory]);

  function handlePrevMonth() {
    setViewMonth((month) => {
      if (month === 1) {
        setViewYear((year) => year - 1);
        return 12;
      }

      return month - 1;
    });
  }

  function handleNextMonth() {
    const now = new Date();

    if (viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth >= now.getMonth() + 1)) {
      return;
    }

    setViewMonth((month) => {
      if (month === 12) {
        setViewYear((year) => year + 1);
        return 1;
      }

      return month + 1;
    });
  }

  function handleSave(value: WriteModalValue) {
    const result = addMemory(value);

    if (!result.ok) {
      setToast("이미 이 날의 이야기가 방에 남아 있어요.");
      return;
    }

    setSelectedDate(result.memory.memoryDate);
    const next = new Date(`${result.memory.memoryDate}T00:00:00`);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth() + 1);
    setIsWriteOpen(false);
    setToast("오늘의 이야기가 방에 남았어요.");
  }

  return (
    <main className="mx-auto grid max-w-[1320px] gap-5 px-5 py-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="flex flex-col gap-5">
        <RoomCalendarSidebar
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          memories={memories}
          onDateSelect={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <section className="mw-surface rounded-xl p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-[#d8bd9a]">
            <CalendarDays size={16} />
            {formatDotDate(selectedDate)}
          </div>
          {selectedMemory ? (
            <div>
              <h2 className="text-lg font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
                {selectedMemory.title || "제목 없는 기억"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/52">{selectedMemory.content}</p>
              <p className="mt-4 text-[0.72rem] text-white/34">
                {weather.icon} {weather.quietText}
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
                아직 이 날의 이야기는 비어 있어요.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/48">비어 있는 날짜에는 작은 메모지 하나를 남길 수 있어요.</p>
              {selectedDate <= today && (
                <button type="button" onClick={() => setIsWriteOpen(true)} className="mw-button mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm">
                  <PenLine size={15} />이 날의 이야기 남기기
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="min-w-0">
        <RoomScene
          weatherKey={currentWeather}
          records={sceneRecords}
          label={selectedMemory ? "창밖의 날씨가 조용히 바뀌었어요." : "아직 이 날의 이야기는 비어 있어요."}
          onObjectClick={setPopupRecord}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setIsWriteOpen(true)}
            disabled={Boolean(selectedMemory) || selectedDate > today}
            className="mw-button-solid inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-35"
          >
            <PenLine size={16} />
            기억 남기기
          </button>
        </div>
      </div>

      {isWriteOpen && (
        <MemoryWriteModal
          initialDate={selectedDate}
          existingMemory={selectedMemory}
          onClose={() => setIsWriteOpen(false)}
          onSave={handleSave}
        />
      )}
      {popupRecord && <MemoryPopup record={popupRecord} onClose={() => setPopupRecord(null)} />}
      {toast && <SaveToast message={toast} />}
    </main>
  );
}

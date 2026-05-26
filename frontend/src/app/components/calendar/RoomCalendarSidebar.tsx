import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Memory } from "../../types/memory";
import { DAY_LABELS, getMonthDays, getTodayString, MONTH_LABELS } from "../../utils/date";

export function RoomCalendarSidebar({
  year,
  month,
  selectedDate,
  memories,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  month: number;
  selectedDate: string;
  memories: Memory[];
  onDateSelect: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const today = getTodayString();
  const days = getMonthDays(year, month);
  const memoryDates = new Set(memories.map((memory) => memory.memoryDate));
  const now = new Date();
  const canGoNext = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);

  return (
    <aside className="mw-surface rounded-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={onPrevMonth} className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/5" aria-label="이전 달">
          <ChevronLeft size={16} />
        </button>
        <strong className="text-sm font-medium text-[#e0d2ba]">
          {year}년 {MONTH_LABELS[month - 1]}
        </strong>
        <button
          type="button"
          onClick={onNextMonth}
          disabled={!canGoNext}
          className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="다음 달"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <span key={label} className="py-1 text-center text-[0.65rem] text-white/30">
            {label}
          </span>
        ))}

        {days.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="h-9" />;
          }

          const isFuture = date > today;
          const isToday = date === today;
          const selected = date === selectedDate;
          const hasMemory = memoryDates.has(date);

          return (
            <button
              key={date}
              type="button"
              disabled={isFuture}
              onClick={() => onDateSelect(date)}
              className="flex h-9 flex-col items-center justify-center rounded-md border text-[0.72rem] transition disabled:cursor-not-allowed"
              style={{
                borderColor: selected ? "rgba(200,150,106,0.62)" : isToday ? "rgba(255,255,255,0.24)" : "transparent",
                background: selected ? "rgba(200,150,106,0.14)" : "transparent",
                color: isFuture ? "rgba(255,255,255,0.18)" : selected ? "#dfbf8d" : "rgba(224,216,200,0.58)",
              }}
            >
              <span>{Number(date.slice(-2))}</span>
              {hasMemory && <span className="mt-0.5 h-1 w-1 rounded-full bg-[#d8bd9a]" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

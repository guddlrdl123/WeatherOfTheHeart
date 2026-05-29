import { ArrowRight } from "lucide-react";
import { WEATHER_BY_KEY } from "../../constants/weather";
import { useAppStore } from "../../stores/AppStore";
import type { Plaza, PlazaStatus } from "../../types/plaza";

const FALLBACK_PLAZA_COLOR = "#65717c";

export function PlazaCard({
  plaza,
  entryCount,
  hasMyEntry = false,
}: {
  plaza: Plaza;
  entryCount: number;
  hasMyEntry?: boolean;
}) {
  const { navigate } = useAppStore();
  const weather = WEATHER_BY_KEY[plaza.backgroundKey] ?? WEATHER_BY_KEY.cloudy;
  const backgroundType = plaza.backgroundType ?? "weather";
  const status: PlazaStatus = entryCount >= plaza.maxObjects ? "complete" : "open";

  return (
    <article className="mw-surface flex min-h-[250px] select-none flex-col justify-between rounded-xl p-5" onCopy={(event) => event.preventDefault()}>
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[0.68rem] text-white/42">
            {backgroundType === "color" ? (
              <>
                <span className="h-3 w-3 rounded-full border border-white/20" style={{ background: plaza.backgroundColor ?? FALLBACK_PLAZA_COLOR }} />
                배경색
              </>
            ) : (
              <>
                {weather.icon} {weather.label}
              </>
            )}
          </span>
          <div className="flex flex-wrap justify-end gap-2">
            {hasMyEntry && <span className="rounded-full border border-[#d8bd9a]/30 px-3 py-1 text-[0.68rem] text-[#d8bd9a]">참여함</span>}
            <span
              className="rounded-full border px-3 py-1 text-[0.68rem]"
              style={{
                borderColor: status === "open" ? "rgba(145, 188, 160, 0.35)" : "rgba(255,255,255,0.12)",
                color: status === "open" ? "#b9d5bd" : "rgba(224,216,200,0.46)",
              }}
            >
              {status === "open" ? "참여 가능" : "완료"}
            </span>
          </div>
        </div>
        <h2 className="text-xl font-normal text-[#e0d2ba]" style={{ fontFamily: "'Noto Serif KR', Georgia, serif" }}>
          {plaza.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/50">{plaza.topic}</p>
      </div>

      <div>
        <div className="mb-4 mt-6 h-2 overflow-hidden rounded-full bg-white/7">
          <div
            className="h-full rounded-full bg-[#c8966a]/70"
            style={{
              width: `${Math.min(100, (entryCount / plaza.maxObjects) * 100)}%`,
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-white/42">
            {entryCount} / {plaza.maxObjects}명
          </span>
          <button
            type="button"
            onClick={() => navigate(`/plazas/${plaza.id}`)}
            className="mw-button inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm"
          >
            {hasMyEntry ? "다시 보기" : "입장하기"}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

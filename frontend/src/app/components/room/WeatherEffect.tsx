import type { WeatherKey } from "../../types/weather";

// 비 효과는 정적인 배열을 만들어 렌더마다 위치가 흔들리지 않게 합니다.
const drops = Array.from({ length: 22 }, (_, index) => ({
  left: `${4 + ((index * 4.3) % 90)}%`,
  delay: `${(index * 0.12) % 1.4}s`,
  height: 12 + ((index * 5) % 18),
}));

// 눈 효과도 같은 이유로 위치/크기/딜레이를 미리 계산합니다.
const snow = Array.from({ length: 18 }, (_, index) => ({
  left: `${6 + ((index * 5.1) % 88)}%`,
  delay: `${(index * 0.28) % 3.2}s`,
  size: 3 + (index % 3),
}));

// 창문 안에서만 보이는 작은 날씨 효과입니다.
export function WeatherEffect({ weatherKey }: { weatherKey: WeatherKey }) {
  if (weatherKey === "rainy") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {drops.map((drop, index) => (
          <span
            key={index}
            className="mw-weather-rain absolute top-0 block w-px"
            style={{
              left: drop.left,
              height: drop.height,
              animationDelay: drop.delay,
              background: "rgba(190, 225, 245, 0.72)",
            }}
          />
        ))}
      </div>
    );
  }

  if (weatherKey === "snowy") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {snow.map((flake, index) => (
          <span
            key={index}
            className="mw-weather-snow absolute top-0 block rounded-full bg-white/70"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              animationDelay: flake.delay,
            }}
          />
        ))}
      </div>
    );
  }

  if (weatherKey === "cloudy") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[12%] top-[30%] h-4 w-[42%] rounded-full bg-white/18" />
        <span className="absolute left-[36%] top-[45%] h-3 w-[38%] rounded-full bg-white/14" />
      </div>
    );
  }

  if (weatherKey === "night") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[22%] top-[22%] h-1 w-1 rounded-full bg-white/70" />
        <span className="absolute left-[64%] top-[30%] h-1 w-1 rounded-full bg-white/55" />
        <span className="absolute left-[48%] top-[16%] h-1 w-1 rounded-full bg-white/45" />
        <span className="absolute right-[18%] top-[16%] text-lg text-white/72">☾</span>
      </div>
    );
  }

  if (weatherKey === "sunset") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute bottom-[24%] left-1/2 h-9 w-9 -translate-x-1/2 rounded-full bg-[#f29a54]" />
        <span className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(0deg,rgba(113,42,28,0.7),transparent)]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd678]" />
    </div>
  );
}

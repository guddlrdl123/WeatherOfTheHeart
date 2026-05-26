// localStorage를 안전하게 읽는 공통 함수입니다.
// 브라우저가 아니거나 JSON 파싱에 실패하면 fallback을 돌려줍니다.
export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// localStorage에는 문자열만 저장할 수 있으므로 JSON으로 변환해서 저장합니다.
export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

// mock 데이터의 id를 만들 때 사용합니다.
// 브라우저가 randomUUID를 지원하면 더 충돌 가능성이 낮은 값을 씁니다.
export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

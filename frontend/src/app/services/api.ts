const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export async function requestApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  // 백엔드 ApiResponse 포맷을 한 곳에서 풀어 프론트 서비스들이 data만 다루도록 합니다.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = (await response.json()) as ApiResponse<T>;

  // 이번 API 연동 변경: HTTP 에러와 백엔드 비즈니스 에러를 모두 예외로 올립니다.
  if (!response.ok || body.status.toLowerCase() !== "success") {
    throw new Error(body.message || "API 요청에 실패했습니다.");
  }

  return body.data;
}

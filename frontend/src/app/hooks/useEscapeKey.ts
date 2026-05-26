import { useEffect } from "react";

// 모달/팝업에서 ESC 키를 눌렀을 때 닫기 동작을 연결하는 공통 hook입니다.
export function useEscapeKey(onEscape: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onEscape();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape]);
}

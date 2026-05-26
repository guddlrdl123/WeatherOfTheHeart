export const MONTH_LABELS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
export const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 오늘 날짜를 YYYY-MM-DD 문자열로 돌려줍니다.
export function getTodayString() {
  const date = new Date();
  return toDateString(date);
}

// Date 객체를 input[type=date]와 비교하기 쉬운 YYYY-MM-DD 형식으로 바꿉니다.
export function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// 화면 표시용으로 YYYY-MM-DD를 YYYY.MM.DD로 바꿉니다.
export function formatDotDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
}

// 월간 캘린더를 그리기 위한 날짜 배열을 만듭니다.
// 첫 주의 빈 칸은 null로 채워 요일 위치를 맞춥니다.
export function getMonthDays(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const days: (string | null)[] = Array(firstDay).fill(null);

  for (let day = 1; day <= lastDate; day += 1) {
    days.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }

  return days;
}

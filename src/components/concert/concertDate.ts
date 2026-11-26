export function concertDateLabel(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(year, month - 1, day).getDay()];
  return `${year}. ${String(month).padStart(2, "0")}. ${String(day).padStart(2, "0")} (${weekday})`;
}

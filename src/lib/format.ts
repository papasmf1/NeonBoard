/** DB 시각을 한국 시간 문자열로 변환 */
export function formatDate(date: Date, withTime = false) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    ...(withTime && { timeStyle: "short" }),
  }).format(date);
}

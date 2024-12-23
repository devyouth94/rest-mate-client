/**
 * dateTime 형식이 "2024-12-15T12:00:00.000Z" 일 때도 있고
 * "2024-12-15T12:00:00" 일 때도 있는 것 같은데
 * 후자처럼 시간대 정보가 없으면 한국 시간대라고 간주하고
 * 전자처럼 시간대 정보가 있으면 한국 시간대로 변환
 * 그 후에 date와 time 형식 분리
 */
export default function formatDateTime(dateTime: string): {
  date: string;
  time: string;
} {
  // 시간 부분만 추출
  const match = dateTime.match(/T(\d{2}):(\d{2})/);
  if (!match) throw new Error('Invalid date time format');

  const hours = match[1];
  const minutes = match[2];

  // 날짜 부분 추출
  const [, month, day] = dateTime.split('T')[0].split('-');

  return {
    date: `${Number(month)}월 ${Number(day)}일`,
    time: `${hours}:${minutes}`,
  };
}

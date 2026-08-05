export function seasonLabel(startDate: string, endDate: string) {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  return `${startYear}/${String(endYear).slice(2)}`;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatMatchDate(utcDate: string) {
  return new Date(utcDate).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Не начался",
  TIMED: "Не начался",
  IN_PLAY: "Идёт",
  PAUSED: "Перерыв",
  FINISHED: "Завершён",
  POSTPONED: "Перенесён",
  CANCELLED: "Отменён",
};

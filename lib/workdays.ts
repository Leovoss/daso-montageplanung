export function workdays(start: string, end: string) {
  const days: string[] = [];
  for (let t = Date.parse(start); t <= Date.parse(end) && days.length < 400; t += 86400000) {
    const wd = new Date(t).getUTCDay();
    if (wd !== 0 && wd !== 6) days.push(new Date(t).toISOString().slice(0, 10));
  }
  return days;
}

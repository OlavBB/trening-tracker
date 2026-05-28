export function daysSince(dateStr) {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

export function badgeInfo(days) {
  if (days === null)  return { cls: 'badge-never', label: 'Aldri' };
  if (days === 0)     return { cls: 'badge-fresh', label: 'I dag' };
  if (days === 1)     return { cls: 'badge-fresh', label: '1 dag siden' };
  if (days <= 4)      return { cls: 'badge-fresh', label: `${days} dager siden` };
  if (days <= 7)      return { cls: 'badge-soon',  label: `${days} dager siden` };
  return              { cls: 'badge-due',           label: `${days} dager siden` };
}

export function last4Weeks(dates) {
  const now = new Date();
  const daysFromMon = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const thisMonday = new Date(now);
  thisMonday.setHours(0, 0, 0, 0);
  thisMonday.setDate(now.getDate() - daysFromMon);

  const result = [false, false, false, false];
  for (const d of (dates || [])) {
    const diffMs = thisMonday.getTime() - new Date(d).getTime();
    const weekIndex = diffMs < 0 ? 0 : Math.floor(diffMs / 86400000 / 7);
    if (weekIndex <= 3) result[3 - weekIndex] = true;
  }
  return result;
}

export function sorted(exercises, state) {
  return [...exercises].sort((a, b) => {
    const da = state[a.id]?.date ? daysSince(state[a.id].date) : 9999;
    const db = state[b.id]?.date ? daysSince(state[b.id].date) : 9999;
    return db - da;
  });
}

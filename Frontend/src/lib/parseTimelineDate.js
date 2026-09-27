const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

// Parses "March 2025" or "21 November 2024" into a comparable Date.
// Falls back to epoch 0 (oldest) if the string can't be parsed.
export function parseTimelineDate(value) {
  if (!value || typeof value !== "string") return new Date(0);

  const parts = value.trim().toLowerCase().split(/\s+/);
  let day = 1;
  let month;
  let year;

  if (parts.length === 2) {
    [month, year] = parts;
  } else if (parts.length === 3) {
    [day, month, year] = parts;
  } else {
    return new Date(0);
  }

  const monthIndex = MONTHS.indexOf(month);
  const parsedYear = parseInt(year, 10);
  const parsedDay = parseInt(day, 10) || 1;

  if (monthIndex === -1 || Number.isNaN(parsedYear)) return new Date(0);

  return new Date(parsedYear, monthIndex, parsedDay);
}

export function sortTimelineByRecency(timelines) {
  return [...(timelines || [])].sort((a, b) => {
    const aTo = a?.timeline?.to || a?.timeline?.from;
    const bTo = b?.timeline?.to || b?.timeline?.from;
    return parseTimelineDate(bTo) - parseTimelineDate(aTo);
  });
}

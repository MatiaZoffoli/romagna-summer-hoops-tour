/**
 * Date parsing for Italian-formatted strings (e.g. "11 Luglio 2026").
 * Kept in a separate module so it can be tested without loading Supabase.
 */
const IT_MONTHS: Record<string, number> = {
  gennaio: 1,
  febbraio: 2,
  marzo: 3,
  aprile: 4,
  maggio: 5,
  giugno: 6,
  luglio: 7,
  agosto: 8,
  settembre: 9,
  ottobre: 10,
  novembre: 11,
  dicembre: 12,
};

/** Parse Italian date string (e.g. "Sabato 11 Luglio 2026" or "11 Luglio 2026") to Date at noon UTC. */
export function parseItalianDate(dataStr: string): Date | null {
  const s = dataStr.trim().toLowerCase();
  const match = s.match(
    /(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\s+(\d{4})/
  );
  if (!match) return null;
  const [, day, monthName, year] = match;
  const month = IT_MONTHS[monthName];
  if (!month) return null;
  const d = new Date(Date.UTC(Number(year), month - 1, Number(day), 12, 0, 0));
  return Number.isNaN(d.getTime()) ? null : d;
}

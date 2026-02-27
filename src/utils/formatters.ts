export const CURRENT_GAMES_YEAR = 2026;

interface DroughtInfo {
  droughtYears: number;
  droughtLastYear?: number;
  subject: string;
}

export function formatDrought(info: DroughtInfo): string {
  const { droughtYears, droughtLastYear, subject } = info;
  if (droughtLastYear && droughtLastYear > 0) {
    return `${droughtYears} years since last ${subject} in ${droughtLastYear}`;
  }
  return `${droughtYears} years since last ${subject}`;
}

interface RecordComparison {
  value: number;
  unit: string;
  context: string;
}

export function formatRecordComparison(record: RecordComparison): string {
  return `${record.value} ${record.unit} — ${record.context}`;
}

interface AgeRecord {
  age: number;
  context: string;
}

export function formatAgeRecord(info: AgeRecord): string {
  return `${info.age} — ${info.context}`;
}


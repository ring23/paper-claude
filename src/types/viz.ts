/** Source citation for a data point */
export interface DataSource {
  label: string; // e.g. "Olympics.com", "ESPN"
  url: string; // full URL to article
}

/** A single bar in a comparative chart */
export interface BarDatum {
  label: string;
  value: number;
  unit?: string;
  highlight?: boolean; // gold accent for the athlete
}

/** A radial gauge segment */
export interface GaugeDatum {
  label: string;
  value: number;
  max: number;
  unit?: string;
}

/** A point on a timeline */
export interface TimelineDatum {
  year: number;
  label: string;
  medal?: "gold" | "silver" | "bronze";
  isHighlight?: boolean;
}

/** Per-athlete sky theme colors */
export interface SkyTheme {
  deep: string;
  mid: string;
  pale: string;
}

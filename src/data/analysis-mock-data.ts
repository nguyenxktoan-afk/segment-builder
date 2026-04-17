/* ── Mock data for Analysis tab ── */

/** DAU bar chart data (7 days) */
export const EVENTS_DAU_DATA = [
  { day: 'Mon', ios: 12400, android: 18200 },
  { day: 'Tue', ios: 13100, android: 17800 },
  { day: 'Wed', ios: 11900, android: 19500 },
  { day: 'Thu', ios: 14200, android: 20100 },
  { day: 'Fri', ios: 15600, android: 21300 },
  { day: 'Sat', ios: 18900, android: 25400 },
  { day: 'Sun', ios: 17200, android: 23800 },
];

export const EVENTS_METRICS = { totalEvents: 1_284_300, uniqueUsers: 89_420, sumRevenue: 342_100_000 };

/** Retention cohort table: rows = cohorts, cols = D1/D3/D7/D14/D30 */
export const RETENTION_COHORTS = [
  { cohort: 'Apr 1–7',  users: 12400, d1: 42.1, d3: 28.3, d7: 18.5, d14: 12.1, d30: 7.2 },
  { cohort: 'Apr 8–14', users: 13800, d1: 44.5, d3: 30.1, d7: 19.8, d14: 13.4, d30: 8.1 },
  { cohort: 'Mar 25–31', users: 11200, d1: 39.8, d3: 25.2, d7: 16.4, d14: 10.8, d30: 6.5 },
  { cohort: 'Mar 18–24', users: 10900, d1: 41.2, d3: 27.0, d7: 17.1, d14: 11.2, d30: 6.9 },
];

/** Funnel steps */
export const FUNNEL_STEPS = [
  { name: 'Install', count: 45000, pct: 100 },
  { name: 'Register', count: 32400, pct: 72.0 },
  { name: 'Tutorial Complete', count: 21600, pct: 48.0 },
  { name: 'First Purchase', count: 4320, pct: 9.6 },
];

/** Spending distribution buckets */
export const DISTRIBUTION_BUCKETS = [
  { label: 'Whales', range: '> 1,000,000đ', count: 1240, pct: 1.4, color: 'bg-violet-500' },
  { label: 'Dolphins', range: '100k – 1M đ', count: 8760, pct: 9.8, color: 'bg-blue-500' },
  { label: 'Minnows', range: '1 – 100k đ', count: 22400, pct: 25.1, color: 'bg-emerald-500' },
  { label: 'Non-payers', range: '0đ', count: 56900, pct: 63.7, color: 'bg-slate-400' },
];

/** Interval percentiles (Register → First Purchase) */
export const INTERVAL_METRICS = {
  eventPair: 'Register → First Purchase',
  p25: '2h 14m',
  p50: '1d 8h',
  p75: '4d 22h',
};

/** RFM grid — 5×5, row=Recency (5=recent, 1=long ago), col=Frequency (1=low, 5=high) */
export const RFM_GRID: { label: string; color: string }[][] = [
  /* R5 */ [
    { label: 'New', color: 'bg-sky-100' },
    { label: 'Promising', color: 'bg-sky-200' },
    { label: 'Potential', color: 'bg-blue-200' },
    { label: 'Loyal', color: 'bg-emerald-300' },
    { label: 'Champion', color: 'bg-emerald-500 text-white' },
  ],
  /* R4 */ [
    { label: 'New', color: 'bg-sky-50' },
    { label: 'Promising', color: 'bg-sky-100' },
    { label: 'Potential', color: 'bg-blue-100' },
    { label: 'Loyal', color: 'bg-emerald-200' },
    { label: 'Champion', color: 'bg-emerald-400 text-white' },
  ],
  /* R3 */ [
    { label: 'About to Sleep', color: 'bg-amber-100' },
    { label: 'Need Attention', color: 'bg-amber-200' },
    { label: 'At Risk', color: 'bg-orange-200' },
    { label: 'At Risk', color: 'bg-orange-300' },
    { label: "Can't Lose", color: 'bg-red-300' },
  ],
  /* R2 */ [
    { label: 'Hibernating', color: 'bg-slate-200' },
    { label: 'Hibernating', color: 'bg-slate-200' },
    { label: 'At Risk', color: 'bg-orange-200' },
    { label: "Can't Lose", color: 'bg-red-200' },
    { label: "Can't Lose", color: 'bg-red-400 text-white' },
  ],
  /* R1 */ [
    { label: 'Lost', color: 'bg-slate-300' },
    { label: 'Lost', color: 'bg-slate-300' },
    { label: 'Hibernating', color: 'bg-slate-200' },
    { label: "Can't Lose", color: 'bg-red-200' },
    { label: "Can't Lose", color: 'bg-red-300' },
  ],
];

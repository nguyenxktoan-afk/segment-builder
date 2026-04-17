/** Mock data for the Campaign Stats tab */

export interface DeliveryFunnelStep {
  step: string;
  count: number;
  /** Min acceptable conversion rate vs previous step — null means no alert threshold */
  threshold: number | null;
}

export const DELIVERY_FUNNEL: DeliveryFunnelStep[] = [
  { step: 'Qualified', count: 245_000, threshold: null },
  { step: 'Sent',      count: 198_400, threshold: null },
  { step: 'Delivered', count: 185_200, threshold: 70 },
  { step: 'Clicked',   count: 22_224,  threshold: 3 },
  { step: 'Converted', count: 6_223,   threshold: null },
];

export const CAMPAIGN_SUMMARY = {
  totalConverted:      6_223,
  directConversion:    3_940,
  influencedConversion: 2_283,
  conversionRate:      3.14,
  conversionWindowDays: 7,
};

export interface RealImpactKpi {
  name: string;
  target: number;
  control: number;
  unit: string;
  /** If true, a lower value is better (e.g. churn rate) */
  lowerIsBetter: boolean;
}

export const REAL_IMPACT_KPIS: RealImpactKpi[] = [
  { name: 'Purchase Rate', target: 18.4, control: 14.2, unit: '%', lowerIsBetter: false },
  { name: 'D14 Retention', target: 42.1, control: 37.8, unit: '%', lowerIsBetter: false },
  { name: 'Churn Rate',    target: 8.2,  control: 11.5, unit: '%', lowerIsBetter: true },
];

export interface AbVariantRow {
  metric: string;
  a: string;
  b: string;
  winner: 'A' | 'B' | null;
  /** True for the deduplication summary row at the bottom */
  isTotal?: boolean;
}

export const AB_VARIANT_ROWS: AbVariantRow[] = [
  { metric: 'Sent',        a: '99,200', b: '99,200',  winner: null },
  { metric: 'Delivered',   a: '92,800', b: '92,400',  winner: null },
  { metric: 'Clicks',      a: '11,504', b: '10,720',  winner: 'A' },
  { metric: 'CTR',         a: '12.4%',  b: '11.6%',   winner: 'A' },
  { metric: 'Converted',   a: '3,280',  b: '2,943',   winner: 'A' },
  { metric: 'Conv. Rate',  a: '3.56%',  b: '3.19%',   winner: 'A' },
  { metric: 'All Variants total', a: '6,223', b: '—', winner: null, isTotal: true },
];

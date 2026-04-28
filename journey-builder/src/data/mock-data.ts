/**
 * Mock triggers grouped by product, and seed journeys for the Journey Builder demo.
 */
import type { TriggerDef, Journey, TriggerFilter } from '../types/journey';
import { genId } from '../lib/utils';

/* ── Trigger catalog ─────────────────────────────────────────────── */

export const TRIGGER_DEFS: TriggerDef[] = [
  // Cross Fire Legends (VN)
  {
    id: 'cfl-view-item',
    label: 'User views item',
    productCode: 'cfl-vn',
    productName: 'Cross Fire Legends (VN)',
    attributes: [
      { key: 'item_id',   label: 'Item ID',   type: 'string' },
      { key: 'item_type', label: 'Item Type', type: 'string' },
    ],
  },
  {
    id: 'cfl-complete-level',
    label: 'User completes level',
    productCode: 'cfl-vn',
    productName: 'Cross Fire Legends (VN)',
    attributes: [
      { key: 'level_id', label: 'Level ID', type: 'string' },
      { key: 'score',    label: 'Score',    type: 'number' },
    ],
  },
  {
    id: 'cfl-login',
    label: 'User logs in',
    productCode: 'cfl-vn',
    productName: 'Cross Fire Legends (VN)',
    attributes: [],
  },
  // Arena of Valor
  {
    id: 'aov-login',
    label: 'User logs in',
    productCode: 'arena-of-valor',
    productName: 'Arena of Valor',
    attributes: [],
  },
  {
    id: 'aov-purchase',
    label: 'User makes purchase',
    productCode: 'arena-of-valor',
    productName: 'Arena of Valor',
    attributes: [
      { key: 'product_id', label: 'Product ID', type: 'string' },
      { key: 'amount',     label: 'Amount (VNĐ)', type: 'number' },
    ],
  },
  {
    id: 'aov-match-end',
    label: 'Match ends',
    productCode: 'arena-of-valor',
    productName: 'Arena of Valor',
    attributes: [
      { key: 'result', label: 'Result (win/loss)', type: 'string' },
      { key: 'mvp',    label: 'MVP Flag',          type: 'string' },
    ],
  },
  // Zombie Shooter
  {
    id: 'zs-session-start',
    label: 'User starts session',
    productCode: 'zombie-shooter',
    productName: 'Zombie Shooter',
    attributes: [
      { key: 'platform', label: 'Platform', type: 'string' },
    ],
  },
  {
    id: 'zs-achievement',
    label: 'User earns achievement',
    productCode: 'zombie-shooter',
    productName: 'Zombie Shooter',
    attributes: [
      { key: 'achievement_id', label: 'Achievement ID', type: 'string' },
    ],
  },
  // Dream Garden
  {
    id: 'dg-plant-flower',
    label: 'User plants flower',
    productCode: 'dream-garden',
    productName: 'Dream Garden',
    attributes: [
      { key: 'flower_type', label: 'Flower Type', type: 'string' },
    ],
  },
  {
    id: 'dg-visit-friend',
    label: 'User visits friend garden',
    productCode: 'dream-garden',
    productName: 'Dream Garden',
    attributes: [
      { key: 'friend_id', label: 'Friend ID', type: 'string' },
    ],
  },
];

/** Get unique product groups for the trigger picker */
export const TRIGGER_PRODUCTS = Array.from(
  new Map(TRIGGER_DEFS.map(t => [t.productCode, { code: t.productCode, name: t.productName }])).values()
);

/* ── Segment-filter mock attributes ─────────────────────────────── */

export const FILTER_ATTRIBUTES = [
  { key: 'user.level',                label: 'User Level' },
  { key: 'user.has_purchased',        label: 'Has Purchased' },
  { key: 'user.days_since_install',   label: 'Days Since Install' },
  { key: 'user.vip_level',            label: 'VIP Level' },
  { key: 'user.country',              label: 'Country' },
  { key: 'user.total_spend',          label: 'Total Spend (VNĐ)' },
  { key: 'user.ladder_rank',          label: 'Ladder Rank (1–8)' },
  { key: 'event.platform',            label: 'Platform (iOS/Android)' },
  { key: 'event.item_id',             label: 'Event: Item ID' },
  { key: 'event.amount',              label: 'Event: Amount' },
];

/* ── Condition-node mock attributes ─────────────────────────────── */

export const CONDITION_ATTRIBUTES = [
  { key: 'user.level',           label: 'User Level' },
  { key: 'user.has_purchased',   label: 'Has Purchased' },
  { key: 'user.vip_level',       label: 'VIP Level' },
  { key: 'user.total_spend',     label: 'Total Spend' },
  { key: 'user.country',         label: 'Country' },
  { key: 'user.days_inactive',   label: 'Days Inactive' },
  { key: 'user.ladder_rank',     label: 'Ladder Rank' },
  { key: 'event.item_id',        label: 'Event Item ID' },
  { key: 'event.amount',         label: 'Event Amount' },
];

/* ── Seed journeys ───────────────────────────────────────────────── */

const triggerCflLogin = TRIGGER_DEFS.find(t => t.id === 'cfl-login')!;
const triggerAovPurchase = TRIGGER_DEFS.find(t => t.id === 'aov-purchase')!;
const triggerCflComplete = TRIGGER_DEFS.find(t => t.id === 'cfl-complete-level')!;

const defaultFilter: TriggerFilter = {
  logic: 'AND',
  conditions: [
    { id: genId('fc'), attribute: 'user.vip_level', operator: 'greater_than', value: '2' },
  ],
};

export const SEED_JOURNEYS: Journey[] = [
  {
    id: 'journey-seed-1',
    name: 'Re-engage Churned VIP Players',
    objective: 'Engagement',
    goal: 'Returning User',
    status: 'Active',
    journeyTime: { start: '2025-03-01', end: '2025-05-31' },
    trigger: triggerCflLogin,
    createdAt: '2025-03-01T08:00:00Z',
    nodes: [
      {
        id: 'n-trigger',
        type: 'trigger',
        position: { x: 280, y: 20 },
        deletable: false,
        data: {
          nodeType: 'trigger',
          triggerId: triggerCflLogin.id,
          triggerLabel: triggerCflLogin.label,
          productName: triggerCflLogin.productName,
          attrValues: {},
          filter: defaultFilter,
          configured: true,
        },
      },
      {
        id: 'n-cond-1',
        type: 'condition',
        position: { x: 200, y: 180 },
        data: {
          nodeType: 'condition',
          attribute: 'user.days_inactive',
          operator: 'greater_than',
          value: '14',
        },
      },
      {
        id: 'n-wait-1',
        type: 'wait-delay',
        position: { x: 80, y: 360 },
        data: { nodeType: 'wait-delay', mode: 'delay', amount: 2, unit: 'hours', datetime: '' },
      },
      {
        id: 'n-push-1',
        type: 'action-push',
        position: { x: 80, y: 520 },
        data: {
          nodeType: 'action-push',
          title: '🔥 Missed you, Commander!',
          body: 'Come back and claim your daily rewards before they expire.',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'n-trigger', target: 'n-cond-1', animated: true, type: 'smoothstep' },
      { id: 'e2', source: 'n-cond-1',  target: 'n-wait-1',  animated: true, type: 'smoothstep', sourceHandle: 'if' },
      { id: 'e3', source: 'n-wait-1',  target: 'n-push-1',  animated: true, type: 'smoothstep' },
    ],
  },
  {
    id: 'journey-seed-2',
    name: 'First Recharge Upsell Funnel',
    objective: 'Monetization',
    goal: 'Purchase',
    status: 'Draft',
    journeyTime: { start: '2025-04-01', end: '2025-06-30' },
    trigger: triggerAovPurchase,
    createdAt: '2025-03-15T10:30:00Z',
    nodes: [
      {
        id: 'n-trigger',
        type: 'trigger',
        position: { x: 280, y: 20 },
        deletable: false,
        data: {
          nodeType: 'trigger',
          triggerId: triggerAovPurchase.id,
          triggerLabel: triggerAovPurchase.label,
          productName: triggerAovPurchase.productName,
          attrValues: { product_id: 'bundle_starter', amount: '49000' },
          filter: null,
          configured: true,
        },
      },
      {
        id: 'n-split-1',
        type: 'split',
        position: { x: 200, y: 180 },
        data: {
          nodeType: 'split',
          branches: [
            { label: 'Control', percent: 50 },
            { label: 'Variant A', percent: 30 },
            { label: 'Variant B', percent: 20 },
          ],
        },
      },
      {
        id: 'n-email-1',
        type: 'action-email',
        position: { x: 40, y: 380 },
        data: {
          nodeType: 'action-email',
          subject: 'You\'re on your way! 🚀',
          body: 'Thank you for your first purchase. Here\'s an exclusive offer just for you.',
          sender: 'noreply@vnggames.com',
        },
      },
      {
        id: 'n-push-2',
        type: 'action-push',
        position: { x: 280, y: 380 },
        data: {
          nodeType: 'action-push',
          title: '🎁 Special offer inside!',
          body: 'Open the app to see your exclusive new-buyer bundle.',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'n-trigger', target: 'n-split-1',  animated: true, type: 'smoothstep' },
      { id: 'e2', source: 'n-split-1', target: 'n-email-1',  animated: true, type: 'smoothstep', sourceHandle: 'branch-0' },
      { id: 'e3', source: 'n-split-1', target: 'n-push-2',   animated: true, type: 'smoothstep', sourceHandle: 'branch-1' },
    ],
  },
  {
    id: 'journey-seed-3',
    name: 'Competitive Ladder Push',
    objective: 'Competitive',
    goal: 'Custom',
    status: 'Paused',
    journeyTime: { start: '2025-02-01', end: '2025-04-30' },
    trigger: triggerCflComplete,
    createdAt: '2025-02-01T09:00:00Z',
    nodes: [
      {
        id: 'n-trigger',
        type: 'trigger',
        position: { x: 280, y: 20 },
        deletable: false,
        data: {
          nodeType: 'trigger',
          triggerId: triggerCflComplete.id,
          triggerLabel: triggerCflComplete.label,
          productName: triggerCflComplete.productName,
          attrValues: { level_id: 'ladder_season_5', score: '1000' },
          filter: null,
          configured: true,
        },
      },
      {
        id: 'n-wait-t1',
        type: 'wait-trigger',
        position: { x: 240, y: 180 },
        data: {
          nodeType: 'wait-trigger',
          triggerId: 'cfl-login',
          triggerLabel: 'User logs in',
          timeLimitEnabled: true,
          timeLimitAmount: 3,
          timeLimitUnit: 'days',
        },
      },
      {
        id: 'n-inapp-1',
        type: 'action-inapp',
        position: { x: 240, y: 380 },
        data: {
          nodeType: 'action-inapp',
          title: '⚔️ Season ladder closes soon!',
          body: 'You\'re close to the next rank. Push now before the season ends!',
          imageUrl: '',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'n-trigger',  target: 'n-wait-t1', animated: true, type: 'smoothstep' },
      { id: 'e2', source: 'n-wait-t1',  target: 'n-inapp-1', animated: true, type: 'smoothstep' },
    ],
  },
];

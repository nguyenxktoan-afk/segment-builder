import type { Node, Edge } from '@xyflow/react';

/* ── Enums / literals ──────────────────────────────────────────────── */

export type JourneyStatus    = 'Active' | 'Draft' | 'Paused';
export type JourneyObjective = 'Engagement' | 'Monetization' | 'Competitive' | 'Social/UGC' | 'Partner/Cross Promotion';
export type JourneyGoal      = 'Purchase' | 'New Paying User' | 'Returning User' | 'Custom';

/* ── Trigger catalog ───────────────────────────────────────────────── */

export interface TriggerDef {
  id: string;
  label: string;
  productCode: string;
  productName: string;
  /** Mock attribute keys emitted with this event */
  attributes: { key: string; label: string; type: 'string' | 'number' }[];
}

/* ── Trigger filter (simple segment-builder rows) ──────────────────── */

export type FilterOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'is_true' | 'is_false';

export interface FilterCondition {
  id: string;
  attribute: string;   // e.g. 'user.level'
  operator: FilterOperator;
  value: string;
}

export interface TriggerFilter {
  logic: 'AND' | 'OR';
  conditions: FilterCondition[];
}

/* ── Per-node data shapes ──────────────────────────────────────────── */

export interface TriggerData {
  triggerId: string;
  triggerLabel: string;
  productName: string;
  attrValues: Record<string, string>;  // key → value
  filter: TriggerFilter | null;
  configured: boolean;
}

export interface ConditionData {
  attribute: string;
  operator: string;
  value: string;
}

export interface WaitDelayData {
  mode: 'delay' | 'datetime';
  amount: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks';
  datetime: string;
}

export interface WaitTriggerData {
  triggerId: string;
  triggerLabel: string;
  timeLimitEnabled: boolean;
  timeLimitAmount: number;
  timeLimitUnit: 'hours' | 'days';
}

export interface SplitBranch { label: string; percent: number }
export interface SplitData {
  branches: SplitBranch[];
}

export interface ActionEmailData {
  subject: string;
  body: string;
  sender: string;
}

export interface ActionPushData {
  title: string;
  body: string;
}

export interface ActionInAppData {
  title: string;
  body: string;
  imageUrl: string;
}

/** Discriminated union — every node carries one of these */
export type AnyNodeData =
  | ({ nodeType: 'trigger'       } & TriggerData)
  | ({ nodeType: 'condition'     } & ConditionData)
  | ({ nodeType: 'wait-delay'    } & WaitDelayData)
  | ({ nodeType: 'wait-trigger'  } & WaitTriggerData)
  | ({ nodeType: 'split'         } & SplitData)
  | ({ nodeType: 'action-email'  } & ActionEmailData)
  | ({ nodeType: 'action-push'   } & ActionPushData)
  | ({ nodeType: 'action-inapp'  } & ActionInAppData);

/** React Flow requires data extends Record<string,unknown> — use plain Node, cast data locally */
export type JourneyNode = Node;
export type JourneyEdge = Edge;

/* ── Journey entity ────────────────────────────────────────────────── */

export interface JourneyTime { start: string; end: string }

export interface Journey {
  id: string;
  name: string;
  objective: JourneyObjective;
  goal: JourneyGoal;
  status: JourneyStatus;
  journeyTime: JourneyTime | null;
  trigger: TriggerDef;
  nodes: JourneyNode[];
  edges: JourneyEdge[];
  createdAt: string;
}

/* ── Create form DTO ───────────────────────────────────────────────── */

export interface CreateJourneyDto {
  name: string;
  objective: JourneyObjective;
  goal: JourneyGoal;
  journeyTime: JourneyTime | null;
  trigger: TriggerDef;
}

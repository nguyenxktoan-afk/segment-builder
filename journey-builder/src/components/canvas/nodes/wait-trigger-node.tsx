import type { NodeProps } from '@xyflow/react';
import { Hourglass } from 'lucide-react';
import { BaseNode, NodeRow } from './base-node';
import type { WaitTriggerData } from '@/types/journey';

export function WaitTriggerNode({ id, data }: NodeProps) {
  const d = data as unknown as WaitTriggerData;
  const limit = d.timeLimitEnabled
    ? `${d.timeLimitAmount}${d.timeLimitUnit[0]} limit`
    : 'No limit';
  return (
    <BaseNode
      nodeId={id}
      accentClass="node-wait-trigger"
      headerBg="bg-cyan-50"
      icon={<Hourglass size={13} className="text-cyan-600" />}
      title="Wait — For Trigger"
    >
      <NodeRow label="Trigger" value={d.triggerLabel || 'Not set'} />
      <NodeRow label="Limit"   value={limit} />
    </BaseNode>
  );
}

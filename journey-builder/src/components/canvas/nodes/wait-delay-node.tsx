import type { NodeProps } from '@xyflow/react';
import { Timer } from 'lucide-react';
import { BaseNode, NodeRow } from './base-node';
import type { WaitDelayData } from '@/types/journey';

export function WaitDelayNode({ id, data }: NodeProps) {
  const d = data as unknown as WaitDelayData;
  const summary = d.mode === 'datetime'
    ? d.datetime || 'Set datetime…'
    : `${d.amount} ${d.unit}`;
  return (
    <BaseNode
      nodeId={id}
      accentClass="node-wait-delay"
      headerBg="bg-blue-50"
      icon={<Timer size={13} className="text-blue-600" />}
      title="Wait — Time Delay"
    >
      <NodeRow label="Delay" value={summary} />
    </BaseNode>
  );
}

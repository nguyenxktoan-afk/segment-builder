import type { NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import { BaseNode, NodeRow, NodeLabel } from './base-node';
import type { TriggerData } from '@/types/journey';

export function TriggerNode({ id, data }: NodeProps) {
  const d = data as unknown as TriggerData;
  const filterCount = d.filter?.conditions.length ?? 0;
  return (
    <BaseNode
      nodeId={id}
      deletable={false}
      accentClass="node-trigger"
      headerBg="bg-violet-50"
      icon={<Zap size={13} className="text-violet-600" fill="currentColor" />}
      title={d.triggerLabel || 'Trigger'}
    >
      <NodeRow label="Product" value={d.productName} />
      {d.configured && filterCount > 0 && (
        <NodeLabel>Filtered by: {filterCount} condition{filterCount > 1 ? 's' : ''}</NodeLabel>
      )}
      {!d.configured && <NodeLabel>⚠ Click to configure</NodeLabel>}
    </BaseNode>
  );
}

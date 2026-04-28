import type { NodeProps } from '@xyflow/react';
import { BellRing } from 'lucide-react';
import { BaseNode, NodeRow } from './base-node';
import type { ActionPushData } from '@/types/journey';

export function ActionPushNode({ id, data }: NodeProps) {
  const d = data as unknown as ActionPushData;
  return (
    <BaseNode
      nodeId={id}
      accentClass="node-push"
      headerBg="bg-orange-50"
      icon={<BellRing size={13} className="text-orange-600" />}
      title="Send Push Notification"
    >
      {d.title ? (
        <NodeRow label="Title" value={d.title} />
      ) : (
        <span className="text-[11px] text-slate-400">Click to configure…</span>
      )}
    </BaseNode>
  );
}

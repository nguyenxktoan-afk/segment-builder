import type { NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import { BaseNode, NodeRow } from './base-node';
import type { ActionInAppData } from '@/types/journey';

export function ActionInAppNode({ id, data }: NodeProps) {
  const d = data as unknown as ActionInAppData;
  return (
    <BaseNode
      nodeId={id}
      accentClass="node-inapp"
      headerBg="bg-pink-50"
      icon={<MessageSquare size={13} className="text-pink-600" />}
      title="Send In-App Message"
    >
      {d.title ? (
        <NodeRow label="Title" value={d.title} />
      ) : (
        <span className="text-[11px] text-slate-400">Click to configure…</span>
      )}
    </BaseNode>
  );
}

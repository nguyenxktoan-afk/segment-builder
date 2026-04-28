import type { NodeProps } from '@xyflow/react';
import { Mail } from 'lucide-react';
import { BaseNode, NodeRow } from './base-node';
import type { ActionEmailData } from '@/types/journey';

export function ActionEmailNode({ id, data }: NodeProps) {
  const d = data as unknown as ActionEmailData;
  return (
    <BaseNode
      nodeId={id}
      accentClass="node-email"
      headerBg="bg-red-50"
      icon={<Mail size={13} className="text-red-600" />}
      title="Send Email"
    >
      {d.subject ? (
        <>
          <NodeRow label="Subject" value={d.subject} />
          <NodeRow label="From"    value={d.sender || '—'} />
        </>
      ) : (
        <span className="text-[11px] text-slate-400">Click to configure…</span>
      )}
    </BaseNode>
  );
}

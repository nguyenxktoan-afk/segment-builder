import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { BaseNode, NodeRow } from './base-node';
import type { ConditionData } from '@/types/journey';

export function ConditionNode({ id, data }: NodeProps) {
  const d = data as unknown as ConditionData;
  return (
    <BaseNode
      nodeId={id}
      accentClass="node-condition"
      headerBg="bg-amber-50"
      icon={<GitBranch size={13} className="text-amber-600" />}
      title="Condition"
      customSourceHandles={
        <div className="relative h-5">
          <Handle type="source" position={Position.Bottom} id="if"
            style={{ left: '28%' }}
            className="!bg-emerald-500 !w-2.5 !h-2.5 !border-2 !border-white" />
          <Handle type="source" position={Position.Bottom} id="else"
            style={{ left: '72%' }}
            className="!bg-slate-400 !w-2.5 !h-2.5 !border-2 !border-white" />
          <span className="absolute bottom-1 text-[9px] font-bold text-emerald-600" style={{ left: '14%' }}>IF</span>
          <span className="absolute bottom-1 text-[9px] font-bold text-slate-400" style={{ left: '64%' }}>ELSE</span>
        </div>
      }
    >
      {d.attribute ? (
        <NodeRow label={d.attribute} value={`${d.operator ?? '='} ${d.value ?? ''}`} />
      ) : (
        <span className="text-[11px] text-slate-400">Click to configure…</span>
      )}
    </BaseNode>
  );
}

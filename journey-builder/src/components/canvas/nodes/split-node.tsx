import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { Shuffle } from 'lucide-react';
import { BaseNode } from './base-node';
import type { SplitData } from '@/types/journey';

export function SplitNode({ id, data }: NodeProps) {
  const d = data as unknown as SplitData;
  const branches = d.branches?.length
    ? d.branches
    : [{ label: 'Branch A', percent: 50 }, { label: 'Branch B', percent: 50 }];

  return (
    <BaseNode
      nodeId={id}
      accentClass="node-split"
      headerBg="bg-emerald-50"
      icon={<Shuffle size={13} className="text-emerald-600" />}
      title="Split"
      customSourceHandles={
        <div className="relative" style={{ height: 32 }}>
          {branches.map((_, i) => (
            <Handle
              key={i}
              type="source"
              position={Position.Bottom}
              id={`branch-${i}`}
              style={{ left: `${((i + 0.5) / branches.length) * 100}%` }}
              className="!bg-emerald-500 !w-2.5 !h-2.5 !border-2 !border-white"
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 flex">
            {branches.map((b, i) => (
              <span key={i} className="flex-1 text-center text-[9px] text-emerald-600 font-semibold leading-none pb-0.5">
                {b.percent}%
              </span>
            ))}
          </div>
        </div>
      }
    >
      <div className="flex flex-wrap gap-1">
        {branches.map((b, i) => (
          <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
            {b.label}
          </span>
        ))}
      </div>
    </BaseNode>
  );
}

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SplitData, SplitBranch } from '@/types/journey';
import { cn } from '@/lib/utils';

interface Props {
  data: SplitData;
  onChange: (patch: Partial<SplitData>) => void;
}

export function SplitForm({ data, onChange }: Props) {
  const branches = data.branches?.length
    ? data.branches
    : [{ label: 'Branch A', percent: 50 }, { label: 'Branch B', percent: 50 }];

  const total = branches.reduce((s, b) => s + b.percent, 0);
  const valid = total === 100;

  const update = (idx: number, patch: Partial<SplitBranch>) => {
    const next = branches.map((b, i) => i === idx ? { ...b, ...patch } : b);
    onChange({ branches: next });
  };

  const addBranch = () => {
    if (branches.length >= 5) return;
    onChange({ branches: [...branches, { label: `Branch ${String.fromCharCode(65 + branches.length)}`, percent: 0 }] });
  };

  const removeBranch = (idx: number) => {
    if (branches.length <= 2) return;
    onChange({ branches: branches.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-3">
      {branches.map((b, i) => (
        <div key={i} className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-600 mb-1 block">Label</label>
            <input
              value={b.label}
              onChange={e => update(i, { label: e.target.value })}
              className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
          <div className="w-20">
            <label className="text-xs font-medium text-slate-600 mb-1 block">%</label>
            <input
              type="number" min={0} max={100}
              value={b.percent}
              onChange={e => update(i, { percent: Number(e.target.value) })}
              className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
          <button onClick={() => removeBranch(i)} disabled={branches.length <= 2}
            className="mb-0.5 p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-medium', valid ? 'text-emerald-600' : 'text-red-500')}>
          Total: {total}% {valid ? '✓' : '(must equal 100)'}
        </span>
        <Button variant="ghost" size="sm" onClick={addBranch} disabled={branches.length >= 5}>
          <Plus size={12} /> Add branch
        </Button>
      </div>
    </div>
  );
}

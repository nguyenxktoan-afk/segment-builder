import { Input, Textarea } from '@/components/ui/input';
import type { ActionPushData } from '@/types/journey';

interface Props {
  data: ActionPushData;
  onChange: (patch: Partial<ActionPushData>) => void;
}

export function ActionPushForm({ data, onChange }: Props) {
  const chars = data.body?.length ?? 0;
  return (
    <div className="space-y-3">
      <Input
        label="Title"
        placeholder="e.g. 🔥 Come back, Commander!"
        value={data.title}
        onChange={e => onChange({ title: e.target.value })}
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Body</label>
          <span className={`text-xs ${chars > 100 ? 'text-red-500' : 'text-slate-400'}`}>{chars}/100</span>
        </div>
        <Textarea
          placeholder="Short notification body…"
          rows={3}
          value={data.body}
          onChange={e => onChange({ body: e.target.value })}
        />
      </div>

      {/* Preview bubble */}
      {(data.title || data.body) && (
        <div className="bg-slate-900 rounded-xl px-3 py-2.5 text-white">
          <p className="text-xs font-semibold leading-snug">{data.title || '(title)'}</p>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{data.body || '(body)'}</p>
        </div>
      )}
    </div>
  );
}

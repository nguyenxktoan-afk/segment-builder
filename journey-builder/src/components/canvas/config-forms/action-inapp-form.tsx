import { Input, Textarea } from '@/components/ui/input';
import type { ActionInAppData } from '@/types/journey';

interface Props {
  data: ActionInAppData;
  onChange: (patch: Partial<ActionInAppData>) => void;
}

export function ActionInAppForm({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      <Input
        label="Title"
        placeholder="e.g. ⚔️ Season ends soon!"
        value={data.title}
        onChange={e => onChange({ title: e.target.value })}
      />
      <Textarea
        label="Body"
        placeholder="In-app message body…"
        rows={3}
        value={data.body}
        onChange={e => onChange({ body: e.target.value })}
      />
      <Input
        label="Image URL (optional)"
        placeholder="https://cdn.example.com/banner.jpg"
        value={data.imageUrl}
        onChange={e => onChange({ imageUrl: e.target.value })}
      />

      {/* Preview card */}
      {(data.title || data.body) && (
        <div className="border border-pink-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {data.imageUrl && (
            <img src={data.imageUrl} alt="preview" className="w-full h-24 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          )}
          <div className="px-3 py-2.5">
            <p className="text-sm font-semibold text-slate-900">{data.title || '(title)'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{data.body || '(body)'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

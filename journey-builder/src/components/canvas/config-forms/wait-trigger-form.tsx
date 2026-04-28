import { Input, SelectField } from '@/components/ui/input';
import { TRIGGER_DEFS, TRIGGER_PRODUCTS } from '@/data/mock-data';
import type { WaitTriggerData } from '@/types/journey';

interface Props {
  data: WaitTriggerData;
  onChange: (patch: Partial<WaitTriggerData>) => void;
}

export function WaitTriggerForm({ data, onChange }: Props) {
  const handleTriggerSelect = (triggerId: string) => {
    const def = TRIGGER_DEFS.find(t => t.id === triggerId);
    onChange({ triggerId, triggerLabel: def?.label ?? '' });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Wait for Trigger</label>
        <select
          value={data.triggerId}
          onChange={e => handleTriggerSelect(e.target.value)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
        >
          <option value="">Select trigger…</option>
          {TRIGGER_PRODUCTS.map(prod => (
            <optgroup key={prod.code} label={prod.name}>
              {TRIGGER_DEFS.filter(t => t.productCode === prod.code).map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Time limit toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={data.timeLimitEnabled}
          onChange={e => onChange({ timeLimitEnabled: e.target.checked })}
          className="rounded border-slate-300 text-violet-600 focus:ring-violet-500/30"
        />
        <span className="text-sm text-slate-700">Enable time limit</span>
      </label>

      {data.timeLimitEnabled && (
        <div className="flex gap-2">
          <Input
            label="Limit"
            type="number"
            min={1}
            value={data.timeLimitAmount}
            onChange={e => onChange({ timeLimitAmount: Number(e.target.value) })}
            className="w-24"
          />
          <SelectField
            label="Unit"
            value={data.timeLimitUnit}
            onChange={e => onChange({ timeLimitUnit: e.target.value as WaitTriggerData['timeLimitUnit'] })}
            className="flex-1"
          >
            <option value="hours">hours</option>
            <option value="days">days</option>
          </SelectField>
        </div>
      )}
    </div>
  );
}

import { Input, SelectField } from '@/components/ui/input';
import type { WaitDelayData } from '@/types/journey';

interface Props {
  data: WaitDelayData;
  onChange: (patch: Partial<WaitDelayData>) => void;
}

const UNITS: WaitDelayData['unit'][] = ['minutes', 'hours', 'days', 'weeks'];

export function WaitDelayForm({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
        {(['delay', 'datetime'] as const).map(m => (
          <button
            key={m}
            onClick={() => onChange({ mode: m })}
            className={`flex-1 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              data.mode === m
                ? 'bg-violet-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {m === 'delay' ? '⏱ Time Delay' : '📅 Specific Date'}
          </button>
        ))}
      </div>

      {data.mode === 'delay' ? (
        <div className="flex gap-2">
          <Input
            label="Amount"
            type="number"
            min={1}
            value={data.amount}
            onChange={e => onChange({ amount: Number(e.target.value) })}
            className="w-24"
          />
          <SelectField
            label="Unit"
            value={data.unit}
            onChange={e => onChange({ unit: e.target.value as WaitDelayData['unit'] })}
            className="flex-1"
          >
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </SelectField>
        </div>
      ) : (
        <Input
          label="Datetime"
          type="datetime-local"
          value={data.datetime}
          onChange={e => onChange({ datetime: e.target.value })}
        />
      )}
    </div>
  );
}

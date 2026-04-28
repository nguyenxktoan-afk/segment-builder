import { SelectField, Input } from '@/components/ui/input';
import { CONDITION_ATTRIBUTES } from '@/data/mock-data';
import type { ConditionData } from '@/types/journey';

const OPERATORS = [
  { value: 'equals',       label: '= equals' },
  { value: 'not_equals',   label: '≠ not equals' },
  { value: 'greater_than', label: '> greater than' },
  { value: 'less_than',    label: '< less than' },
  { value: 'contains',     label: 'contains' },
  { value: 'is_true',      label: 'is true' },
  { value: 'is_false',     label: 'is false' },
];

interface Props {
  data: ConditionData;
  onChange: (patch: Partial<ConditionData>) => void;
}

export function ConditionForm({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Attribute"
        value={data.attribute}
        onChange={e => onChange({ attribute: e.target.value })}
      >
        <option value="">Select attribute…</option>
        {CONDITION_ATTRIBUTES.map(a => (
          <option key={a.key} value={a.key}>{a.label}</option>
        ))}
      </SelectField>

      <SelectField
        label="Operator"
        value={data.operator}
        onChange={e => onChange({ operator: e.target.value })}
      >
        <option value="">Select operator…</option>
        {OPERATORS.map(op => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </SelectField>

      {data.operator && !['is_true', 'is_false'].includes(data.operator) && (
        <Input
          label="Value"
          placeholder="Enter value…"
          value={data.value}
          onChange={e => onChange({ value: e.target.value })}
        />
      )}

      <div className="bg-amber-50 rounded-lg px-3 py-2 text-[11px] text-amber-700">
        <strong>If</strong> branch fires when condition is met.{' '}
        <strong>Else</strong> branch fires otherwise.
      </div>
    </div>
  );
}

/**
 * Trigger configuration form — attribute values + optional segment filter.
 * Used inside both the trigger-config-modal and the right-panel config.
 */
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input, SelectField } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FILTER_ATTRIBUTES } from '@/data/mock-data';
import { genId } from '@/lib/utils';
import type { TriggerData, TriggerFilter, FilterCondition, FilterOperator } from '@/types/journey';

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals',       label: '= equals' },
  { value: 'not_equals',   label: '≠ not equals' },
  { value: 'greater_than', label: '> greater than' },
  { value: 'less_than',    label: '< less than' },
  { value: 'contains',     label: 'contains' },
  { value: 'is_true',      label: 'is true' },
  { value: 'is_false',     label: 'is false' },
];

interface Props {
  data: TriggerData;
  onChange: (patch: Partial<TriggerData>) => void;
}

export function TriggerConfigForm({ data, onChange }: Props) {
  const [filterEnabled, setFilterEnabled] = useState(!!data.filter);

  const setAttr = (key: string, val: string) =>
    onChange({ attrValues: { ...data.attrValues, [key]: val } });

  const toggleFilter = (enabled: boolean) => {
    setFilterEnabled(enabled);
    if (enabled && !data.filter) {
      onChange({ filter: { logic: 'AND', conditions: [{ id: genId('fc'), attribute: '', operator: 'equals', value: '' }] } });
    } else if (!enabled) {
      onChange({ filter: null });
    }
  };

  const updateCondition = (id: string, patch: Partial<FilterCondition>) => {
    if (!data.filter) return;
    onChange({ filter: { ...data.filter, conditions: data.filter.conditions.map(c => c.id === id ? { ...c, ...patch } : c) } });
  };

  const addCondition = () => {
    if (!data.filter) return;
    const c: FilterCondition = { id: genId('fc'), attribute: '', operator: 'equals', value: '' };
    onChange({ filter: { ...data.filter, conditions: [...data.filter.conditions, c] } });
  };

  const removeCondition = (id: string) => {
    if (!data.filter) return;
    onChange({ filter: { ...data.filter, conditions: data.filter.conditions.filter(c => c.id !== id) } });
  };

  const toggleLogic = () => {
    if (!data.filter) return;
    onChange({ filter: { ...data.filter, logic: data.filter.logic === 'AND' ? 'OR' : 'AND' } });
  };

  return (
    <div className="space-y-4">
      {/* Trigger attribute values */}
      {data.configured && Object.keys(data.attrValues ?? {}).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trigger Attributes</p>
          {Object.entries(data.attrValues).map(([k, v]) => (
            <Input key={k} label={k} value={v} onChange={e => setAttr(k, e.target.value)} />
          ))}
        </div>
      )}

      {/* Segment filter toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={filterEnabled} onChange={e => toggleFilter(e.target.checked)}
          className="rounded border-slate-300 text-violet-600" />
        <span className="text-sm text-slate-700 font-medium">Filter who can enter this flow</span>
      </label>

      {filterEnabled && data.filter && (
        <div className="space-y-2 border border-slate-200 rounded-xl p-3">
          {data.filter.conditions.map((cond, idx) => (
            <div key={cond.id}>
              {idx > 0 && (
                <button onClick={toggleLogic}
                  className="mb-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-violet-100 text-violet-700 cursor-pointer hover:bg-violet-200">
                  {(data.filter as TriggerFilter).logic}
                </button>
              )}
              <div className="flex gap-1.5 items-end">
                <SelectField value={cond.attribute} onChange={e => updateCondition(cond.id, { attribute: e.target.value })} className="flex-1 text-xs">
                  <option value="">Attribute…</option>
                  {FILTER_ATTRIBUTES.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
                </SelectField>
                <SelectField value={cond.operator} onChange={e => updateCondition(cond.id, { operator: e.target.value as FilterOperator })} className="w-28 text-xs">
                  {OPERATORS.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                </SelectField>
                {!['is_true','is_false'].includes(cond.operator) && (
                  <input value={cond.value} onChange={e => updateCondition(cond.id, { value: e.target.value })}
                    placeholder="value"
                    className="h-9 w-20 rounded-lg border border-slate-200 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/30" />
                )}
                <button onClick={() => removeCondition(cond.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer mb-0.5">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addCondition} className="w-full justify-center border border-dashed border-slate-200 mt-1">
            <Plus size={12} /> Add condition
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Modal for creating a new Journey — name, objective, goal, time range, trigger.
 */
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, SelectField } from '@/components/ui/input';
import { TRIGGER_DEFS, TRIGGER_PRODUCTS } from '@/data/mock-data';
import type { CreateJourneyDto, JourneyObjective, JourneyGoal } from '@/types/journey';

const OBJECTIVES: JourneyObjective[] = [
  'Engagement', 'Monetization', 'Competitive', 'Social/UGC', 'Partner/Cross Promotion',
];
const GOALS: JourneyGoal[] = [
  'Purchase', 'New Paying User', 'Returning User', 'Custom',
];

interface Props {
  onSubmit: (dto: CreateJourneyDto) => void;
  onClose: () => void;
}

export function CreateJourneyModal({ onSubmit, onClose }: Props) {
  const [name,       setName]       = useState('');
  const [objective,  setObjective]  = useState<JourneyObjective | ''>('');
  const [goal,       setGoal]       = useState<JourneyGoal | ''>('');
  const [startDate,  setStartDate]  = useState('');
  const [endDate,    setEndDate]    = useState('');
  const [triggerId,  setTriggerId]  = useState('');
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())   e.name      = 'Name is required.';
    if (!objective)     e.objective = 'Objective is required.';
    if (!goal)          e.goal      = 'Goal is required.';
    if (!triggerId)     e.trigger   = 'Trigger is required.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const trigger = TRIGGER_DEFS.find(t => t.id === triggerId)!;
    onSubmit({
      name: name.trim(),
      objective: objective as JourneyObjective,
      goal:      goal as JourneyGoal,
      journeyTime: startDate && endDate ? { start: startDate, end: endDate } : null,
      trigger,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Create Journey</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <Input
            label="Journey Name *"
            placeholder="e.g. Re-engage Churned VIPs"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: '' })); }}
            error={errors.name}
          />

          <SelectField
            label="Objective *"
            value={objective}
            onChange={e => { setObjective(e.target.value as JourneyObjective); setErrors(v => ({ ...v, objective: '' })); }}
            error={errors.objective}
          >
            <option value="">Select objective…</option>
            {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
          </SelectField>

          <SelectField
            label="Goal *"
            value={goal}
            onChange={e => { setGoal(e.target.value as JourneyGoal); setErrors(v => ({ ...v, goal: '' })); }}
            error={errors.goal}
          >
            <option value="">Select goal…</option>
            {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
          </SelectField>

          {/* Date range */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Journey Time (optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" placeholder="Start" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <Input type="date" placeholder="End"   value={endDate}   onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Trigger grouped by product */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Trigger *</label>
            <select
              value={triggerId}
              onChange={e => { setTriggerId(e.target.value); setErrors(v => ({ ...v, trigger: '' })); }}
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
            {errors.trigger && <p className="text-xs text-red-500">{errors.trigger}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Journey</Button>
        </div>
      </div>
    </div>
  );
}

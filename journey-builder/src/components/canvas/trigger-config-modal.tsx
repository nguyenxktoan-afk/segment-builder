/**
 * Modal shown on first canvas load when the trigger node hasn't been configured yet.
 */
import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TriggerConfigForm } from './config-forms/trigger-config-form';
import type { TriggerData } from '@/types/journey';

interface Props {
  initialData: TriggerData;
  onSave: (data: TriggerData) => void;
  onClose: () => void;
}

export function TriggerConfigModal({ initialData, onSave, onClose }: Props) {
  const [data, setData] = useState<TriggerData>(initialData);

  const patch = (p: Partial<TriggerData>) => setData(d => ({ ...d, ...p }));

  const handleSave = () => {
    onSave({ ...data, configured: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100">
            <Zap size={15} className="text-violet-600" fill="currentColor" />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900">Configure Trigger</h2>
            <p className="text-xs text-slate-500">{initialData.productName} · {initialData.triggerLabel}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Trigger attribute inputs */}
          {initialData.triggerId && (
            <div className="space-y-3">
              {/* The TriggerConfigForm handles attributes + filter */}
              <TriggerConfigForm data={data} onChange={patch} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>Skip for now</Button>
          <Button onClick={handleSave}>Save &amp; Continue</Button>
        </div>
      </div>
    </div>
  );
}

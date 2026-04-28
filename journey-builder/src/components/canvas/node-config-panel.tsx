/**
 * Right-side config panel — renders the appropriate form for the selected node.
 */
import { X } from 'lucide-react';
import { useCanvasUIStore } from '@/store/canvas-ui-store';
import { TriggerConfigForm }  from './config-forms/trigger-config-form';
import { ConditionForm }      from './config-forms/condition-form';
import { WaitDelayForm }      from './config-forms/wait-delay-form';
import { WaitTriggerForm }    from './config-forms/wait-trigger-form';
import { SplitForm }          from './config-forms/split-form';
import { ActionEmailForm }    from './config-forms/action-email-form';
import { ActionPushForm }     from './config-forms/action-push-form';
import { ActionInAppForm }    from './config-forms/action-inapp-form';
import type { JourneyNode, AnyNodeData } from '@/types/journey';

const PANEL_TITLES: Record<string, string> = {
  trigger:       '⚡ Trigger',
  condition:     '⬡ Condition',
  'wait-delay':  '⏱ Time Delay',
  'wait-trigger':'⌛ Wait for Trigger',
  split:         '⇌ Split',
  'action-email':'✉ Send Email',
  'action-push': '🔔 Push Notification',
  'action-inapp':'💬 In-App Message',
};

interface Props {
  node: JourneyNode;
  onDataChange: (nodeId: string, patch: Record<string, unknown>) => void;
}

export function NodeConfigPanel({ node, onDataChange }: Props) {
  const setSelectedNodeId = useCanvasUIStore(s => s.setSelectedNodeId);
  const data = node.data as unknown as AnyNodeData;
  const change = (patch: Record<string, unknown>) => onDataChange(node.id, patch);

  const renderForm = () => {
    switch (data.nodeType) {
      case 'trigger':       return <TriggerConfigForm data={data} onChange={change} />;
      case 'condition':     return <ConditionForm data={data} onChange={change} />;
      case 'wait-delay':    return <WaitDelayForm data={data} onChange={change} />;
      case 'wait-trigger':  return <WaitTriggerForm data={data} onChange={change} />;
      case 'split':         return <SplitForm data={data} onChange={change} />;
      case 'action-email':  return <ActionEmailForm data={data} onChange={change} />;
      case 'action-push':   return <ActionPushForm data={data} onChange={change} />;
      case 'action-inapp':  return <ActionInAppForm data={data} onChange={change} />;
      default:              return <p className="text-sm text-slate-400">No config available.</p>;
    }
  };

  return (
    <aside className="w-72 shrink-0 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-800">
          {PANEL_TITLES[node.type ?? ''] ?? 'Configure Node'}
        </span>
        <button onClick={() => setSelectedNodeId(null)}
          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
          <X size={15} />
        </button>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {renderForm()}
      </div>
    </aside>
  );
}

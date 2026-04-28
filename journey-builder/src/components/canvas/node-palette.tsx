/**
 * Left sidebar — draggable node type catalogue.
 */
import { GitBranch, Timer, Hourglass, Shuffle, Mail, BellRing, MessageSquare } from 'lucide-react';
import type { ReactNode } from 'react';

interface PaletteItem {
  type: string;
  icon: ReactNode;
  label: string;
  desc: string;
  iconBg: string;
  iconColor: string;
}

const GROUPS: { label: string; color: string; items: PaletteItem[] }[] = [
  {
    label: 'Logic', color: 'text-amber-500',
    items: [
      { type: 'condition', icon: <GitBranch size={13} />, label: 'Condition', desc: 'If / Else branch',
        iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
    ],
  },
  {
    label: 'Wait', color: 'text-blue-500',
    items: [
      { type: 'wait-delay',   icon: <Timer size={13} />,    label: 'Time Delay',  desc: 'Pause for N time',
        iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      { type: 'wait-trigger', icon: <Hourglass size={13} />, label: 'For Trigger', desc: 'Wait for an event',
        iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
    ],
  },
  {
    label: 'Split', color: 'text-emerald-500',
    items: [
      { type: 'split', icon: <Shuffle size={13} />, label: 'Split', desc: 'Traffic distribution',
        iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    ],
  },
  {
    label: 'Actions', color: 'text-pink-500',
    items: [
      { type: 'action-email', icon: <Mail size={13} />,          label: 'Send Email',      desc: 'Email campaign',
        iconBg: 'bg-red-100',    iconColor: 'text-red-600' },
      { type: 'action-push',  icon: <BellRing size={13} />,      label: 'Push Notif.',     desc: 'Mobile push alert',
        iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
      { type: 'action-inapp', icon: <MessageSquare size={13} />, label: 'In-App Message',  desc: 'In-app modal',
        iconBg: 'bg-pink-100',   iconColor: 'text-pink-600' },
    ],
  },
];

const onDragStart = (e: React.DragEvent, nodeType: string) => {
  e.dataTransfer.setData('application/reactflow', nodeType);
  e.dataTransfer.effectAllowed = 'move';
};

export function NodePalette() {
  return (
    <aside className="w-48 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
      <div className="px-3 pt-3 pb-2 border-b border-slate-100">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nodes</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Drag onto canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {GROUPS.map(group => (
          <div key={group.label} className="px-2">
            <p className={`px-1 py-1.5 text-[9px] font-bold uppercase tracking-widest ${group.color}`}>
              {group.label}
            </p>
            {group.items.map(item => (
              <div
                key={item.type}
                draggable
                onDragStart={e => onDragStart(e, item.type)}
                className="flex items-center gap-2 px-2 py-2 mb-0.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-sm"
              >
                <span className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${item.iconBg} ${item.iconColor}`}>
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-700 leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

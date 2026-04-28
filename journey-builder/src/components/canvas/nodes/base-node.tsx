/**
 * Shared shell for every Journey node — handles hover menu, handles, styling.
 */
import { useState, type ReactNode } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { useCanvasUIStore } from '@/store/canvas-ui-store';
import { genId, cn } from '@/lib/utils';

interface BaseNodeProps {
  nodeId: string;
  deletable?: boolean;
  /** CSS class for the left-border accent AND header tint e.g. "node-trigger" */
  accentClass: string;
  /** Header tint class e.g. "bg-violet-50" */
  headerBg?: string;
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  /** Replaces the default single bottom source handle */
  customSourceHandles?: ReactNode;
}

export function BaseNode({
  nodeId, deletable = true, accentClass, headerBg = 'bg-slate-50',
  icon, title, children, customSourceHandles,
}: BaseNodeProps) {
  const [hovered, setHovered] = useState(false);
  const { deleteElements, getNode, addNodes } = useReactFlow();
  const setSelectedNodeId = useCanvasUIStore(s => s.setSelectedNodeId);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id: nodeId }] });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const node = getNode(nodeId);
    if (!node) return;
    addNodes({ ...node, id: genId('node'), selected: false,
      position: { x: node.position.x + 48, y: node.position.y + 48 } });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
  };

  return (
    <div
      className={cn(
        'relative bg-white rounded-xl border border-slate-200 shadow-sm min-w-[200px] max-w-[250px]',
        'transition-shadow hover:shadow-md',
        accentClass,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Incoming handle */}
      <Handle
        type="target" position={Position.Top}
        className="!bg-white !w-3 !h-3 !border-2 !border-slate-300 !rounded-full"
      />

      {/* Header */}
      <div className={cn('flex items-center gap-2 px-3 pt-2.5 pb-2 rounded-t-xl border-b border-slate-100', headerBg)}>
        <span className="shrink-0 leading-none">{icon}</span>
        <span className="text-[12px] font-bold text-slate-700 flex-1 truncate tracking-tight">{title}</span>

        {/* Hover actions */}
        <div className={cn('flex items-center gap-0.5 transition-opacity', hovered ? 'opacity-100' : 'opacity-0')}>
          <button onClick={handleEdit} title="Edit"
            className="p-1 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 cursor-pointer">
            <Pencil size={10} />
          </button>
          <button onClick={handleCopy} title="Copy"
            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer">
            <Copy size={10} />
          </button>
          {deletable && (
            <button onClick={handleDelete} title="Delete"
              className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer">
              <Trash2 size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {children && (
        <div className="px-3 py-2 space-y-0.5">{children}</div>
      )}

      {/* Source handle(s) */}
      {customSourceHandles ?? (
        <Handle
          type="source" position={Position.Bottom}
          className="!bg-white !w-3 !h-3 !border-2 !border-slate-300 !rounded-full"
        />
      )}
    </div>
  );
}

/** Small muted label inside a node body */
export function NodeLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] text-slate-400 truncate">{children}</p>;
}

/** Key–value row in a node body */
export function NodeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1 text-[11px]">
      <span className="text-slate-400 shrink-0">{label}:</span>
      <span className="text-slate-700 font-medium truncate">{value}</span>
    </div>
  );
}

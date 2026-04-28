/**
 * /journeys/:id/builder — React Flow canvas for designing a Journey.
 * Split: JourneyCanvasPage wraps ReactFlowProvider; CanvasInner owns all flow logic.
 */
import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant,
  Controls, MiniMap, addEdge,
  useNodesState, useEdgesState, useReactFlow,
  type NodeTypes, type Connection, type Node,
} from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { CanvasTopBar }       from './canvas-top-bar';
import { NodePalette }        from './node-palette';
import { NodeConfigPanel }    from './node-config-panel';
import { TriggerConfigModal } from './trigger-config-modal';
import { TriggerNode }        from './nodes/trigger-node';
import { ConditionNode }      from './nodes/condition-node';
import { WaitDelayNode }      from './nodes/wait-delay-node';
import { WaitTriggerNode }    from './nodes/wait-trigger-node';
import { SplitNode }          from './nodes/split-node';
import { ActionEmailNode }    from './nodes/action-email-node';
import { ActionPushNode }     from './nodes/action-push-node';
import { ActionInAppNode }    from './nodes/action-inapp-node';
import { useJourneyStore }    from '@/store/journey-store';
import { useCanvasUIStore }   from '@/store/canvas-ui-store';
import { useAutoLayout }      from '@/hooks/use-auto-layout';
import { genId }              from '@/lib/utils';
import type { JourneyNode, JourneyEdge, TriggerData, Journey } from '@/types/journey';

/* ── Stable nodeTypes map (must be outside component to avoid re-renders) ── */
const nodeTypes: NodeTypes = {
  trigger:         TriggerNode as never,
  condition:       ConditionNode as never,
  'wait-delay':    WaitDelayNode as never,
  'wait-trigger':  WaitTriggerNode as never,
  split:           SplitNode as never,
  'action-email':  ActionEmailNode as never,
  'action-push':   ActionPushNode as never,
  'action-inapp':  ActionInAppNode as never,
};

/* ── Default data for nodes dropped from the palette ── */
// Typed as Record<string,unknown> so React Flow's Node.data constraint is satisfied
const DEFAULT_NODE_DATA: Record<string, Record<string, unknown>> = {
  condition:      { nodeType: 'condition',    attribute: '', operator: 'equals', value: '' },
  'wait-delay':   { nodeType: 'wait-delay',   mode: 'delay', amount: 1, unit: 'hours', datetime: '' },
  'wait-trigger': { nodeType: 'wait-trigger', triggerId: '', triggerLabel: '', timeLimitEnabled: false, timeLimitAmount: 24, timeLimitUnit: 'hours' },
  split:          { nodeType: 'split',        branches: [{ label: 'Branch A', percent: 50 }, { label: 'Branch B', percent: 50 }] },
  'action-email': { nodeType: 'action-email', subject: '', body: '', sender: '' },
  'action-push':  { nodeType: 'action-push',  title: '', body: '' },
  'action-inapp': { nodeType: 'action-inapp', title: '', body: '', imageUrl: '' },
};

const nodeColor = (n: Node): string => ({
  trigger: '#7c3aed', condition: '#d97706', 'wait-delay': '#2563eb',
  'wait-trigger': '#0891b2', split: '#059669',
  'action-email': '#dc2626', 'action-push': '#ea580c', 'action-inapp': '#db2777',
})[n.type ?? ''] ?? '#94a3b8';

/* ── Route entry — provides ReactFlow context ── */
export function JourneyCanvasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const journey  = useJourneyStore(s => s.journeys.find(j => j.id === id));

  if (!journey) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 text-slate-500">
      <GitBranch size={32} className="text-slate-300" />
      <p className="font-medium">Journey not found</p>
      <button onClick={() => navigate('/journeys')} className="text-sm text-violet-600 hover:underline cursor-pointer">
        ← Back to list
      </button>
    </div>
  );

  return <ReactFlowProvider><CanvasInner journey={journey} /></ReactFlowProvider>;
}

/* ── Inner component — full React Flow context ── */
function CanvasInner({ journey }: { journey: Journey }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(journey.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(journey.edges);
  const [showTriggerModal, setShowTriggerModal] = useState(false);

  const { screenToFlowPosition } = useReactFlow();
  const { layout }               = useAutoLayout();
  const { saveCanvas }           = useJourneyStore();
  const selectedNodeId           = useCanvasUIStore(s => s.selectedNodeId);
  const setSelectedNodeId        = useCanvasUIStore(s => s.setSelectedNodeId);

  /* Show trigger modal on first load if trigger not yet configured */
  useEffect(() => {
    const t = nodes.find(n => n.type === 'trigger');
    if (t && !(t.data as unknown as TriggerData).configured) setShowTriggerModal(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Debounced auto-save */
  useEffect(() => {
    const timer = setTimeout(() =>
      saveCanvas(journey.id, nodes as JourneyNode[], edges as JourneyEdge[]), 1500);
    return () => clearTimeout(timer);
  }, [nodes, edges, journey.id, saveCanvas]);

  const onConnect   = useCallback((c: Connection) =>
    setEdges(eds => addEdge({ ...c, animated: true, type: 'smoothstep' }, eds)), [setEdges]);
  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);
  const onPaneClick = useCallback(() => setSelectedNodeId(null), [setSelectedNodeId]);
  const onNodeClick = useCallback((_: React.MouseEvent, n: Node) => setSelectedNodeId(n.id), [setSelectedNodeId]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type   = e.dataTransfer.getData('application/reactflow');
    const defData = DEFAULT_NODE_DATA[type];
    if (!type || !defData) return;
    const id       = genId('node');
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setNodes(nds => [...nds, { id, type, position, data: defData }]);
    setSelectedNodeId(id);
  }, [screenToFlowPosition, setNodes, setSelectedNodeId]);

  const onNodeDataChange = useCallback((nodeId: string, patch: Record<string, unknown>) =>
    setNodes(nds => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n)),
  [setNodes]);

  const handleLayout = useCallback(() => {
    setNodes(layout(nodes as JourneyNode[], edges as JourneyEdge[]));
  }, [nodes, edges, layout, setNodes]);

  const handleTriggerSave = (data: TriggerData) => {
    setNodes(nds => nds.map(n => n.type === 'trigger' ? { ...n, data: data as unknown as Record<string, unknown> } : n));
    setShowTriggerModal(false);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const triggerNode  = nodes.find(n => n.type === 'trigger');

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <CanvasTopBar
        journey={journey}
        nodes={nodes as JourneyNode[]}
        edges={edges as JourneyEdge[]}
        onAutoLayout={handleLayout}
      />

      <div className="flex flex-1 overflow-hidden">
        <NodePalette />

        <main className="flex-1 relative">
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={onNodeClick}
            onPaneClick={onPaneClick} onDragOver={onDragOver} onDrop={onDrop}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{ animated: true, type: 'smoothstep' }}
            fitView fitViewOptions={{ padding: 0.25 }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
            <Controls position="bottom-right" />
            <MiniMap nodeColor={nodeColor} style={{ background: '#f8fafc' }} position="bottom-left" zoomable pannable />
          </ReactFlow>
        </main>

        {selectedNode && (
          <NodeConfigPanel node={selectedNode as JourneyNode} onDataChange={onNodeDataChange} />
        )}
      </div>

      {showTriggerModal && triggerNode && (
        <TriggerConfigModal
          initialData={triggerNode.data as unknown as TriggerData}
          onSave={handleTriggerSave}
          onClose={() => setShowTriggerModal(false)}
        />
      )}
    </div>
  );
}

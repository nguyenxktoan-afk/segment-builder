/**
 * Dagre top-down auto-layout for the React Flow canvas.
 */
import Dagre from '@dagrejs/dagre';
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { JourneyNode, JourneyEdge } from '@/types/journey';

const NODE_W = 224;
const NODE_H = 80;

export function useAutoLayout() {
  const { fitView } = useReactFlow();

  const layout = useCallback(
    (nodes: JourneyNode[], edges: JourneyEdge[]): JourneyNode[] => {
      if (nodes.length === 0) return nodes;

      const g = new Dagre.graphlib.Graph();
      g.setDefaultEdgeLabel(() => ({}));
      g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 100 });

      nodes.forEach(n => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
      edges.forEach(e => g.setEdge(e.source, e.target));

      Dagre.layout(g);

      const laid = nodes.map(n => {
        const pos = g.node(n.id);
        return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
      });

      setTimeout(() => fitView({ padding: 0.25, duration: 350 }), 60);
      return laid;
    },
    [fitView]
  );

  return { layout };
}

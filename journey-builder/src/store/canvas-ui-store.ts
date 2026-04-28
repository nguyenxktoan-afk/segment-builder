/**
 * Lightweight UI-only store for canvas state (not persisted).
 * Tracks which node is selected so the config panel can open.
 */
import { create } from 'zustand';

interface CanvasUIStore {
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}

export const useCanvasUIStore = create<CanvasUIStore>((set) => ({
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}));

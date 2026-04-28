/**
 * Zustand store for Journey list + canvas state.
 * Persisted to localStorage so refreshes don't lose data.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Journey, JourneyStatus, JourneyNode, JourneyEdge, CreateJourneyDto } from '../types/journey';
import { SEED_JOURNEYS } from '../data/mock-data';
import { genId } from '../lib/utils';

interface JourneyStore {
  journeys: Journey[];
  /* ── CRUD ── */
  addJourney:    (dto: CreateJourneyDto) => Journey;
  updateJourney: (id: string, patch: Partial<Journey>) => void;
  deleteJourney: (id: string) => void;
  duplicateJourney: (id: string) => void;
  setStatus:     (id: string, status: JourneyStatus) => void;
  /* ── Canvas sync ── */
  saveCanvas: (id: string, nodes: JourneyNode[], edges: JourneyEdge[]) => void;
}

export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set, get) => ({
      journeys: SEED_JOURNEYS,

      addJourney: (dto) => {
        const journey: Journey = {
          id: genId('journey'),
          name:        dto.name,
          objective:   dto.objective,
          goal:        dto.goal,
          status:      'Draft',
          journeyTime: dto.journeyTime,
          trigger:     dto.trigger,
          createdAt:   new Date().toISOString(),
          /* Trigger node pre-placed, un-configured */
          nodes: [
            {
              id: 'n-trigger',
              type: 'trigger',
              position: { x: 260, y: 40 },
              deletable: false,
              data: {
                nodeType: 'trigger',
                triggerId:    dto.trigger.id,
                triggerLabel: dto.trigger.label,
                productName:  dto.trigger.productName,
                attrValues:   {},
                filter:       null,
                configured:   false,
              },
            },
          ],
          edges: [],
        };
        set(s => ({ journeys: [journey, ...s.journeys] }));
        return journey;
      },

      updateJourney: (id, patch) =>
        set(s => ({
          journeys: s.journeys.map(j => j.id === id ? { ...j, ...patch } : j),
        })),

      deleteJourney: (id) =>
        set(s => ({ journeys: s.journeys.filter(j => j.id !== id) })),

      duplicateJourney: (id) => {
        const src = get().journeys.find(j => j.id === id);
        if (!src) return;
        const copy: Journey = {
          ...src,
          id:        genId('journey'),
          name:      `${src.name} (Copy)`,
          status:    'Draft',
          createdAt: new Date().toISOString(),
          nodes: JSON.parse(JSON.stringify(src.nodes)),
          edges: JSON.parse(JSON.stringify(src.edges)),
        };
        set(s => ({ journeys: [copy, ...s.journeys] }));
      },

      setStatus: (id, status) =>
        set(s => ({
          journeys: s.journeys.map(j => j.id === id ? { ...j, status } : j),
        })),

      saveCanvas: (id, nodes, edges) =>
        set(s => ({
          journeys: s.journeys.map(j => j.id === id ? { ...j, nodes, edges } : j),
        })),
    }),
    { name: 'journey-builder-store' }
  )
);

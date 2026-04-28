/**
 * Top bar for the Journey Builder canvas — breadcrumb, status, save, publish, layout.
 */
import { ChevronRight, Save, Zap, LayoutDashboard, PauseCircle, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useJourneyStore } from '@/store/journey-store';
import type { Journey, JourneyNode, JourneyEdge } from '@/types/journey';

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-600 border border-emerald-200',
  Draft:  'bg-slate-100 text-slate-500 border border-slate-200',
  Paused: 'bg-amber-500/15 text-amber-600 border border-amber-200',
};
const STATUS_DOT: Record<string, string> = {
  Active: 'bg-emerald-500', Draft: 'bg-slate-400', Paused: 'bg-amber-500',
};

interface Props {
  journey: Journey;
  nodes: JourneyNode[];
  edges: JourneyEdge[];
  onAutoLayout: () => void;
}

export function CanvasTopBar({ journey, nodes, edges, onAutoLayout }: Props) {
  const navigate = useNavigate();
  const { saveCanvas, setStatus } = useJourneyStore();

  const handleSaveDraft = () => {
    saveCanvas(journey.id, nodes, edges);
    toast.success('Draft saved.');
  };

  const handleTurnOn = () => {
    saveCanvas(journey.id, nodes, edges);
    setStatus(journey.id, 'Active');
    toast.success('Your flow is live! Users will begin entering as soon as trigger criteria are met.', { duration: 6000 });
  };

  const handlePause = () => {
    setStatus(journey.id, 'Paused');
    toast('Journey paused.');
  };

  const handleResume = () => {
    setStatus(journey.id, 'Active');
    toast.success('Journey resumed.');
  };

  return (
    <header className="h-13 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0 z-10 shadow-sm">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm min-w-0">
        <button
          onClick={() => navigate('/journeys')}
          className="text-slate-400 hover:text-violet-600 transition-colors cursor-pointer font-medium shrink-0"
        >
          Journeys
        </button>
        <ChevronRight size={14} className="text-slate-300 shrink-0" />
        <span className="text-slate-800 font-semibold truncate max-w-[200px]">{journey.name}</span>
      </div>

      {/* Status pill */}
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_STYLES[journey.status]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[journey.status]}`} />
        {journey.status}
      </span>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={onAutoLayout}
          title="Auto-arrange nodes"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <LayoutDashboard size={13} /> Layout
        </button>

        <button
          onClick={handleSaveDraft}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
        >
          <Save size={13} /> Save Draft
        </button>

        {journey.status === 'Active' ? (
          <button onClick={handlePause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 border border-amber-200 bg-amber-50 hover:bg-amber-100 cursor-pointer transition-colors">
            <PauseCircle size={13} /> Pause
          </button>
        ) : journey.status === 'Paused' ? (
          <button onClick={handleResume}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors">
            <PlayCircle size={13} /> Resume
          </button>
        ) : (
          <button onClick={handleTurnOn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-200 cursor-pointer transition-colors">
            <Zap size={13} fill="currentColor" /> Turn On
          </button>
        )}
      </div>
    </header>
  );
}

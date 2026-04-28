/**
 * /journeys — main listing page with search, filters, card grid, and create modal.
 */
import { useState, useMemo } from 'react';
import { Plus, Search, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/input';
import { JourneyTable } from './journey-table';
import { CreateJourneyModal } from './create-journey-modal';
import { useJourneyStore } from '@/store/journey-store';
import { useEmbedded } from '@/contexts/embedded-context';
import type { JourneyObjective, JourneyStatus, CreateJourneyDto } from '@/types/journey';

const ALL_OBJECTIVES: JourneyObjective[] = [
  'Engagement', 'Monetization', 'Competitive', 'Social/UGC', 'Partner/Cross Promotion',
];
const ALL_STATUSES: JourneyStatus[] = ['Active', 'Draft', 'Paused'];

export function JourneyListPage() {
  const navigate   = useNavigate();
  const embedded   = useEmbedded();
  const { journeys, addJourney } = useJourneyStore();

  const [search,    setSearch]    = useState('');
  const [objective, setObjective] = useState<JourneyObjective | 'all'>('all');
  const [status,    setStatus]    = useState<JourneyStatus | 'all'>('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => journeys.filter(j => {
    const matchName = !search || j.name.toLowerCase().includes(search.toLowerCase());
    const matchObj  = objective === 'all' || j.objective === objective;
    const matchStat = status    === 'all' || j.status    === status;
    return matchName && matchObj && matchStat;
  }), [journeys, search, objective, status]);

  const handleCreate = (dto: CreateJourneyDto) => {
    const journey = addJourney(dto);
    setShowModal(false);
    navigate(`/journeys/${journey.id}/builder`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Standalone top nav */}
      {!embedded && (
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 shrink-0">
          <GitBranch size={20} className="text-violet-600" />
          <span className="font-semibold text-slate-900">Journey Builder</span>
          <span className="ml-auto text-xs text-slate-400">LiveOps Platform</span>
        </header>
      )}

      {/* Page header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Journeys</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {journeys.length} journey{journeys.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} size="md">
            <Plus size={15} /> New Journey
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search journeys…"
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
            />
          </div>
          <SelectField value={objective} onChange={e => setObjective(e.target.value as JourneyObjective | 'all')} className="w-48">
            <option value="all">All Objectives</option>
            {ALL_OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
          </SelectField>
          <SelectField value={status} onChange={e => setStatus(e.target.value as JourneyStatus | 'all')} className="w-36">
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </SelectField>
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <JourneyTable journeys={filtered} />
        </div>
      </div>

      {showModal && <CreateJourneyModal onSubmit={handleCreate} onClose={() => setShowModal(false)} />}
    </div>
  );
}

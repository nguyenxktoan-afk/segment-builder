/**
 * /journeys — listing page. Layout matches Segment Builder listing style.
 */
import { useState, useMemo } from 'react';
import { Plus, Search, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JourneyTable } from './journey-table';
import { CreateJourneyModal } from './create-journey-modal';
import { useJourneyStore } from '@/store/journey-store';
import { useEmbedded } from '@/contexts/embedded-context';
import type { JourneyObjective, JourneyStatus, CreateJourneyDto } from '@/types/journey';

const ALL_OBJECTIVES: JourneyObjective[] = [
  'Engagement', 'Monetization', 'Competitive', 'Social/UGC', 'Partner/Cross Promotion',
];
const ALL_STATUSES: JourneyStatus[] = ['Active', 'Draft', 'Paused'];

const SELECT_CLS =
  'h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 cursor-pointer';

export function JourneyListPage() {
  const navigate = useNavigate();
  const embedded = useEmbedded();
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
    <div className="flex-1 overflow-y-auto">
      {/* Standalone top nav — only when not embedded in Segment Builder */}
      {!embedded && (
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3 shrink-0">
          <GitBranch size={20} className="text-violet-600" />
          <span className="font-semibold text-slate-900">Journey Builder</span>
          <span className="ml-auto text-xs text-slate-400">LiveOps Platform</span>
        </header>
      )}

      <div className="px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Saved Journeys</h1>
            <p className="text-sm text-slate-500 mt-1">
              {journeys.length} journey{journeys.length !== 1 ? 's' : ''} created
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            New Journey
          </button>
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search journeys..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
            />
          </div>
          <select
            value={objective}
            onChange={e => setObjective(e.target.value as JourneyObjective | 'all')}
            className={SELECT_CLS}
          >
            <option value="all">All Objectives</option>
            {ALL_OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as JourneyStatus | 'all')}
            className={SELECT_CLS}
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 && journeys.length > 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No journeys match your search.
          </div>
        ) : (
          <JourneyTable journeys={filtered} onNew={() => setShowModal(true)} />
        )}
      </div>

      {showModal && (
        <CreateJourneyModal onSubmit={handleCreate} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

/**
 * Journey card grid — 3-col responsive layout replacing the old flat table.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Copy, Pause, Play, Trash2, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useJourneyStore } from '@/store/journey-store';
import { fmtDate } from '@/lib/utils';
import type { Journey } from '@/types/journey';

interface Props { journeys: Journey[] }

const STATUS_STRIPE: Record<string, string> = {
  Active: 'bg-emerald-500',
  Draft:  'bg-slate-300',
  Paused: 'bg-amber-400',
};

const OBJ_COLOR: Record<string, string> = {
  Engagement:              'bg-violet-50  text-violet-700',
  Monetization:            'bg-emerald-50 text-emerald-700',
  Competitive:             'bg-blue-50    text-blue-700',
  'Social/UGC':            'bg-pink-50    text-pink-700',
  'Partner/Cross Promotion':'bg-orange-50 text-orange-700',
};

export function JourneyTable({ journeys }: Props) {
  const navigate = useNavigate();
  const { deleteJourney, duplicateJourney, setStatus } = useJourneyStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteJourney(deleteId);
    toast.success('Journey deleted.');
    setDeleteId(null);
  };

  const handleTogglePause = (j: Journey) => {
    if (j.status === 'Active') {
      setStatus(j.id, 'Paused');
      toast.success(`"${j.name}" paused.`);
    } else if (j.status === 'Paused') {
      setStatus(j.id, 'Active');
      toast.success(`"${j.name}" resumed.`);
    }
  };

  if (journeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
        <GitBranch size={36} className="text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">No journeys found</p>
        <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {journeys.map(j => (
          <div
            key={j.id}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col"
          >
            {/* Status stripe */}
            <div className={`h-1 shrink-0 ${STATUS_STRIPE[j.status] ?? 'bg-slate-200'}`} />

            <div className="flex flex-col flex-1 p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 leading-snug line-clamp-2">{j.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{j.trigger.productName}</p>
                </div>
                <StatusBadge status={j.status} className="shrink-0 mt-0.5" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${OBJ_COLOR[j.objective] ?? 'bg-slate-100 text-slate-600'}`}>
                  {j.objective}
                </span>
                <span className="text-slate-300 text-xs">›</span>
                <span className="text-xs text-slate-500">{j.goal}</span>
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">{fmtDate(j.createdAt)}</span>

                {/* Actions — visible on hover */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(j.status === 'Active' || j.status === 'Paused') && (
                    <button onClick={() => handleTogglePause(j)}
                      title={j.status === 'Active' ? 'Pause' : 'Resume'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors">
                      {j.status === 'Active' ? <Pause size={13} /> : <Play size={13} />}
                    </button>
                  )}
                  <button onClick={() => { duplicateJourney(j.id); toast.success('Journey duplicated.'); }}
                    title="Duplicate"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors">
                    <Copy size={13} />
                  </button>
                  <button onClick={() => setDeleteId(j.id)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
                    <Trash2 size={13} />
                  </button>
                  <button onClick={() => navigate(`/journeys/${j.id}/builder`)}
                    title="Open builder"
                    className="ml-1 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-medium hover:bg-violet-700 cursor-pointer transition-colors">
                    Open <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Journey"
        message="This journey will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}

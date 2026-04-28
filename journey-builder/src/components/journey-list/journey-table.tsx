/**
 * Journey table — flat row layout matching Segment Builder listing style.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Pause, Play, Trash2, Pencil, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useJourneyStore } from '@/store/journey-store';
import { fmtDate } from '@/lib/utils';
import type { Journey } from '@/types/journey';

interface Props {
  journeys: Journey[];
  onNew: () => void;
}

const OBJ_COLOR: Record<string, string> = {
  Engagement:                'bg-violet-100  text-violet-700',
  Monetization:              'bg-emerald-100 text-emerald-700',
  Competitive:               'bg-blue-100    text-blue-700',
  'Social/UGC':              'bg-pink-100    text-pink-700',
  'Partner/Cross Promotion': 'bg-orange-100  text-orange-700',
};

export function JourneyTable({ journeys, onNew }: Props) {
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

  /* ── Empty states ── */
  if (journeys.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
        <GitBranch size={32} className="text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500 mb-1">No journeys found</p>
        <p className="text-xs text-slate-400 mb-4">Create your first journey to get started</p>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
        >
          New Journey
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_90px_160px_130px_110px_80px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          <span>Journey</span>
          <span>Status</span>
          <span>Objective</span>
          <span>Goal</span>
          <span>Created</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {journeys.map((j) => (
          <div
            key={j.id}
            className="grid grid-cols-[1fr_90px_160px_130px_110px_80px] gap-4 px-5 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
          >
            {/* Name + trigger */}
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 truncate">{j.name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{j.trigger.productName}</p>
            </div>

            {/* Status badge */}
            <div className="flex items-center">
              <StatusBadge status={j.status} />
            </div>

            {/* Objective pill */}
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${OBJ_COLOR[j.objective] ?? 'bg-slate-100 text-slate-600'}`}>
                {j.objective}
              </span>
            </div>

            {/* Goal */}
            <div className="flex items-center">
              <span className="text-sm text-slate-600">{j.goal}</span>
            </div>

            {/* Created date */}
            <div className="flex items-center">
              <span className="text-sm text-slate-500">{fmtDate(j.createdAt)}</span>
            </div>

            {/* Row actions — visible on hover */}
            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => navigate(`/journeys/${j.id}/builder`)}
                title="Edit"
                className="p-1.5 rounded text-slate-400 hover:text-violet-600 hover:bg-violet-50 cursor-pointer"
              >
                <Pencil size={14} />
              </button>
              {(j.status === 'Active' || j.status === 'Paused') && (
                <button
                  onClick={() => handleTogglePause(j)}
                  title={j.status === 'Active' ? 'Pause' : 'Resume'}
                  className="p-1.5 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                >
                  {j.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                </button>
              )}
              <button
                onClick={() => { duplicateJourney(j.id); toast.success('Journey duplicated.'); }}
                title="Duplicate"
                className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={() => setDeleteId(j.id)}
                title="Delete"
                className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
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

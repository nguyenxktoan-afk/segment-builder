import { useState } from 'react';
import { BarChart3, Grid3X3, GitBranch, PieChart, Clock, LayoutGrid, ArrowRight } from 'lucide-react';
import {
  EVENTS_DAU_DATA, EVENTS_METRICS,
  RETENTION_COHORTS,
  FUNNEL_STEPS,
  DISTRIBUTION_BUCKETS,
  INTERVAL_METRICS,
  RFM_GRID,
} from '../../data/analysis-mock-data';

interface ModelCardProps {
  onUseAsSegment: (label: string) => void;
}

/* ── Shared card shell ── */
export function CardShell({ title, icon, children, expanded, onToggle }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; expanded: boolean; onToggle: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer">
        <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">{icon}</div>
        <span className="text-sm font-bold text-slate-900 flex-1">{title}</span>
        <span className={`text-xs text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`}>▸</span>
      </button>
      {expanded && <div className="px-5 pb-5 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}

/* ── 1. Events Card ── */
function EventsCard({ onUseAsSegment }: ModelCardProps) {
  const [groupBy, setGroupBy] = useState<'all' | 'platform'>('all');
  const maxVal = Math.max(...EVENTS_DAU_DATA.map((d) => d.ios + d.android));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-slate-900">{EVENTS_METRICS.totalEvents.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">Total Events</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-slate-900">{EVENTS_METRICS.uniqueUsers.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500">Unique Users</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-slate-900">{(EVENTS_METRICS.sumRevenue / 1e6).toFixed(1)}M</div>
          <div className="text-[11px] text-slate-500">Sum Revenue</div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">DAU (7 days)</span>
        <div className="flex gap-1">
          {(['all', 'platform'] as const).map((v) => (
            <button key={v} onClick={() => setGroupBy(v)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded cursor-pointer ${groupBy === v ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
              {v === 'all' ? 'All' : 'iOS vs Android'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-28">
        {EVENTS_DAU_DATA.map((d) => {
          const total = d.ios + d.android;
          const hPct = (total / maxVal) * 100;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: `${hPct}%` }}>
                {groupBy === 'platform' ? (
                  <>
                    <div className="bg-blue-400 rounded-t" style={{ height: `${(d.ios / total) * 100}%`, minHeight: 2 }} />
                    <div className="bg-emerald-400 rounded-b" style={{ height: `${(d.android / total) * 100}%`, minHeight: 2 }} />
                  </>
                ) : (
                  <div className="bg-violet-400 rounded w-full h-full" />
                )}
              </div>
              <span className="text-[9px] text-slate-400">{d.day}</span>
            </div>
          );
        })}
      </div>
      {groupBy === 'platform' && (
        <div className="flex gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400" /> iOS</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400" /> Android</span>
        </div>
      )}
      <button onClick={() => onUseAsSegment('Active users')}
        className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium cursor-pointer mt-1">
        Use as segment input <ArrowRight size={12} />
      </button>
    </div>
  );
}

/* ── 2. Retention Card ── */
function RetentionCard({ onUseAsSegment }: ModelCardProps) {
  const rColor = (v: number) => v >= 30 ? 'bg-emerald-100 text-emerald-800' : v >= 15 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600';
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="text-slate-500 border-b border-slate-100">
            <th className="text-left py-1.5 pr-3 font-medium">Cohort</th>
            <th className="text-right px-2 font-medium">Users</th>
            {['D1', 'D3', 'D7', 'D14', 'D30'].map((d) => <th key={d} className="text-center px-2 font-medium">{d}</th>)}
          </tr></thead>
          <tbody>
            {RETENTION_COHORTS.map((row) => (
              <tr key={row.cohort} className="border-b border-slate-50">
                <td className="py-2 pr-3 font-medium text-slate-700">{row.cohort}</td>
                <td className="text-right px-2 text-slate-500">{row.users.toLocaleString()}</td>
                {[row.d1, row.d3, row.d7, row.d14, row.d30].map((v, i) => (
                  <td key={i} className="text-center px-1.5 py-1.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${rColor(v)}`}>{v}%</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => onUseAsSegment('Retained D7+')}
        className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium cursor-pointer">
        Use as segment input <ArrowRight size={12} />
      </button>
    </div>
  );
}

/* ── 3. Funnel Card ── */
function FunnelCard({ onUseAsSegment }: ModelCardProps) {
  const maxDropIdx = FUNNEL_STEPS.reduce((worst, step, i) => {
    if (i === 0) return worst;
    const drop = FUNNEL_STEPS[i - 1].pct - step.pct;
    return drop > (FUNNEL_STEPS[worst - 1]?.pct ?? 0) - (FUNNEL_STEPS[worst]?.pct ?? 0) ? i : worst;
  }, 1);
  return (
    <div className="space-y-2">
      {FUNNEL_STEPS.map((step, i) => {
        const isBiggestDrop = i === maxDropIdx;
        return (
          <div key={step.name} className="flex items-center gap-3">
            <span className="text-xs text-slate-600 w-28 shrink-0 font-medium">{step.name}</span>
            <div className="flex-1 h-7 bg-slate-100 rounded-full overflow-hidden relative">
              <div className={`h-full rounded-full ${isBiggestDrop ? 'bg-red-400' : 'bg-violet-400'}`} style={{ width: `${step.pct}%` }} />
            </div>
            <div className="w-20 text-right shrink-0">
              <span className={`text-xs font-bold ${isBiggestDrop ? 'text-red-600' : 'text-slate-700'}`}>{step.count.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 ml-1">{step.pct}%</span>
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-red-500 font-medium">⚠ Biggest drop: {FUNNEL_STEPS[maxDropIdx - 1].name} → {FUNNEL_STEPS[maxDropIdx].name}</p>
      <button onClick={() => onUseAsSegment('Funnel drop-off')}
        className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium cursor-pointer">
        Use as segment input <ArrowRight size={12} />
      </button>
    </div>
  );
}

/* ── 4. Distribution Card ── */
function DistributionCard({ onUseAsSegment }: ModelCardProps) {
  return (
    <div className="space-y-2">
      {DISTRIBUTION_BUCKETS.map((b) => (
        <button key={b.label} onClick={() => onUseAsSegment(b.label)}
          className="w-full flex items-center gap-3 hover:bg-slate-50 rounded-lg p-1.5 -mx-1.5 cursor-pointer transition-colors text-left">
          <span className="text-xs text-slate-700 w-24 font-medium shrink-0">{b.label}</span>
          <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%`, minWidth: 4 }} />
          </div>
          <span className="text-xs text-slate-700 font-semibold w-16 text-right">{b.count.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 w-10 text-right">{b.pct}%</span>
        </button>
      ))}
      <p className="text-[10px] text-slate-400 mt-1">Click a bucket to use as segment input</p>
    </div>
  );
}

/* ── 5. Interval Card ── */
function IntervalCard({ onUseAsSegment }: ModelCardProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{INTERVAL_METRICS.eventPair}</p>
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'P25', value: INTERVAL_METRICS.p25 }, { label: 'Median (P50)', value: INTERVAL_METRICS.p50 }, { label: 'P75', value: INTERVAL_METRICS.p75 }].map((m) => (
          <div key={m.label} className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-slate-900">{m.value}</div>
            <div className="text-[11px] text-slate-500">{m.label}</div>
          </div>
        ))}
      </div>
      <button onClick={() => onUseAsSegment('Slow converters')}
        className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium cursor-pointer">
        Use as segment input <ArrowRight size={12} />
      </button>
    </div>
  );
}

/* ── 6. RFM Card ── */
function RfmCard({ onUseAsSegment }: ModelCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <span>← Low Frequency</span><span className="flex-1" /><span>High Frequency →</span>
      </div>
      <div className="space-y-0.5">
        {RFM_GRID.map((row, ri) => (
          <div key={ri} className="flex gap-0.5">
            <span className="text-[9px] text-slate-400 w-6 shrink-0 flex items-center justify-center">R{5 - ri}</span>
            {row.map((cell, ci) => (
              <button key={ci} onClick={() => onUseAsSegment(cell.label)}
                className={`flex-1 py-2 rounded text-[9px] font-semibold text-center cursor-pointer hover:ring-2 hover:ring-violet-400 transition-all ${cell.color}`}>
                {cell.label}
              </button>
            ))}
          </div>
        ))}
        <div className="flex gap-0.5 mt-0.5">
          <span className="w-6" />
          {['F1', 'F2', 'F3', 'F4', 'F5'].map((f) => (
            <span key={f} className="flex-1 text-center text-[9px] text-slate-400">{f}</span>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-slate-400">Click any cell to use its users as segment input</p>
    </div>
  );
}

/* ── Export all card configs ── */
export const ANALYSIS_CARDS = [
  { id: 'events', title: 'Events', icon: <BarChart3 size={18} className="text-violet-600" />, Component: EventsCard },
  { id: 'retention', title: 'Retention', icon: <Grid3X3 size={18} className="text-violet-600" />, Component: RetentionCard },
  { id: 'funnel', title: 'Funnel', icon: <GitBranch size={18} className="text-violet-600" />, Component: FunnelCard },
  { id: 'distribution', title: 'Distribution', icon: <PieChart size={18} className="text-violet-600" />, Component: DistributionCard },
  { id: 'interval', title: 'Interval', icon: <Clock size={18} className="text-violet-600" />, Component: IntervalCard },
  { id: 'rfm', title: 'RFM Segmentation', icon: <LayoutGrid size={18} className="text-violet-600" />, Component: RfmCard },
] as const;

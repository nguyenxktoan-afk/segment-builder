import { useState } from 'react';
import { CardShell, ANALYSIS_CARDS } from './analysis-model-cards';

interface AnalysisTabProps {
  /** Called when user clicks "Use as segment input" on any analysis card */
  onUseAsSegmentInput: (label: string) => void;
}

/** Analysis tab — 6 collapsible model cards for pre-segment user exploration */
export function AnalysisTab({ onUseAsSegmentInput }: AnalysisTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>('events');
  const [toast, setToast] = useState<string | null>(null);

  function handleUseAsSegment(label: string) {
    onUseAsSegmentInput(label);
    setToast(label);
    // Auto-dismiss toast after 3s
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Analysis</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore user behavior models to understand which group a user belongs to before building a segment.
          Click any card to expand, then use the results as segment inputs.
        </p>
      </div>

      {/* 6 model cards — 2-column grid on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {ANALYSIS_CARDS.map(({ id, title, icon, Component }) => {
          const isExpanded = expandedId === id;
          return (
            <CardShell
              key={id}
              title={title}
              icon={icon}
              expanded={isExpanded}
              onToggle={() => setExpandedId(isExpanded ? null : id)}
            >
              <Component onUseAsSegment={handleUseAsSegment} />
            </CardShell>
          );
        })}
      </div>

      {/* Success toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="text-emerald-400">✓</span>
          <span>
            <strong>{toast}</strong> applied — switching to Segment Builder
          </span>
        </div>
      )}
    </div>
  );
}

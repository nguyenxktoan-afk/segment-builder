import {
  DELIVERY_FUNNEL, CAMPAIGN_SUMMARY, REAL_IMPACT_KPIS, AB_VARIANT_ROWS,
} from '../../data/campaign-stats-mock-data';

/* ────────────────────────────────────────────────
   Section 1 — Delivery Funnel
   Horizontal bars, gray→blue→green, red if below threshold
──────────────────────────────────────────────── */
export function DeliveryFunnelSection() {
  const maxCount = DELIVERY_FUNNEL[0].count;

  return (
    <div className="space-y-4">
      <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
        {DELIVERY_FUNNEL.map((step, i) => {
          const ratePct = i === 0 ? 100 : Math.round((step.count / DELIVERY_FUNNEL[i - 1].count) * 100);
          const isBad = step.threshold !== null && ratePct < step.threshold;
          const barWidthPct = Math.round((step.count / maxCount) * 100);

          // Color ramp: gray → blue (sent/delivered) → green (clicked/converted)
          const barColor = isBad
            ? 'bg-red-400'
            : i === 0 ? 'bg-slate-300'
            : i <= 2   ? 'bg-blue-400'
            :             'bg-emerald-400';

          return (
            <div key={step.step} className="flex items-center gap-1 flex-1 min-w-[120px]">
              {/* Arrow connector */}
              {i > 0 && <span className="text-slate-300 text-base shrink-0">›</span>}

              <div className="flex-1 space-y-1">
                {/* Step label + rate badge */}
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-[11px] font-semibold text-slate-700 truncate">{step.step}</span>
                  {i > 0 && (
                    <span className={`text-[10px] font-bold shrink-0 ${isBad ? 'text-red-500' : 'text-slate-400'}`}>
                      {ratePct}%{isBad ? ' ⚠' : ''}
                    </span>
                  )}
                </div>
                {/* Proportional bar */}
                <div className="h-7 bg-slate-100 rounded overflow-hidden">
                  <div className={`h-full rounded ${barColor} transition-all`} style={{ width: `${barWidthPct}%` }} />
                </div>
                {/* Absolute count */}
                <div className="text-[11px] text-slate-500 font-medium">{step.count.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-400">
        ⚠ Red bar = rate below alert threshold (Delivery &lt;70%, CTR &lt;3%)
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Section 2 — Conversion Breakdown
   Left: metric cards | Right: window + split bar
──────────────────────────────────────────────── */
export function ConversionBreakdownSection() {
  const { totalConverted, directConversion, influencedConversion, conversionRate, conversionWindowDays } = CAMPAIGN_SUMMARY;
  const directPct   = Math.round((directConversion / totalConverted) * 100);
  const influencedPct = 100 - directPct;

  const metricCards = [
    { label: 'Total Converted',       value: totalConverted.toLocaleString(),                 highlight: true  },
    { label: 'Direct Conversion',     value: `${directConversion.toLocaleString()} (${directPct}%)`,       highlight: false },
    { label: 'Influenced Conversion', value: `${influencedConversion.toLocaleString()} (${influencedPct}%)`, highlight: false },
    { label: 'Conversion Rate',       value: `${conversionRate}%`,                            highlight: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left — metric cards */}
      <div className="space-y-2">
        {metricCards.map((m) => (
          <div
            key={m.label}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${
              m.highlight ? 'bg-violet-50 border border-violet-200' : 'bg-slate-50'
            }`}
          >
            <span className={`text-xs ${m.highlight ? 'text-violet-700 font-semibold' : 'text-slate-600'}`}>{m.label}</span>
            <span className={`text-sm font-bold ${m.highlight ? 'text-violet-900' : 'text-slate-800'}`}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* Right — conversion window + direct/influenced bar */}
      <div className="space-y-3">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-[11px] text-slate-500 mb-0.5">Conversion window</div>
          <div className="text-2xl font-bold text-slate-900">{conversionWindowDays} days</div>
        </div>

        {/* Split bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Direct ({directPct}%)</span>
            <span>Influenced ({influencedPct}%)</span>
          </div>
          <div className="h-5 flex rounded-full overflow-hidden">
            <div className="bg-violet-500 h-full" style={{ width: `${directPct}%` }} />
            <div className="bg-violet-200 h-full" style={{ width: `${influencedPct}%` }} />
          </div>
          <div className="flex gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-violet-500 inline-block" /> Direct</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-violet-200 inline-block" /> Influenced</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed">
          <strong className="text-slate-500">Influenced</strong> = user received notification but did not click,
          then converted within the window.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Section 3 — Real Impact (target vs control)
   Dual horizontal bars + lift badge per KPI
──────────────────────────────────────────────── */
export function RealImpactSection() {
  return (
    <div className="space-y-5">
      {REAL_IMPACT_KPIS.map((kpi) => {
        const lift = +(kpi.target - kpi.control).toFixed(1);
        const isPositiveLift = kpi.lowerIsBetter ? lift < 0 : lift > 0;
        const maxVal = Math.max(kpi.target, kpi.control) * 1.25; // add headroom

        return (
          <div key={kpi.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">{kpi.name}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isPositiveLift ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
              }`}>
                {lift >= 0 ? '+' : ''}{lift}pp
              </span>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Target group', value: kpi.target, color: 'bg-blue-500' },
                { label: 'Control group', value: kpi.control, color: 'bg-slate-300' },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 w-24 shrink-0">{bar.label}</span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bar.color} transition-all`}
                      style={{ width: `${(bar.value / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-14 text-right shrink-0">
                    {bar.value}{kpi.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
        <strong className="text-slate-500">Lift</strong> = difference between target and control group,
        isolating campaign effect from organic behavior.
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Section 4 — A/B Variant Table
   Winner cells green, non-winner light gray
──────────────────────────────────────────────── */
export function AbVariantTableSection() {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="text-left py-2 pr-4 font-semibold">Metric</th>
              <th className="text-right px-3 py-2 font-semibold">Variant A</th>
              <th className="text-right px-3 py-2 font-semibold">Variant B</th>
              <th className="text-center px-3 py-2 font-semibold">Winner</th>
            </tr>
          </thead>
          <tbody>
            {AB_VARIANT_ROWS.map((row) => (
              <tr
                key={row.metric}
                className={`border-b border-slate-50 ${row.isTotal ? 'bg-slate-50' : ''}`}
              >
                <td className={`py-2 pr-4 text-slate-700 ${row.isTotal ? 'font-semibold text-slate-500 italic' : 'font-medium'}`}>
                  {row.metric}
                </td>
                <td className={`text-right px-3 py-2 rounded-l ${
                  row.winner === 'A' ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : row.winner === 'B' ? 'text-slate-400'
                  : 'text-slate-600'
                }`}>
                  {row.a}
                </td>
                <td className={`text-right px-3 py-2 ${
                  row.winner === 'B' ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : row.winner === 'A' ? 'text-slate-400'
                  : 'text-slate-600'
                }`}>
                  {row.b}
                </td>
                <td className="text-center px-3 py-2">
                  {row.winner ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                      🏆 {row.winner}
                    </span>
                  ) : row.isTotal ? (
                    <span className="text-[10px] text-slate-400">dedup</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-400">
        "All Variants total" deduplicates users who appeared in multiple variants to avoid double-counting conversions.
      </p>
    </div>
  );
}

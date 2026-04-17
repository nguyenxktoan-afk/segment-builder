import { useState } from 'react';
import { ChevronRight, Users, Send, Truck, MousePointer, ShoppingCart, TrendingUp } from 'lucide-react';
import { DELIVERY_FUNNEL, CAMPAIGN_SUMMARY } from '../../data/campaign-stats-mock-data';
import {
  DeliveryFunnelSection,
  ConversionBreakdownSection,
  RealImpactSection,
  AbVariantTableSection,
} from './campaign-stats-sections';

/* ── Reusable collapsible section shell ── */
function CollapsibleSection({ title, defaultOpen = true, children }: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-bold text-slate-900 flex-1">{title}</span>
        <ChevronRight size={16} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Top summary metric strip ── */
function SummaryStrip() {
  const { conversionRate } = CAMPAIGN_SUMMARY;
  const steps = DELIVERY_FUNNEL;

  const summaryItems = [
    { icon: <Users      size={15} />, label: 'Qualified',  value: steps[0].count.toLocaleString(), color: 'text-slate-500'   },
    { icon: <Send       size={15} />, label: 'Sent',       value: steps[1].count.toLocaleString(), color: 'text-blue-500'    },
    { icon: <Truck      size={15} />, label: 'Delivered',  value: steps[2].count.toLocaleString(), color: 'text-blue-600'    },
    { icon: <MousePointer size={15} />, label: 'Clicked',  value: steps[3].count.toLocaleString(), color: 'text-emerald-600' },
    { icon: <ShoppingCart size={15} />, label: 'Converted',value: steps[4].count.toLocaleString(), color: 'text-emerald-700' },
    { icon: <TrendingUp size={15} />, label: 'Conv. Rate', value: `${conversionRate}%`,            color: 'text-violet-600'  },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {summaryItems.map((item) => (
        <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <div className={`flex justify-center mb-1 ${item.color}`}>{item.icon}</div>
          <div className="text-base font-bold text-slate-900 leading-tight">{item.value}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main export ── */
export function CampaignStatsTab() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Campaign Stats</h1>
        <p className="text-sm text-slate-500 mt-1">
          Post-campaign performance — delivery funnel, conversions, real impact, and A/B results.
        </p>
      </div>

      {/* Summary strip */}
      <SummaryStrip />

      {/* Collapsible sections */}
      <div className="space-y-3">
        <CollapsibleSection title="Delivery Funnel">
          <DeliveryFunnelSection />
        </CollapsibleSection>

        <CollapsibleSection title="Conversion Breakdown">
          <ConversionBreakdownSection />
        </CollapsibleSection>

        <CollapsibleSection title="Real Impact — Target vs Control" defaultOpen={false}>
          <RealImpactSection />
        </CollapsibleSection>

        <CollapsibleSection title="A/B Variant Performance" defaultOpen={false}>
          <AbVariantTableSection />
        </CollapsibleSection>
      </div>
    </div>
  );
}

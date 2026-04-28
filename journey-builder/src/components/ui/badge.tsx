import { cn } from '@/lib/utils';
import type { JourneyStatus } from '@/types/journey';

interface BadgeProps {
  status: JourneyStatus;
  className?: string;
}

const STATUS_STYLES: Record<JourneyStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Draft:  'bg-slate-100  text-slate-600  border border-slate-200',
  Paused: 'bg-amber-50   text-amber-700  border border-amber-200',
};

const STATUS_DOT: Record<JourneyStatus, string> = {
  Active: 'bg-emerald-500',
  Draft:  'bg-slate-400',
  Paused: 'bg-amber-500',
};

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
      STATUS_STYLES[status],
      className,
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOT[status])} />
      {status}
    </span>
  );
}

/** Generic pill badge */
export function Pill({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600',
      className,
    )}>
      {label}
    </span>
  );
}

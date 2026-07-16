import React from 'react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subLabel?: string;
  icon: React.ReactNode;
  iconBgClass?: string;
  borderClass?: string;
}

export default function StatCard({
  label,
  value,
  subLabel,
  icon,
  iconBgClass = 'bg-slate-50',
  borderClass = 'border-slate-100',
}: StatCardProps) {
  return (
    <div className={`bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border ${borderClass} shadow-sm flex items-center justify-between gap-3 min-w-0`}>
      <div className="space-y-1 min-w-0">
        <span className="text-[10px] font-mono uppercase font-black block tracking-wider text-slate-400">
          {label}
        </span>
        <span className="text-xl sm:text-2xl font-black text-slate-950 font-sans block break-words">{value}</span>
        {subLabel && (
          <span className="text-[10px] text-slate-400 block font-serif">{subLabel}</span>
        )}
      </div>
      <div className={`h-10 w-10 sm:h-12 sm:w-12 ${iconBgClass} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}

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
    <div className={`bg-white p-5 rounded-3xl border ${borderClass} shadow-sm flex items-center justify-between`}>
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase font-black block tracking-wider text-slate-400">
          {label}
        </span>
        <span className="text-2xl font-black text-slate-950 font-sans block">{value}</span>
        {subLabel && (
          <span className="text-[10px] text-slate-400 block font-serif">{subLabel}</span>
        )}
      </div>
      <div className={`h-12 w-12 ${iconBgClass} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}

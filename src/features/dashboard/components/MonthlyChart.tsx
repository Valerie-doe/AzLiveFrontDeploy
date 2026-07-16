import React from 'react';
import { Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MonthlyChartEntry } from '../hooks/useDashboard';

interface MonthlyChartProps {
  data: MonthlyChartEntry[];
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
  const totalAnnuel = data.reduce((s, c) => s + c["Chiffre d'affaires"], 0);

  return (
    <div className="bg-white p-4 sm:p-6 border border-slate-100 shadow-sm rounded-2xl sm:rounded-3xl space-y-3 sm:space-y-4 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 font-sans">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 shrink-0" />
            <span className="break-words">Argent vendu par mois</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-400 font-serif mt-0.5">
            Évolution du chiffre d&apos;affaires (Ariary).
          </p>
        </div>
        <div className="text-[10px] sm:text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full self-start whitespace-nowrap">
          Total : {totalAnnuel.toLocaleString()} Ar
        </div>
      </div>

      <div className="h-56 sm:h-72 w-full pt-2 sm:pt-4 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              tickFormatter={(v) => String(v).slice(0, 3)}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(val) => `${(val / 1000).toLocaleString()}k`}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString()} Ar`, "Chiffre d'affaires"]}
              contentStyle={{
                borderRadius: '16px',
                fontSize: '11px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
              }}
            />
            <Bar dataKey="Chiffre d'affaires" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.name === 'Juin' ? '#4f46e5' : idx % 2 === 0 ? '#818cf8' : '#cbd5e1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

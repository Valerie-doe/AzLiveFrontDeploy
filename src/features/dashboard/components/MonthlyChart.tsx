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
    <div className="bg-white p-6 border border-slate-100 shadow-sm rounded-3xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="font-extrabold text-slate-900 text-md flex items-center gap-1.5 font-sans">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Graphe Comparatif de l'argent vendu par mois
          </h4>
          <p className="text-xs text-slate-400 font-serif">
            Analyse de l'évolution du Chiffre d'Affaires global d'intermédiation commerciale (Ariary).
          </p>
        </div>
        <div className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full self-start">
          Total Annuel : {totalAnnuel.toLocaleString()} Ar
        </div>
      </div>

      <div className="h-68 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${(val / 1000).toLocaleString()}k Ar`}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString()} Ar`, "Chiffre d'affaires"]}
              contentStyle={{ borderRadius: '16px', fontSize: '11px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
            />
            <Bar dataKey="Chiffre d'affaires" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={60}>
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

import React from 'react';

interface LogEntry {
  id: string;
  time: string;
  page: string;
  platform: 'Facebook' | 'TikTok';
  user: string;
  comment: string;
  capturedCode: string;
  status: 'captured' | 'ignored';
}

interface LogsTabProps {
  sandboxLog: LogEntry[];
  onClear: () => void;
}

export default function LogsTab({ sandboxLog, onClear }: LogsTabProps) {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-slate-400 uppercase font-black">
        <span>Traces JSON de capture brute (Live webhook trigger)</span>
        <button
          onClick={onClear}
          className="text-rose-500 hover:text-rose-700 underline font-extrabold uppercase border-none bg-transparent cursor-pointer"
        >
          Effacer
        </button>
      </div>

      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
        {sandboxLog.map((log) => (
          <div
            key={log.id}
            className="p-3 border rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed relative overflow-hidden text-left"
          >
            <div className="flex justify-between items-center text-[10px] text-slate-400 pb-1.5 border-b border-slate-800 mb-1.5">
              <span className="text-indigo-405 text-indigo-400 font-black flex items-center gap-1">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    log.status === 'captured' ? 'bg-emerald-500' : 'bg-slate-500'
                  }`}
                />
                {log.page} ({log.platform})
              </span>
              <span>{log.time}</span>
            </div>
            <div>
              <span className="text-yellow-400 font-bold">&quot;from_user&quot;</span>:{' '}
              <span className="text-indigo-305 text-indigo-300">&quot;{log.user}&quot;</span>
            </div>
            <div>
              <span className="text-yellow-400 font-bold">&quot;comment_body&quot;</span>:{' '}
              <span className="text-emerald-305 text-emerald-300">&quot;{log.comment}&quot;</span>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1.5 mt-1.5 border-t border-slate-900 text-slate-400">
              <span>
                Code détecté :{' '}
                <strong
                  className={
                    log.capturedCode !== 'Aucun' && log.capturedCode !== 'Système'
                      ? 'text-amber-400 font-black underline'
                      : 'text-slate-500'
                  }
                >
                  {log.capturedCode}
                </strong>
              </span>
              <span className="text-slate-400 font-bold">API Webhook OK</span>
            </div>
          </div>
        ))}

        {sandboxLog.length === 0 && (
          <p className="text-center py-10 font-mono text-[11px] text-slate-400">
            Aucune trace de webhook en mémoire. Utilisez le simulateur à droite pour tester une
            notification.
          </p>
        )}
      </div>
    </div>
  );
}

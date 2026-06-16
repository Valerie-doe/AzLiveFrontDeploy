import React from 'react';
import { DeliveryStatus, Order } from '../../types';

interface DeliveryTimelineProps {
  order: Order;
  steps: { label: DeliveryStatus; title: string; desc: string }[];
}

export default function DeliveryTimeline({ order, steps }: DeliveryTimelineProps) {
  return (
    <div className="space-y-6 pl-4 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
      {steps.map((st, idx) => {
        const currentStatusIndex = steps.findIndex(x => x.label === order.deliveryStatus);
        const isCompleted = idx < currentStatusIndex || order.deliveryStatus === 'livré';
        const isActive = idx === currentStatusIndex && order.deliveryStatus !== 'livré';

        return (
          <div key={st.label} className="relative pl-8 text-left">
            {/* Circle Node */}
            <div className={`absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 flex items-center justify-center -translate-x-1.5 transition-all ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : isActive
                  ? 'bg-indigo-650 border-indigo-600 text-white bg-indigo-600 shadow'
                  : 'bg-white border-slate-300'
            }`}>
              {isCompleted && <span className="text-[10px] font-black">✓</span>}
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>}
            </div>

            <h4 className={`font-extrabold text-xs transition-colors ${
              isCompleted ? 'text-emerald-800' : isActive ? 'text-indigo-600' : 'text-slate-400'
            }`}>
              {st.title}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 font-serif">{st.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

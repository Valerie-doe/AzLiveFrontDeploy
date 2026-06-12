import React from 'react';
import { Order } from '../../types';
import {
  MapPin,
  Truck,
  Phone,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react';
import { Compass } from 'lucide-react';
import { getSuburbsLoc } from '../utils/locationUtils';

interface SearchResultCardProps {
  order: Order;
}

export default function SearchResultCard({ order: ord }: SearchResultCardProps) {
  const locDetails = getSuburbsLoc(ord.deliveryAddress);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
      {/* Header title */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded">
            {ord.jpCode}
          </span>
          <span className="text-xs font-mono font-bold text-slate-400">
            #Colis {ord.id.toUpperCase()}
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
            ord.status === 'livré'
              ? 'bg-emerald-50 text-emerald-700'
              : ord.status === 'en livraison'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-indigo-50 text-indigo-700'
          }`}
        >
          {ord.status}
        </span>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500">
            <User className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-black block">Acheteur</p>
              <p className="font-bold text-slate-800">{ord.customerName}</p>
              <p className="font-mono text-[10px]">{ord.customerHandle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 pt-1">
            <Phone className="h-4 w-4 text-slate-400" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-black block">Téléphone</p>
              <p className="font-bold text-slate-800">{ord.customerPhone || 'En attente'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-1.5 text-slate-500">
            <Truck className="h-4 w-4 text-indigo-600 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-black block">Article & Prix</p>
              <p className="font-bold text-slate-800">{ord.productName}</p>
              <p className="font-bold font-mono text-indigo-600">{ord.price.toLocaleString()} Ar</p>
            </div>
          </div>
          <div className="flex items-start gap-1.5 text-slate-500 pt-1">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase font-black block">Livraison préférée</p>
              <p className="font-bold text-slate-800">{ord.prefDeliveryDate || 'Dès que possible'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Position télémétrie */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 space-y-3 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15">
          <Compass className="h-28 w-28 text-slate-300 animate-spin" style={{ animationDuration: '40s' }} />
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-400 animate-bounce" />
          <span className="text-[10px] font-mono font-black uppercase text-slate-300 tracking-wider">
            Position Courant & Télémétrie AZExpress (Point 14)
          </span>
        </div>

        <div className="space-y-1.5 relative z-10">
          <p className="font-bold text-xs text-white">{locDetails}</p>
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 w-fit inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              Rider en transit actif - Vitesse moyenne 45 Km/h
            </span>
          </div>
        </div>

        {/* Itinéraire stylisé */}
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 mt-2">
          <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold">Itinéraire du Livreur</span>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
            <span>Boutique</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 animate-pulse" />
            <span className={ord.deliveryStatus !== 'au bureau' ? 'text-indigo-400 font-bold' : 'opacity-50'}>
              Bureau
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 animate-pulse" />
            <span
              className={
                ord.deliveryStatus === 'en livraison' || ord.status === 'livré'
                  ? 'text-indigo-400 font-bold'
                  : 'opacity-50'
              }
            >
              Transit
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500 animate-pulse" />
            <span className={ord.status === 'livré' ? 'text-emerald-400 font-bold' : 'opacity-50'}>Dest</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-1000"
              style={{
                width:
                  ord.status === 'livré'
                    ? '100%'
                    : ord.deliveryStatus === 'en livraison'
                    ? '75%'
                    : ord.deliveryStatus === 'assigné livreur'
                    ? '50%'
                    : '25%',
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

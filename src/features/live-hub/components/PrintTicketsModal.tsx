import React from 'react';
import { motion } from 'motion/react';
import { Printer } from 'lucide-react';
import { LiveSession, Order } from '../../../types';

interface PrintTicketsModalProps {
  selectedSession: LiveSession;
  orders: Order[];
  printProductFilter: string | null;
  printOrderFilter: string | null;
  onClose: () => void;
}

export default function PrintTicketsModal({
  selectedSession,
  orders,
  printProductFilter,
  printOrderFilter,
  onClose,
}: PrintTicketsModalProps) {
  // Même source que les tableaux de commandes (LiveOrdersTab) : on privilégie les commandes
  // backend (`orders`) quand elles existent, pour TOUS les statuts — y compris « Terminé ».
  // Les `id` imprimés (printOrderFilter) proviennent de cette même liste : sans cet alignement,
  // l'impression d'un live terminé ne trouvait aucune commande (régression du bouton Imprimer).
  const baseOrders = orders.length > 0 ? orders : selectedSession.orders || [];

  let sOrders = [...baseOrders];
  if (printProductFilter) {
    sOrders = sOrders.filter(
      (o) => o.jpCode === printProductFilter && o.status !== 'annulé'
    );
  } else if (printOrderFilter) {
    sOrders = sOrders.filter((o) => o.id === printOrderFilter);
  }

  const handlePrint = () => {
    alert(
      `🖨️ Envoi des ${sOrders.length} tickets à l'imprimante thermique adhésive XP-420B réussi !\n\nLes stickers thermocollants de format 50mm x 30mm sont prêts pour vos livreurs AZExpress.`
    );
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      id="thermal-tickets-print-modal"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-slate-950 text-slate-100 rounded-3xl w-full max-w-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">
                {printOrderFilter
                  ? 'Impression Élastique Commande Directe'
                  : printProductFilter
                  ? `Impression Tickets Directs - ${printProductFilter}`
                  : 'Impression de masse – Tickets thermiques'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase mt-0.5 animate-none">
                Direct : {selectedSession.title}{' '}
                {printProductFilter && `| Produit : ${printProductFilter}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-black uppercase tracking-wide cursor-pointer border-none"
          >
            Fermer
          </button>
        </div>

        {/* Ticket list rendering */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sOrders.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
              Aucun ticket thermique n'est disponible pour l'impression dans cette sélection.
            </div>
          ) : (
            sOrders.map((ord, idx) => (
              <div
                key={ord.id}
                className="bg-white text-slate-950 p-4 rounded-xl border-2 border-dashed border-slate-300 shadow-sm font-mono text-[10px] relative overflow-hidden"
              >
                {/* Ticket Header */}
                <div className="text-center font-black border-b border-slate-900 pb-2 mb-2">
                  <div className="text-xs uppercase tracking-widest font-mono">
                    *** AZLIVE EXCLUSIF ***
                  </div>
                  <div className="text-[8px] text-slate-500 font-mono">
                    Dressing Direct Madagascar
                  </div>
                </div>

                {/* Ticket content body */}
                <div className="space-y-1.5 uppercase leading-normal">
                  <div className="flex justify-between font-black text-xs">
                    <span>JP CODE:</span>
                    <span className="bg-slate-900 text-white px-1.5 py-0.2 rounded font-mono">
                      {ord.jpCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PRODUIT:</span>
                    <span className="text-right font-black truncate max-w-[120px]">
                      {ord.productName}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1 font-black">
                    <span>CLIENT:</span>
                    <span className="truncate max-w-[120px]">{ord.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HANDLE:</span>
                    <span className="truncate max-w-[120px]">{ord.customerHandle}</span>
                  </div>
                  <div className="flex justify-between font-black">
                    <span>TÉLÉPHONE:</span>
                    <span>{ord.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DISTRICT:</span>
                    <span className="text-right truncate max-w-[120px]">
                      {ord.deliveryAddress || 'Agence Tana'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1 border-slate-100">
                    <span>REÇU RÉCOR:</span>
                    <span>{ord.isPaid ? 'MVOLA/ORANGE OK ✅' : 'CASH LOGISTIQUE'}</span>
                  </div>
                </div>

                {/* barcode drawing */}
                <div className="pt-3 uppercase flex flex-col items-center justify-center">
                  <div className="font-mono text-[6px] tracking-[3px] font-bold text-slate-800 leading-none">
                    |||||||||||| | ||||| | ||||
                  </div>
                  <div className="font-mono text-[8px] text-slate-500 tracking-wider mt-1 leading-none">
                    LIVE-{selectedSession.id.toUpperCase().slice(-5)}#{idx + 1}
                  </div>
                </div>

                <div className="absolute top-1 right-2 w-3.5 h-3.5 border-r border-t border-slate-400 rounded-tr"></div>
                <div className="absolute bottom-1 left-2 w-3.5 h-3.5 border-l border-b border-slate-400 rounded-bl"></div>
              </div>
            ))
          )}
        </div>

        {/* Action buttons footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-955 bg-slate-950/70 flex justify-between items-center gap-4">
          <span className="text-slate-400 font-mono text-[9px]">
            Total à lancer : {sOrders.length} fiches thermiques
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer border-none"
          >
            <Printer className="h-4 w-4" /> Lancer l'impression physique 🚀
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

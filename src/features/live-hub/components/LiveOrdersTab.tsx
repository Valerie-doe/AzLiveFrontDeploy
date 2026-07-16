import React, { useMemo, useState } from 'react';
import { Printer, Plus, ImageIcon } from 'lucide-react';
import { LiveSession, Order, OrderStatus } from '../../../types';
import { playNotificationSound } from '../../../sound';
import { SearchInput, PaginationControls } from '../../../shared';
import LiveOrderDetailPanel from './LiveOrderDetailPanel';

interface LiveOrdersTabProps {
  selectedSession: LiveSession;
  orders: Order[];
  sessionOrdersSearch: string;
  setSessionOrdersSearch: (val: string) => void;
  ordersPage: number;
  setOrdersPage: (page: number) => void;
  selectedCompletedOrderId: string | null;
  setSelectedCompletedOrderId: (id: string | null) => void;
  copiedOrderId: string | null;
  onCopySummary: (order: Order) => void;
  onPrintAll: () => void;
  onPrintSingle: (orderId: string) => void;
  onAddManualOrder: () => void;
}

type OrdersSubTab = 'pending' | 'confirmed' | 'cancelled';

/** Commande détectée mais pas encore confirmée. */
const PENDING_STATUS: OrderStatus = 'JP capturé';
/** Statuts considérés comme « confirmés » (confirmation et étapes ultérieures). */
const CONFIRMED_STATUSES: OrderStatus[] = ['confirmé', 'préparé', 'en livraison', 'livré'];
/** Commande annulée (par le client ou le vendeur). */
const CANCELLED_STATUS: OrderStatus = 'annulé';

const ITEMS_PER_PAGE = 10;

function chronoKey(order: Order): string {
  return order.orderDateTime || order.orderTime || '';
}

/** Clé stable pour regrouper les commandes d'un même client. */
function clientGroupKey(order: Order): string {
  const fb = (order.facebookId || '').trim();
  if (fb) return `fb:${fb}`;
  const handle = (order.customerHandle || '').trim().toLowerCase();
  if (handle) return `h:${handle}`;
  const phone = (order.customerPhone || '').trim();
  const name = (order.customerName || '').trim().toLowerCase();
  return `n:${name}|${phone}`;
}

function getInitials(name: string): string {
  const trimmed = (name || '').trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Photo de profil Facebook si disponible, sinon initiales du client.
 * `loading="lazy"` évite de charger les images hors écran (perf sur grosses listes),
 * et `onError` bascule proprement vers l'avatar d'initiales si l'image est indisponible.
 */
function ClientAvatar({ order }: { order: Order }) {
  const [failed, setFailed] = useState(false);
  if (order.facebookId && !failed) {
    return (
      <img
        src={`https://graph.facebook.com/${order.facebookId}/picture?type=square&width=64&height=64`}
        alt={order.customerName}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-8 w-8 rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0"
      />
    );
  }
  return (
    <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
      {getInitials(order.customerName)}
    </div>
  );
}

/**
 * Vignette du produit commandé (photo si disponible, sinon icône de repli).
 * `loading="lazy"` limite le coût réseau sur de longues listes de commandes.
 */
function ProductThumb({ order }: { order: Order }) {
  const [failed, setFailed] = useState(false);
  if (order.productImage && !failed) {
    return (
      <img
        src={order.productImage}
        alt={order.productName}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-9 w-9 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
      />
    );
  }
  return (
    <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 shrink-0">
      <ImageIcon className="h-4 w-4" />
    </div>
  );
}

function formatDateTime(order: Order): string {
  return order.orderTime || order.orderDateTime || '—';
}

export default function LiveOrdersTab({
  selectedSession,
  orders,
  sessionOrdersSearch,
  setSessionOrdersSearch,
  ordersPage,
  setOrdersPage,
  selectedCompletedOrderId,
  setSelectedCompletedOrderId,
  copiedOrderId,
  onCopySummary,
  onPrintAll,
  onPrintSingle,
  onAddManualOrder,
}: LiveOrdersTabProps) {
  const [ordersSubTab, setOrdersSubTab] = useState<OrdersSubTab>('pending');

  // Commandes réelles (backend) fournies via `orders` pour tous les statuts, y compris
  // « Terminé » : l'historique (en attente + confirmées) reste consultable après la fin.
  const sessionOrders = orders.length > 0 ? orders : selectedSession.orders || [];

  const matchesSearch = (ord: Order) => {
    const q = sessionOrdersSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      ord.customerName.toLowerCase().includes(q) ||
      (ord.customerPhone && ord.customerPhone.includes(q)) ||
      (ord.customerHandle && ord.customerHandle.toLowerCase().includes(q)) ||
      ord.jpCode.toLowerCase().includes(q) ||
      ord.productName.toLowerCase().includes(q)
    );
  };

  // Commandes en attente : groupées par code JP, clients triés par ordre de réception.
  const pendingOrders = useMemo(
    () =>
      sessionOrders
        .filter((o) => o.status === PENDING_STATUS && matchesSearch(o))
        .sort((a, b) => {
          const byJp = (a.jpCode || '').localeCompare(b.jpCode || '');
          return byJp !== 0 ? byJp : chronoKey(a).localeCompare(chronoKey(b));
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionOrders, sessionOrdersSearch],
  );

  const sortByClientThenOrder = (a: Order, b: Order) => {
    const byClient = clientGroupKey(a).localeCompare(clientGroupKey(b), 'fr');
    if (byClient !== 0) return byClient;
    const byChrono = chronoKey(a).localeCompare(chronoKey(b));
    if (byChrono !== 0) return byChrono;
    return Number(a.id) - Number(b.id);
  };

  // Commandes confirmées : groupées par client, commandes en ordre croissant (plus anciennes d'abord).
  const confirmedOrders = useMemo(
    () =>
      sessionOrders
        .filter((o) => CONFIRMED_STATUSES.includes(o.status) && matchesSearch(o))
        .sort(sortByClientThenOrder),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionOrders, sessionOrdersSearch],
  );

  // Commandes annulées : même regroupement client / ordre croissant.
  const cancelledOrders = useMemo(
    () =>
      sessionOrders
        .filter((o) => o.status === CANCELLED_STATUS && matchesSearch(o))
        .sort(sortByClientThenOrder),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionOrders, sessionOrdersSearch],
  );

  const activeList =
    ordersSubTab === 'pending'
      ? pendingOrders
      : ordersSubTab === 'cancelled'
        ? cancelledOrders
        : confirmedOrders;

  const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE);
  const activePage = Math.min(ordersPage, Math.max(1, totalPages));
  const displayedOrders = activeList.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE,
  );

  const selectedOrder =
    activeList.find((o) => o.id === selectedCompletedOrderId) || activeList[0];

  const switchSubTab = (tab: OrdersSubTab) => {
    if (tab === ordersSubTab) return;
    setOrdersSubTab(tab);
    setOrdersPage(1);
    setSelectedCompletedOrderId(null);
    playNotificationSound('click');
  };

  const subTabClass = (tab: OrdersSubTab) =>
    `px-6 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
      ordersSubTab === tab
        ? 'border-secondary text-secondary font-extrabold'
        : 'border-transparent text-slate-500 hover:text-slate-850'
    }`;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'livré':
        return 'bg-emerald-50 text-emerald-800 border-emerald-250';
      case 'annulé':
        return 'bg-rose-50 text-rose-800 border-rose-250';
      case 'confirmé':
        return 'bg-indigo-50 text-indigo-800 border-indigo-250';
      case 'en livraison':
        return 'bg-amber-50 text-amber-800 border-amber-250';
      case 'préparé':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Lignes du tableau « en attente » : regroupement par code JP via rowSpan
  // (Produit et Code JP affichés une seule fois pour tout le groupe). Le tri par JP
  // puis par heure garantit des groupes contigus ; le rowSpan couvre la portion visible
  // du groupe sur la page courante (compatible pagination).
  const renderPendingRows = () => {
    const rows: React.ReactNode[] = [];
    let i = 0;

    while (i < displayedOrders.length) {
      const jp = displayedOrders[i].jpCode || '—';
      let j = i;
      while (j < displayedOrders.length && (displayedOrders[j].jpCode || '—') === jp) j++;
      const group = displayedOrders.slice(i, j);
      const span = group.length;

      group.forEach((ord, idx) => {
        const isSelected = selectedOrder?.id === ord.id;
        rows.push(
          <tr
            key={ord.id}
            className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
              isSelected ? 'bg-indigo-50/20 font-bold' : ''
            }`}
            onClick={() => {
              setSelectedCompletedOrderId(ord.id);
              playNotificationSound('click');
            }}
          >
            {idx === 0 && (
              <>
                <td
                  rowSpan={span}
                  className="py-3.5 px-5 align-top border-r border-slate-100 bg-slate-50/30 text-slate-700 font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <ProductThumb order={group[0]} />
                    <span className="font-medium text-slate-700">{group[0].productName || '—'}</span>
                  </div>
                </td>
                <td rowSpan={span} className="py-3.5 px-5 align-top border-r border-slate-100 bg-slate-50/30">
                  <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                    {jp}
                  </span>
                </td>
              </>
            )}
            <td className="py-3.5 px-5 font-extrabold text-slate-900">{ord.customerName}</td>
            <td className="py-3.5 px-5 font-mono text-slate-500 whitespace-nowrap">{ord.orderTime || '—'}</td>
            <td className="py-3.5 px-5 text-right font-medium text-slate-600 whitespace-nowrap">
              {(ord.price || 0).toLocaleString()} {ord.currency || 'Ar'}
            </td>
            <td className="py-3.5 px-5 text-center" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  onPrintSingle(ord.id);
                  playNotificationSound('click');
                }}
                className="p-1.5 bg-slate-50 text-indigo-700 hover:text-white hover:bg-indigo-600 rounded-lg border border-slate-200 transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                title="Imprimer ce ticket thermique"
              >
                <Printer className="h-3.5 w-3.5" />
              </button>
            </td>
          </tr>,
        );
      });

      i = j;
    }

    return rows;
  };

  // Lignes détaillées (confirmées / annulées) : regroupement par client via rowSpan.
  const renderDetailRows = () => {
    const rows: React.ReactNode[] = [];
    let i = 0;

    while (i < displayedOrders.length) {
      const key = clientGroupKey(displayedOrders[i]);
      let j = i;
      while (j < displayedOrders.length && clientGroupKey(displayedOrders[j]) === key) j++;
      const group = displayedOrders.slice(i, j);
      const span = group.length;

      group.forEach((ord, idx) => {
        const qty = ord.quantity && ord.quantity > 0 ? ord.quantity : 1;
        const total = (ord.price || 0) * qty;
        const isSelected = selectedOrder?.id === ord.id;
        rows.push(
          <tr
            key={ord.id}
            className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
              isSelected ? 'bg-indigo-50/20 font-bold' : ''
            }`}
            onClick={() => {
              setSelectedCompletedOrderId(ord.id);
              playNotificationSound('click');
            }}
          >
            {idx === 0 && (
              <td
                rowSpan={span}
                className="py-3.5 px-5 align-top border-r border-slate-100 bg-slate-50/30"
              >
                <div className="flex items-center gap-2.5">
                  <ClientAvatar order={group[0]} />
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">
                      {group[0].customerName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      FB : {group[0].facebookId || '—'}
                    </div>
                  </div>
                </div>
              </td>
            )}
            <td className="py-3.5 px-5">
              <span className="font-mono text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-black">
                {ord.jpCode || '—'}
              </span>
            </td>
            <td className="py-3.5 px-5 text-slate-700 font-medium whitespace-nowrap">
              {ord.productName}
            </td>
            <td className="py-3.5 px-5 text-center font-bold text-slate-700">{qty}</td>
            <td className="py-3.5 px-5 text-right font-medium text-slate-600 whitespace-nowrap">
              {(ord.price || 0).toLocaleString()} {ord.currency || 'Ar'}
            </td>
            <td className="py-3.5 px-5 text-right font-black text-indigo-600 font-sans whitespace-nowrap">
              {total.toLocaleString()} {ord.currency || 'Ar'}
            </td>
            <td className="py-3.5 px-5 font-mono text-slate-500 whitespace-nowrap">
              {formatDateTime(ord)}
            </td>
            <td className="py-3.5 px-5 text-center">
              <span
                className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                  ord.status,
                )}`}
              >
                {ord.status}
              </span>
            </td>
            <td
              className="py-3.5 px-5 text-slate-600 max-w-[200px] truncate"
              title={ord.deliveryAddress || ''}
            >
              {ord.deliveryAddress || '—'}
            </td>
            <td className="py-3.5 px-5 font-mono text-slate-500 whitespace-nowrap">
              {ord.customerPhone || '—'}
            </td>
          </tr>,
        );
      });

      i = j;
    }

    return rows;
  };

  const headerTitle =
    ordersSubTab === 'pending'
      ? `Commandes en attente (${pendingOrders.length})`
      : ordersSubTab === 'cancelled'
        ? `Commandes annulées (${cancelledOrders.length})`
        : `Commandes confirmées (${confirmedOrders.length})`;

  const emptyLabel =
    ordersSubTab === 'pending'
      ? 'Aucune commande en attente pour ce live.'
      : ordersSubTab === 'cancelled'
        ? 'Aucune commande annulée pour ce live.'
        : 'Aucune commande confirmée pour ce live.';

  const showDetailTable = ordersSubTab === 'confirmed' || ordersSubTab === 'cancelled';

  return (
    <div className="space-y-4">
      {/* SUB-TAB NAVIGATION (même principe que Stock / Tous les articles - Dressing) */}
      <div className="flex border-b border-slate-200 overflow-x-auto" id="live-orders-subtabs">
        <button type="button" onClick={() => switchSubTab('pending')} className={subTabClass('pending')}>
          Commandes en attente ({pendingOrders.length})
        </button>
        <button type="button" onClick={() => switchSubTab('confirmed')} className={subTabClass('confirmed')}>
          Commandes confirmées ({confirmedOrders.length})
        </button>
        <button type="button" onClick={() => switchSubTab('cancelled')} className={subTabClass('cancelled')}>
          Commandes annulées ({cancelledOrders.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="completed-live-split-panel">
        {/* LEFT COLUMN: LIST OF COMMANDE CARDS AND SEARCH BAR (Master) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-8">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 font-mono">
                {headerTitle}
              </h3>
              <button
                type="button"
                onClick={() => {
                  onPrintAll();
                  playNotificationSound('click');
                }}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-accent hover:text-indigo-850 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 transition-all border border-indigo-100 cursor-pointer whitespace-nowrap"
                title="Imprimer tous les tickets thermiques pour ce direct"
              >
                <Printer className="h-3 w-3" /> Imprimer tout
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {(selectedSession.status === 'En cours' || selectedSession.status === 'Terminé') && (
                <button
                  type="button"
                  onClick={() => {
                    onAddManualOrder();
                    playNotificationSound('click');
                  }}
                  className="px-3.5 py-2 bg-secondary hover:bg-emerald-705 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer shadow-sm transition-all whitespace-nowrap border-none"
                >
                  <Plus className="h-3 w-3" /> Ajouter commande
                </button>
              )}

              <SearchInput
                value={sessionOrdersSearch}
                onChange={(val) => {
                  setSessionOrdersSearch(val);
                  setOrdersPage(1);
                }}
                className="min-w-[200px] sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-650 font-sans">
              <thead>
                {ordersSubTab === 'pending' ? (
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                    <th className="py-3 px-5">Produit</th>
                    <th className="py-3 px-5">Code JP</th>
                    <th className="py-3 px-5">Nom Client</th>
                    <th className="py-3 px-5">Heure</th>
                    <th className="py-3 px-5 text-right">Prix Unitaire</th>
                    <th className="py-3 px-5 text-center">Imprimer</th>
                  </tr>
                ) : (
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                    <th className="py-3 px-5">Client</th>
                    <th className="py-3 px-5">Code JP</th>
                    <th className="py-3 px-5">Produit</th>
                    <th className="py-3 px-5 text-center">Qté</th>
                    <th className="py-3 px-5 text-right">Prix unit.</th>
                    <th className="py-3 px-5 text-right">Total</th>
                    <th className="py-3 px-5">Date / Heure</th>
                    <th className="py-3 px-5 text-center">Statut</th>
                    <th className="py-3 px-5">Adresse</th>
                    <th className="py-3 px-5">Téléphone</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {activeList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={ordersSubTab === 'pending' ? 6 : 10}
                      className="py-12 text-center text-slate-400 font-mono"
                    >
                      {emptyLabel}
                    </td>
                  </tr>
                ) : ordersSubTab === 'pending' ? (
                  renderPendingRows()
                ) : showDetailTable ? (
                  renderDetailRows()
                ) : null}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={activePage}
            totalItems={activeList.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setOrdersPage}
            itemLabel="fiches"
          />
        </div>

        {/* RIGHT COLUMN: DETAIL VIEWER WITH ALL FIELDS & ACTION SLIDERS */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm min-h-[580px] flex flex-col justify-between">
          <LiveOrderDetailPanel
            ord={selectedOrder}
            copiedOrderId={copiedOrderId}
            onCopySummary={onCopySummary}
            onPrintClick={onPrintSingle}
          />
        </div>
      </div>
    </div>
  );
}

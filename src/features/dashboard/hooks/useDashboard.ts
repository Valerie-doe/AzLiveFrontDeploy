import { Order, Product, LiveSession } from '../../types';

export interface ProductLeaderboardItem {
  name: string;
  count: number;
  value: number;
  code: string;
  image: string;
  size: string;
  color: string;
  stock: number;
  price: number;
}

export interface MonthlyChartEntry {
  name: string;
  "Chiffre d'affaires": number;
}

const MONTHLY_BASELINE_INITIAL: Record<string, number> = {
  'Janvier': 1100000,
  'Février': 1250000,
  'Mars': 1480000,
  'Avril': 1920000,
  'Mai': 2450000,
  'Juin': 0,
  'Juillet': 0,
  'Août': 0,
  'Septembre': 0,
  'Octobre': 0,
  'Novembre': 0,
  'Décembre': 0,
};

function getMonthKey(dateLower: string): string {
  if (dateLower.includes('jan')) return 'Janvier';
  if (dateLower.includes('fév') || dateLower.includes('fev')) return 'Février';
  if (dateLower.includes('mar')) return 'Mars';
  if (dateLower.includes('avr') || dateLower.includes('apr')) return 'Avril';
  if (dateLower.includes('mai') || dateLower.includes('may')) return 'Mai';
  if (dateLower.includes('juin') || dateLower.includes('jun')) return 'Juin';
  if (dateLower.includes('juil') || dateLower.includes('jul')) return 'Juillet';
  if (dateLower.includes('aoû') || dateLower.includes('aou') || dateLower.includes('aug')) return 'Août';
  if (dateLower.includes('sep')) return 'Septembre';
  if (dateLower.includes('oct')) return 'Octobre';
  if (dateLower.includes('nov')) return 'Novembre';
  if (dateLower.includes('déc') || dateLower.includes('dec')) return 'Décembre';
  return '';
}

export function computeDashboardData(orders: Order[], products: Product[], liveSessions: LiveSession[]) {
  const confirmedOrders = orders.filter((o) =>
    ['confirmé', 'préparé', 'en livraison', 'livré'].includes(o.status)
  );
  const confirmedCount = confirmedOrders.length;
  const totalJP = orders.length;
  const confirmationRate = totalJP > 0 ? Math.round((confirmedCount / totalJP) * 100) : 0;
  const totalCA = confirmedOrders.reduce((sum, item) => sum + item.price, 0);
  const caTotalCumule = totalCA + liveSessions.reduce((sum, s) => sum + s.revenue, 0);
  const articlesVendusTotal =
    confirmedCount +
    liveSessions.reduce((sum, s) => sum + s.orders.filter((o) => o.status !== 'annulé').length, 0);
  const totalLivesRealises = liveSessions.length;
  const nbrArticlesEnStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalPayeMobileMoney = orders.filter((o) => o.isPaid).reduce((sum, o) => sum + o.price, 0);
  const deliveredCount = orders.filter((o) => o.status === 'livré').length;
  const totalCommission = totalCA * 0.025;
  const totalDeliveryFees = deliveredCount * 3000;
  const sellerPayout = Math.max(0, totalPayeMobileMoney - totalCommission - totalDeliveryFees);

  // Monthly chart
  const monthlyBaseline = { ...MONTHLY_BASELINE_INITIAL };
  liveSessions.forEach((session) => {
    const key = getMonthKey(session.date.toLowerCase());
    if (key) monthlyBaseline[key] += session.revenue;
  });
  monthlyBaseline['Juin'] += totalCA;
  if (monthlyBaseline['Juin'] === 0) monthlyBaseline['Juin'] = 650000;

  const monthlyChartData: MonthlyChartEntry[] = Object.entries(monthlyBaseline).map(([month, val]) => ({
    name: month,
    "Chiffre d'affaires": val,
  }));

  // Leaderboard
  const countMap: Record<string, number> = {};
  orders.forEach((o) => { if (o.status !== 'annulé') countMap[o.productName] = (countMap[o.productName] || 0) + 1; });
  liveSessions.forEach((session) => {
    session.orders.forEach((o) => {
      if (o.status !== 'annulé') countMap[o.productName] = (countMap[o.productName] || 0) + 1;
    });
  });

  const productLeaderboard: ProductLeaderboardItem[] = Object.entries(countMap)
    .map(([name, count]) => {
      const prod = products.find((p) => p.name === name);
      const price = prod?.price || 40000;
      return {
        name, count, value: count * price,
        code: prod?.jpCode || 'JP',
        image: prod?.image || '',
        size: prod?.size || 'Unique',
        color: prod?.color || 'Unique',
        stock: prod?.stock ?? 10,
        price,
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    confirmationRate, totalJP, confirmedCount,
    totalCA, caTotalCumule, articlesVendusTotal,
    totalLivesRealises, nbrArticlesEnStock,
    totalPayeMobileMoney, sellerPayout,
    monthlyChartData, productLeaderboard,
  };
}

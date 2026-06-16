export const getSuburbsLoc = (address: string): string => {
  const addr = address.toLowerCase();
  if (addr.includes('itaosy')) return 'Axe Nord-Ouest près d\'Itaosy (Coordonnées GPS: -18.9134, 47.4789)';
  if (addr.includes('ivato')) return 'Axe Nord face Aéroport d\'Ivato (Coordonnées GPS: -18.7981, 47.4795)';
  if (addr.includes('analakely')) return 'Centre-ville Analakely face Gare Soarano (Coordonnées GPS: -18.9056, 47.5212)';
  if (addr.includes('ankorondrano')) return 'Axe Commercial Ankorondrano près Digue (Coordonnées GPS: -18.8872, 47.5262)';
  if (addr.includes('talatamaty')) return 'Rond-point Talatamaty (Coordonnées GPS: -18.8354, 47.4611)';
  return 'Entrepôt central Antananarivo (Coordonnées GPS: -18.9001, 47.5100)';
};

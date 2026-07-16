export const getCurrentLocalDateTimeString = (): string => {
  const now = new Date();
  const tzoffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzoffset).toISOString().slice(0, 16);
};

export const convertToInputValue = (dateStr: string): string => {
  if (!dateStr) return getCurrentLocalDateTimeString();
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  if (isoRegex.test(dateStr)) return dateStr;

  try {
    // ISO complet (avec Z / +03:00 / millisecondes) → datetime-local
    const parsed = new Date(dateStr);
    if (!Number.isNaN(parsed.getTime()) && /\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const tzoffset = parsed.getTimezoneOffset() * 60000;
      return new Date(parsed.getTime() - tzoffset).toISOString().slice(0, 16);
    }

    let cleaned = dateStr
      .toLowerCase()
      .replace(' à ', ' ')
      .replace(' - ', ' ')
      .replace(' et ', ' ')
      .trim();

    const monthsFr = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'];
    const monthsEn = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const parts = cleaned.split(/\s+/);

    if (parts.length >= 4) {
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1];
      const year = parseInt(parts[2], 10);
      const timeStr = parts[3];

      let monthIndex = monthsFr.findIndex((m) => monthStr.startsWith(m));
      if (monthIndex === -1) {
        monthIndex = monthsEn.findIndex((m) => monthStr.toLowerCase().startsWith(m.toLowerCase()));
      }
      if (monthIndex !== -1 && !isNaN(day) && !isNaN(year) && timeStr) {
        const [h, m] = timeStr.split(':');
        const d = new Date(year, monthIndex, day, parseInt(h, 10), parseInt(m, 10));
        const tzoffset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tzoffset).toISOString().slice(0, 16);
      }
    }
  } catch (err) {
    console.error('Error converting date to input element:', err);
  }
  return getCurrentLocalDateTimeString();
};

/** Affiche une date lisible : « 16 juil. 2026 à 10:05 ». */
export const formatLiveDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, '0');
    const months = ['jan.', 'fév.', 'mar.', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} à ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
};

/** Date + heure complète pour les listes de commandes : « 16/07/2026 10:05:14 ». */
export const formatOrderDateTime = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

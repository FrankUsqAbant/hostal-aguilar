export type DayPhase = 'amanecer' | 'dia' | 'atardecer' | 'noche';

/** Momento del día según la hora (0–23) en Cajamarca. */
export function dayPhase(hour: number): DayPhase {
  if (hour >= 5 && hour < 8) return 'amanecer';
  if (hour >= 8 && hour < 17) return 'dia';
  if (hour >= 17 && hour < 19) return 'atardecer';
  return 'noche';
}

/** Hora actual en Cajamarca (America/Lima): etiqueta legible ("2:37 a. m.") y hora 0–23. */
export function cajamarcaNow(date: Date = new Date()): { label: string; hour: number } {
  try {
    const label = new Intl.DateTimeFormat('es-PE', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Lima'
    }).format(date);
    const hour = Number(
      new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'America/Lima' }).format(date)
    );
    return { label, hour: Number.isFinite(hour) ? hour : date.getHours() };
  } catch {
    return { label: '', hour: date.getHours() };
  }
}

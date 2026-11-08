/**
 * Location utilities for Hostal Aguilar Cajamarca
 */

export interface TravelEstimate {
  meters: number;
  walkingMinutes: number;
  taxiMinutes: number;
  displayText: string;
}

export const HOSTAL_COORDINATES = {
  lat: -7.16382,
  lng: -78.51352,
  address: 'Jr. Los Andes 115, Cajamarca, Perú'
};

export function getGoogleMapsNavigationUrl(
  destination: string = 'Hostal Aguilar Jr Los Andes 115 Cajamarca',
  origin?: string,
  travelMode: 'walking' | 'driving' = 'walking'
): string {
  const baseUrl = 'https://www.google.com/maps/dir/?api=1';
  const destParam = `destination=${encodeURIComponent(destination)}`;
  const originParam = origin ? `&origin=${encodeURIComponent(origin)}` : '';
  const modeParam = `&travelmode=${travelMode}`;
  return `${baseUrl}&${destParam}${originParam}${modeParam}`;
}

export function getGoogleMapsEmbedUrl(
  query: string = 'Hostal Aguilar, Jr. Los Andes 115, Cajamarca, Peru',
  zoom: number = 16
): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
}

export function estimateTravel(meters: number): TravelEstimate {
  // Average walking speed ~75 meters/min (4.5 km/h)
  const walkingMinutes = Math.max(1, Math.round(meters / 75));
  // In Cajamarca city center, taxi takes 3-6 mins for short distances
  const taxiMinutes = meters < 400 ? 2 : Math.max(3, Math.round(meters / 250));

  let displayText = '';
  if (meters <= 300) {
    displayText = `${meters} m (${walkingMinutes} min a pie)`;
  } else if (meters < 1000) {
    displayText = `${meters} m (${walkingMinutes} min a pie / ${taxiMinutes} min en taxi)`;
  } else {
    const km = (meters / 1000).toFixed(1);
    displayText = `${km} km (${taxiMinutes} min en taxi / ${walkingMinutes} min a pie)`;
  }

  return {
    meters,
    walkingMinutes,
    taxiMinutes,
    displayText
  };
}

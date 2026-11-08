import { Room, Amenity, Review, Landmark, RoomType } from '../types';

export const HOSTAL_INFO = {
  name: 'Hostal Aguilar',
  tagline: 'Cajamarca',
  address: 'Jr. Los Andes 115 - 117, Cajamarca, Perú',
  shortAddress: 'Jr. Los Andes 115 • Cajamarca',
  primaryPhone: '+51 941 824 120',
  secondaryPhone: '+51 976 864 915',
  phoneDisplay: '941 824 120 / 976 864 915',
  whatsappNumber: '51941824120',
  email: 'reservas@hostalaguilar.com',
  businessName: 'Hostal Aguilar Cajamarca S.R.L.',
  ruc: '20612345678',
  schedule: 'Abierto 24 Horas',
  googleRating: 3.9,
  totalReviews: 16,
  facadeImage: '/assets/aistudio/Captura_de_pantalla_2026-10-31_010053_5afe7592.jpg',
  heroImage: '/images/natural_hotel_room_cajamarca_1793725794706.jpg'
};

export const ROOMS: Room[] = [
  {
    id: 'simple',
    type: 'simple',
    badge: 'Simple / Ejecutiva',
    name: 'Habitación Simple',
    subtitle: 'Para viajeros individuales',
    description: 'Espacio acogedor y tranquilo diseñado especialmente para profesionales o viajeros que buscan descanso impecable y privacidad total.',
    pricePerNight: 50,
    capacity: '1 Persona',
    bedType: '1 Cama individual (1.5 plazas)',
    image: '/images/room_simple_1793699274451.jpg',
    gallery: [
      '/images/room_simple_1793699274451.jpg',
      '/images/hero_hostal_room_1793699272432.jpg'
    ],
    amenities: ['Agua Caliente 24h', 'Wi-Fi de Alta Velocidad', 'TV Cable HD', 'Baño Privado', 'Toallas y Jabón'],
    ctaColor: 'blue'
  },
  {
    id: 'doble',
    type: 'doble',
    badge: 'Doble',
    name: 'Habitación Doble',
    subtitle: 'Perfecta para amigos o compañeros',
    description: 'Habitación amplia y luminosa equipada con dos camas individuales, ideal para amigos, colegas de trabajo o familiares que visitan Cajamarca.',
    pricePerNight: 80,
    capacity: '2 Personas',
    bedType: '2 Camas individuales (1.5 plazas c/u)',
    image: '/images/room_doble_1793699273668.jpg',
    gallery: [
      '/images/room_doble_1793699273668.jpg',
      '/images/hero_hostal_room_1793699272432.jpg'
    ],
    amenities: ['Agua Caliente 24h', 'Wi-Fi de Alta Velocidad', 'TV Cable HD', 'Baño Privado', 'Ventilación Natural'],
    ctaColor: 'red',
    featured: true
  },
  {
    id: 'matrimonial',
    type: 'matrimonial',
    badge: 'Matrimonial',
    name: 'Habitación Matrimonial',
    subtitle: 'Ideal para parejas y descanso confortable',
    description: 'Ambiente cálido y acogedor con cama Queen de 2 plazas, ropa de cama suave, baño privado completo y excelente iluminación.',
    pricePerNight: 90,
    capacity: '2 Personas',
    bedType: '1 Cama Queen / 2 plazas',
    image: '/images/hero_hostal_room_1793699272432.jpg',
    gallery: [
      '/images/hero_hostal_room_1793699272432.jpg',
      '/images/room_matrimonial_1793699274426.jpg'
    ],
    amenities: ['Agua Caliente 24h', 'Wi-Fi de Alta Velocidad', 'TV Cable HD', 'Baño Privado', 'Toallas y Amenities'],
    ctaColor: 'blue'
  },
  {
    id: 'romantica',
    type: 'romantica',
    badge: 'Romántica',
    name: 'Habitación Romántica',
    subtitle: 'Especial para aniversarios y parejas',
    description: 'Decoración exclusiva con arreglo de cisnes de toalla, pétalos y ambiente íntimo y cálido con cama Queen de 2 plazas.',
    pricePerNight: 110,
    capacity: '2 Personas',
    bedType: '1 Cama Queen con arreglo especial',
    image: '/images/room_matrimonial_1793699274426.jpg',
    gallery: [
      '/images/room_matrimonial_1793699274426.jpg',
      '/images/hero_hostal_room_1793699272432.jpg'
    ],
    amenities: ['Agua Caliente 24h', 'Wi-Fi de Alta Velocidad', 'TV Cable HD', 'Baño Privado', 'Decoración Romántica de Cisnes'],
    ctaColor: 'red'
  }
];

export interface RoomHeroSlide {
  type: RoomType;
  name: string;
  badge: string;
  price: number;
  capacity: string;
  hint: string;
  image: string;
  tagline: string;
}

export const ROOM_HERO_SLIDES: RoomHeroSlide[] = [
  {
    type: 'simple',
    name: 'Habitación Simple',
    badge: 'Simple / Individual',
    price: 50,
    capacity: '1 huésped',
    hint: 'Cama 1.5 plazas individual',
    image: '/images/room_simple_1793699274451.jpg',
    tagline: 'Comodidad y descanso para viajeros individuales'
  },
  {
    type: 'doble',
    name: 'Habitación Doble',
    badge: 'Doble',
    price: 80,
    capacity: '2 huéspedes',
    hint: '2 camas individuales',
    image: '/images/natural_hotel_room_cajamarca_1793725794706.jpg',
    tagline: 'Espaciosa con 2 camas y vista a los tejados de Cajamarca'
  },
  {
    type: 'matrimonial',
    name: 'Habitación Matrimonial',
    badge: 'Matrimonial',
    price: 90,
    capacity: '2 huéspedes',
    hint: 'Cama Queen confortable',
    image: '/images/hero_hostal_room_1793699272432.jpg',
    tagline: 'Ambiente cálido con cama Queen y baño privado completo'
  },
  {
    type: 'romantica',
    name: 'Habitación Romántica',
    badge: 'Romántica Especial',
    price: 110,
    capacity: '2 huéspedes',
    hint: 'Matrimonial con arreglo de cisnes',
    image: '/images/room_matrimonial_1793699274426.jpg',
    tagline: 'Detalle especial con cisnes de toalla para parejas'
  }
];

// Room metadata for Hero interactive chips
export const ROOM_CHIP_DETAILS: Record<string, { label: string; price: number; capacity: string; hint: string }> = {
  simple: {
    label: 'Simple',
    price: 50,
    capacity: '1 huésped',
    hint: 'Cama 1.5 plazas individual'
  },
  doble: {
    label: 'Doble',
    price: 80,
    capacity: '2 huéspedes',
    hint: '2 camas individuales'
  },
  matrimonial: {
    label: 'Matrimonial',
    price: 90,
    capacity: '2 huéspedes',
    hint: 'Cama Queen confortable'
  },
  romantica: {
    label: 'Romántica',
    price: 110,
    capacity: '2 huéspedes',
    hint: 'Matrimonial con arreglo de cisnes'
  }
};

export const SERVICES: Amenity[] = [
  {
    id: '24h',
    iconName: 'clock',
    title: 'Atención 24 Horas',
    description: 'Recepción permanente con atención cordial para llegadas en buses nocturnos o check-in flexible.'
  },
  {
    id: 'bath',
    iconName: 'shower',
    title: 'Baño Privado',
    description: 'Ducha independiente en cada habitación con agua caliente garantizada a cualquier hora.'
  },
  {
    id: 'tv',
    iconName: 'tv',
    title: 'TV por Cable',
    description: 'Televisor con canales de noticias, deportes y películas para tus momentos de relax.'
  },
  {
    id: 'payment',
    iconName: 'wallet',
    title: 'Pago Yape, Plin y Efectivo',
    description: 'Transferencias inmediatas sin comisiones bancarias ni recargos en tu estadía.'
  },
  {
    id: 'wifi',
    iconName: 'wifi',
    title: 'Wi-Fi de Alta Velocidad',
    description: 'Señal óptima en todos los pisos para videollamadas, trabajo remoto o redes sociales.'
  },
  {
    id: 'luggage',
    iconName: 'shield',
    title: 'Custodia de Equipaje',
    description: 'Servicio gratuito de guardavalijas si llegas antes o sales después de tu tour.'
  }
];

export const LANDMARKS: Landmark[] = [
  {
    id: 'sanmartin',
    title: 'Cerca de la Av. San Martín',
    description: 'Avenida principal con cajeros, farmacias, transporte hacia Baños del Inca y restaurantes.',
    iconType: 'map',
    distance: '300 metros (4 min a pie)',
    meters: 300,
    travelTip: 'En la Av. San Martín encuentras cajeros automáticos (BCP, BBVA, Banco de la Nación), boticas 24h y los paraderos de combis directas hacia Baños del Inca (15 min).'
  },
  {
    id: 'plaza',
    title: 'Cerca de la Plaza de Armas de Cajamarca',
    description: 'Catedral, Cuarto del Rescate y Conjunto Monumental Belén a pocos minutos.',
    iconType: 'church',
    distance: '5 min en taxi / 12 min a pie',
    meters: 1100,
    travelTip: 'Ubicación estratégica: estás a 5 minutos en taxi (aprox. S/ 5.00) del corazón histórico, Catedral, Cuarto del Rescate y la gastronomía cajamarquina.'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Carlos M.',
    avatarText: 'CM',
    rating: 5,
    comment: 'Excelente ubicación, muy cerca del terminal de bus. La atención es amable las 24 horas y el agua caliente funciona perfecto.',
    date: 'Hace 2 semanas',
    source: 'Google Reviews'
  },
  {
    id: 'rev-2',
    name: 'Ana P.',
    avatarText: 'AP',
    rating: 5,
    comment: 'Habitaciones cómodas y limpias, perfecto para descansar después de pasear por la ciudad. Relación calidad-precio inmejorable.',
    date: 'Hace 1 mes',
    source: 'Google Reviews'
  },
  {
    id: 'rev-3',
    name: 'Jorge V.',
    avatarText: 'JV',
    rating: 5,
    comment: 'Muy buena opción en Cajamarca. La cama fue muy cómoda, las sábanas impecables y el Wi-Fi funcionó excelente para mis reuniones.',
    date: 'Hace 3 semanas',
    source: 'Google Reviews'
  }
];

export const FAQS = [
  {
    question: '¿A qué hora es el check-in y check-out?',
    answer: 'El check-in es a partir de las 12:00 PM y el check-out es hasta las 11:00 AM. Contamos con recepción las 24 horas, por lo que si llegas de noche o de madrugada siempre habrá alguien para recibirte. Si llegas antes, puedes dejar tu equipaje en custodia sin costo adicional.'
  },
  {
    question: '¿El agua caliente funciona todo el día?',
    answer: 'Sí, contamos con sistema de terma presurizada las 24 horas del día en todas las habitaciones para combatir el clima andino en cualquier momento.'
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos transferencias directas por Yape, Plin, tarjetas Visa, Mastercard y efectivo en Soles en recepción sin recargo alguno.'
  },
  {
    question: '¿Tienen facilidades para estacionamiento?',
    answer: 'En el frontis y en cocheras vigiladas de confianza a pocos metros hay facilidades de aparcamiento las 24 horas. Consúltanos por WhatsApp para orientarte al llegar.'
  },
  {
    question: '¿Cómo reservo directamente por WhatsApp?',
    answer: 'Simplemente haz clic en el botón "Reservar por WhatsApp" de tu habitación favorita o en la barra de búsqueda de disponibilidad. Se abrirá una conversación con los detalles listos para confirmarte de inmediato.'
  }
];

export const generateWhatsAppLink = (message: string, phone: string = HOSTAL_INFO.whatsappNumber) => {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

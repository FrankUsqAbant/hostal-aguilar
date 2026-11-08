import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRooms } from '../utils/hostalStore';
import { cajamarcaNow, dayPhase, DayPhase } from '../utils/dayPhase';

interface HeroProps {
  onOpenBooking: () => void;
}

/** Fondo y luz de cada momento del día. Todos mantienen contraste suficiente para el texto crema. */
const SKY: Record<DayPhase, { gradient: string; glow: string; note: string; caption: string }> = {
  noche: {
    gradient: 'linear-gradient(180deg,#1C1B2B 0%,#2B2740 58%,#4A3340 100%)',
    glow: 'radial-gradient(45% 40% at 75% 35%, rgba(242,182,107,.20), transparent 70%)',
    note: 'recepción abierta',
    caption: 'lista para esta noche'
  },
  amanecer: {
    gradient: 'linear-gradient(180deg,#25233A 0%,#4A3448 55%,#6E4A4E 100%)',
    glow: 'radial-gradient(60% 45% at 80% 85%, rgba(246,170,120,.35), transparent 70%)',
    note: 'amanece · recepción abierta',
    caption: 'lista para tu llegada'
  },
  dia: {
    gradient: 'linear-gradient(180deg,#2E3350 0%,#4B4A63 55%,#7A5A55 100%)',
    glow: 'radial-gradient(55% 50% at 78% 18%, rgba(255,214,150,.38), transparent 70%)',
    note: 'recepción abierta',
    caption: 'lista para tu llegada'
  },
  atardecer: {
    gradient: 'linear-gradient(180deg,#2B2740 0%,#5A3A48 55%,#8A4A3A 100%)',
    glow: 'radial-gradient(60% 45% at 85% 75%, rgba(242,140,80,.38), transparent 70%)',
    note: 'atardece · recepción abierta',
    caption: 'lista para esta noche'
  }
};

/** Hora y momento del día en Cajamarca, actualizados cada 30 s. */
function useCajamarcaClock() {
  const [now, setNow] = useState(cajamarcaNow);
  useEffect(() => {
    const id = window.setInterval(() => setNow(cajamarcaNow()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const rooms = useRooms();
  const { label, hour } = useCajamarcaClock();
  const phase = dayPhase(hour);
  const sky = SKY[phase];

  const minPrice = rooms.length ? Math.min(...rooms.map(r => r.pricePerNight)) : 50;
  const showcase = rooms.find(r => r.type === 'matrimonial') ?? rooms.find(r => r.featured) ?? rooms[0];

  return (
    <section id="inicio" data-phase={phase} className="relative text-cream overflow-hidden bg-night">
      {/* Cielo: una capa por momento del día; solo la actual es visible y cambian con un fundido lento */}
      {(Object.keys(SKY) as DayPhase[]).map(p => (
        <div
          key={p}
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-[2500ms] ease-out"
          style={{ backgroundImage: `${SKY[p].glow}, ${SKY[p].gradient}`, opacity: p === phase ? 1 : 0 }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24 grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-16 items-center">
        <div>
          {label && (
            <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm rounded-full border border-white/15 bg-white/[.06] px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-amber lamp shrink-0" aria-hidden="true" />
              <span>En Cajamarca son las {label}</span>
              <span className="opacity-70">· {sky.note}</span>
            </p>
          )}

          <h1 className="mt-6 text-[clamp(2.4rem,6vw,5rem)] leading-[1.02]">
            Llegues a la hora que llegues,{' '}
            <em className="text-amber">la luz sigue encendida.</em>
          </h1>

          <p className="mt-6 text-lg leading-relaxed max-w-[38ch] text-cream/80">
            Alguien te abre la puerta, el agua sale caliente y la cama ya está lista. En el centro de Cajamarca, las 24 horas.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button type="button" onClick={onOpenBooking} className="btn btn-amber">
              Reservar por WhatsApp <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a href="#habitaciones" className="text-cream/80 hover:text-cream underline underline-offset-4 decoration-cream/30">
              Ver habitaciones · desde S/ {minPrice}
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 max-w-md gap-3 sm:gap-4 text-sm text-cream/70">
            <div>
              <dt className="sr-only">Recepción</dt>
              <dd className="font-serif text-2xl sm:text-3xl text-cream">24 h</dd>
              <dd>recepción</dd>
            </div>
            <div>
              <dt className="sr-only">Agua</dt>
              <dd className="font-serif text-2xl sm:text-3xl text-cream">Caliente</dd>
              <dd>a toda hora</dd>
            </div>
            <div>
              <dt className="sr-only">Precio</dt>
              <dd className="font-serif text-2xl sm:text-3xl text-cream">S/ {minPrice}</dd>
              <dd>la noche</dd>
            </div>
          </dl>
        </div>

        {showcase && (
          <figure className="relative mx-auto w-full max-w-[440px] lg:max-w-[520px]">
            <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] shadow-[0_0_0_10px_rgba(255,255,255,.05),0_40px_90px_-20px_rgba(242,182,107,.35)]">
              <img
                src={showcase.image}
                alt={`${showcase.name} del Hostal Aguilar`}
                className="w-full h-full object-cover"
                fetchPriority="high"
              />
            </div>
            <figcaption className="absolute left-4 bottom-4 rounded-2xl bg-night/85 backdrop-blur px-4 py-3 text-sm">
              <span className="block font-serif text-lg">{showcase.name.replace('Habitación ', '')}</span>
              S/ {showcase.pricePerNight} · {sky.caption}
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
};

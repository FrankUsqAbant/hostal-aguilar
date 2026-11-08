import React from 'react';
import { Phone } from 'lucide-react';
import { useHostalInfo } from '../utils/hostalStore';

interface ContactBannerProps {
  onOpenBooking: () => void;
}

/** Cierre: vuelve la noche del inicio, con la misma luz encendida. */
export const ContactBanner: React.FC<ContactBannerProps> = ({ onOpenBooking }) => {
  const info = useHostalInfo();

  return (
    <section className="bg-[linear-gradient(180deg,var(--color-dusk)_0%,var(--color-night)_100%)] text-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-20 sm:py-28 grid md:grid-cols-[1fr_auto] gap-10 items-end">
        <div>
          <p className="flex items-center gap-2 text-sm text-cream/70">
            <span className="w-2 h-2 rounded-full bg-amber lamp" aria-hidden="true" />
            Recepción abierta ahora mismo
          </p>
          <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.03] max-w-[18ch]">
            ¿Llegas esta noche? <em className="text-amber">Escríbenos y te esperamos.</em>
          </h2>
        </div>
        <div className="flex flex-col gap-3 min-w-[240px]">
          <button type="button" onClick={onOpenBooking} className="btn btn-amber">
            Reservar por WhatsApp
          </button>
          <a href={`tel:${info.primaryPhone.replace(/\s/g, '')}`} className="btn btn-line text-cream">
            <Phone className="w-4 h-4" aria-hidden="true" /> Llamar · {info.primaryPhone}
          </a>
        </div>
      </div>
    </section>
  );
};

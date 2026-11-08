import React from 'react';
import { useServices } from '../utils/hostalStore';
import { ServiceIcon } from './admin/ServiceIcon';

/** "Tu noche en el Hostal Aguilar": los servicios del panel, contados como un recorrido. */
export const ServicesSection: React.FC = () => {
  const { activeServices } = useServices();
  const steps = [...activeServices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section id="servicios" className="bg-cream py-20 sm:py-28 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-20">
        <header className="lg:sticky lg:top-28 self-start">
          <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05]">
            Tu noche en el <em className="text-adobe">Hostal Aguilar.</em>
          </h2>
          <p className="mt-5 text-muted max-w-[34ch]">
            Desde que tocas la puerta hasta que te vas. Todo esto está incluido en el precio de tu habitación.
          </p>
        </header>

        <ol className="relative">
          {steps.map((s, i) => (
            <li key={s.id} className="relative grid grid-cols-[3rem_1fr] gap-5 pb-10 last:pb-0">
              {i < steps.length - 1 && (
                <span className="absolute left-6 top-12 bottom-0 w-px bg-line" aria-hidden="true" />
              )}
              <span className="relative z-10 w-12 h-12 rounded-full bg-paper border border-line flex items-center justify-center">
                <ServiceIcon iconName={s.iconName} className="w-5 h-5 text-adobe" />
              </span>
              <div className="pt-2">
                <h3 className="text-2xl leading-tight">{s.title}</h3>
                <p className="mt-2 text-muted leading-relaxed max-w-[52ch]">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

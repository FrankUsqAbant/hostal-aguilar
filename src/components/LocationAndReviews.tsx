import React, { useState } from 'react';
import { Copy, Check, Navigation, ExternalLink, Star } from 'lucide-react';
import { REVIEWS } from '../data/hostalData';
import { useHostalInfo } from '../utils/hostalStore';
import { getGoogleMapsNavigationUrl, getGoogleMapsEmbedUrl } from '../utils/location';

const Stars: React.FC<{ value: number; className?: string }> = ({ value, className = 'w-4 h-4' }) => (
  <span className="inline-flex gap-0.5" aria-hidden="true">
    {[1, 2, 3, 4, 5].map(n => (
      <Star
        key={n}
        className={`${className} ${n <= Math.round(value) ? 'fill-amber-d text-amber-d' : 'text-line'}`}
      />
    ))}
  </span>
);

export const LocationAndReviews: React.FC = () => {
  const info = useHostalInfo();
  const [copied, setCopied] = useState(false);

  const query = `${info.name} ${info.address}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const directionsUrl = getGoogleMapsNavigationUrl(query);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(info.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* el navegador no permite copiar: la dirección sigue visible */
    }
  };

  return (
    <>
      <section id="ubicacion" className="bg-paper py-20 sm:py-28 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[.85fr_1.15fr] gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05]">
              Aquí te <em className="text-adobe">esperamos.</em>
            </h2>
            <address className="not-italic mt-6 font-serif text-2xl sm:text-3xl leading-snug">
              {info.address}
            </address>
            <p className="mt-3 text-muted">Recepción abierta las 24 horas. Si vienes en taxi, copia la dirección y muéstrasela al conductor.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-adobe">
                <Navigation className="w-4 h-4" aria-hidden="true" /> Cómo llegar
              </a>
              <button type="button" onClick={copyAddress} className="btn btn-line">
                {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                {copied ? 'Dirección copiada' : 'Copiar para el taxi'}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? 'Dirección copiada' : ''}</span>
            </div>

            <figure className="mt-10 hidden lg:block">
              <img
                src={info.facadeImage}
                alt={`Fachada del ${info.name} en ${info.shortAddress}`}
                loading="lazy"
                className="w-full aspect-[16/10] object-cover rounded-2xl"
              />
              <figcaption className="mt-2 text-sm text-muted">La fachada, para reconocernos al llegar.</figcaption>
            </figure>
          </div>

          <div className="rounded-3xl overflow-hidden border border-line bg-cream">
            <iframe
              title={`Mapa: ${info.name}, ${info.address}`}
              src={getGoogleMapsEmbedUrl(query, 17)}
              className="w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] block"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 text-sm font-semibold hover:bg-paper transition-colors"
            >
              Abrir en Google Maps <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="opiniones" className="bg-cream py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05]">
              Lo que cuentan <em className="text-adobe">nuestros huéspedes.</em>
            </h2>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
              aria-label={`Calificación ${info.googleRating} de 5 con ${info.totalReviews} opiniones en Google. Ver todas.`}
            >
              <span className="font-serif text-5xl leading-none">{info.googleRating.toFixed(1)}</span>
              <span className="text-sm text-muted">
                <Stars value={info.googleRating} />
                <span className="block mt-1 group-hover:underline underline-offset-4">
                  {info.totalReviews} opiniones en Google →
                </span>
              </span>
            </a>
          </header>

          {REVIEWS.length > 0 && (
            <div className="grid lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 items-start">
              {/* Opinión destacada, como cita de revista */}
              <figure className="relative">
                <span
                  className="absolute -top-10 -left-2 font-serif text-[9rem] leading-none text-adobe/20 select-none"
                  aria-hidden="true"
                >
                  “
                </span>
                <blockquote className="relative font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.25] text-balance">
                  {REVIEWS[0].comment}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm">
                  <Stars value={REVIEWS[0].rating} />
                  <span>
                    <span className="font-semibold">{REVIEWS[0].name}</span>
                    <span className="text-muted"> · {REVIEWS[0].date}</span>
                  </span>
                </figcaption>
              </figure>

              {/* Las demás, más pequeñas y sin tarjeta */}
              <ul className="divide-y divide-line border-y border-line">
                {REVIEWS.slice(1).map(r => (
                  <li key={r.id} className="py-6">
                    <blockquote className="font-serif text-lg leading-snug">“{r.comment}”</blockquote>
                    <p className="mt-3 flex items-center gap-3 text-sm">
                      <Stars value={r.rating} className="w-3.5 h-3.5" />
                      <span>
                        <span className="font-semibold">{r.name}</span>
                        <span className="text-muted"> · {r.date}</span>
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

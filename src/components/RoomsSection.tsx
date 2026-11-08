import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react';
import { useRooms } from '../utils/hostalStore';
import { Room } from '../types';

interface RoomsSectionProps {
  onSelectRoomForBooking: (room: Room) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({ onSelectRoomForBooking }) => {
  const rooms = useRooms();
  const [active, setActive] = useState<Room | null>(null);
  const [photo, setPhoto] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = (room: Room, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setActive(room);
    setPhoto(0);
  };
  const close = () => {
    setActive(null);
    lastTrigger.current?.focus();
  };

  useEffect(() => {
    if (!active) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const n = active.gallery.length || 1;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') setPhoto(p => (p - 1 + n) % n);
      if (e.key === 'ArrowRight') setPhoto(p => (p + 1) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  const gallery = active ? (active.gallery.length ? active.gallery : [active.image]) : [];

  return (
    <section id="habitaciones" className="bg-paper py-20 sm:py-28 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <header className="grid md:grid-cols-[1fr_auto] gap-6 items-end mb-12 sm:mb-16">
          <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.05] max-w-[16ch]">
            Cuatro habitaciones, <em className="text-adobe">todas con baño propio.</em>
          </h2>
          <p className="text-muted max-w-[34ch] md:text-right">
            Agua caliente, Wi-Fi y TV cable en cada una. Elige según con quién viajas.
          </p>
        </header>

        <ol className="border-t border-line">
          {rooms.map((room, i) => (
            <li
              key={room.id}
              className="grid grid-cols-1 md:grid-cols-[3rem_240px_1fr_auto] gap-5 md:gap-8 py-8 md:py-10 border-b border-line md:items-center"
            >
              <span className="hidden md:block font-serif italic text-adobe text-xl" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={e => open(room, e.currentTarget)}
                className="group relative block overflow-hidden rounded-2xl aspect-[4/3] bg-cream"
                aria-label={`Ver fotos de la ${room.name}`}
              >
                <img
                  src={room.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-ink">
                  <Images className="w-3.5 h-3.5" aria-hidden="true" /> {room.gallery.length || 1} fotos
                </span>
              </button>

              <div>
                <h3 className="text-3xl sm:text-4xl leading-tight">{room.name.replace('Habitación ', '')}</h3>
                <p className="mt-1 font-serif italic text-lg text-adobe">{room.subtitle}</p>
                <p className="mt-3 text-sm font-semibold">
                  {room.capacity} · {room.bedType}
                </p>
                <p className="mt-2 text-sm text-muted leading-relaxed max-w-[56ch]">{room.description}</p>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-4">
                <p className="leading-none">
                  <span className="font-serif text-4xl">S/ {room.pricePerNight}</span>
                  <span className="block text-sm text-muted mt-1 md:text-right">la noche</span>
                </p>
                <button type="button" onClick={() => onSelectRoomForBooking(room)} className="btn btn-adobe !py-3">
                  Reservar
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/70 backdrop-blur-sm p-4"
          onClick={e => e.target === e.currentTarget && close()}
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de la ${active.name}`}
        >
          <div className="bg-paper rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="relative aspect-[16/10] bg-night">
              <img src={gallery[photo]} alt={`${active.name}, foto ${photo + 1} de ${gallery.length}`} className="w-full h-full object-cover" />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-night/70 text-cream flex items-center justify-center"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setPhoto(p => (p - 1 + gallery.length) % gallery.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper/90 text-ink flex items-center justify-center"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhoto(p => (p + 1) % gallery.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper/90 text-ink flex items-center justify-center"
                    aria-label="Foto siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div>
                <h3 className="text-3xl">{active.name}</h3>
                <p className="mt-2 text-muted text-sm max-w-[48ch]">{active.description}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const room = active;
                  setActive(null);
                  onSelectRoomForBooking(room);
                }}
                className="btn btn-adobe shrink-0"
              >
                Reservar · S/ {active.pricePerNight}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

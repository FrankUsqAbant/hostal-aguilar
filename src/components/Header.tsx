import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { generateWhatsAppLink } from '../data/hostalData';
import { useHostalInfo } from '../utils/hostalStore';

interface HeaderProps {
  onOpenBooking: () => void;
}

const navLinks = [
  { href: '#habitaciones', label: 'Habitaciones' },
  { href: '#servicios', label: 'Tu noche aquí' },
  { href: '#ubicacion', label: 'Ubicación' }
];

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const info = useHostalInfo();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? 'bg-paper/95 backdrop-blur-md text-ink border-b border-line' : 'bg-transparent text-cream'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <a href="#inicio" className="flex flex-col leading-none shrink-0" aria-label={`${info.name}, ir al inicio`}>
          <span className="font-serif text-xl sm:text-2xl font-medium">{info.name}</span>
          <span className="text-[11px] mt-1 opacity-70">{info.shortAddress}</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm" aria-label="Principal">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="opacity-80 hover:opacity-100 transition-opacity">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBooking}
            className={`btn btn-line !py-2 !px-4 text-sm ${solid ? 'hover:bg-ink hover:text-paper' : 'hover:bg-cream hover:text-night'}`}
          >
            Reservar
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="menu-movil" className="md:hidden border-t border-line bg-paper px-4 pb-6 pt-2">
          <nav className="flex flex-col" aria-label="Menú móvil">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-2xl py-3 border-b border-line"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className="w-2 h-2 rounded-full bg-amber lamp" aria-hidden="true" />
              Recepción 24 horas
            </span>
            <a href={`tel:${info.primaryPhone.replace(/\s/g, '')}`} className="font-semibold underline underline-offset-4">
              {info.primaryPhone}
            </a>
          </div>
          <a
            href={generateWhatsAppLink('¡Hola Hostal Aguilar! Quiero consultar disponibilidad.', info.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-adobe w-full mt-5"
          >
            Escribir por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};

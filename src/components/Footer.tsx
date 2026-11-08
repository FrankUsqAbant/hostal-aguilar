import React from 'react';
import { BookOpen } from 'lucide-react';
import { useHostalInfo } from '../utils/hostalStore';

type LegalSection = 'privacidad' | 'terminos' | 'reglamento' | 'cancelacion' | 'deslinde';

interface FooterProps {
  onOpenLibroReclamaciones: () => void;
  onOpenLegal: (title: string, section: LegalSection) => void;
  onOpenFaq: () => void;
}

const legalLinks: { label: string; title: string; section: LegalSection }[] = [
  { label: 'Términos y condiciones', title: 'Términos y Condiciones de Reserva', section: 'terminos' },
  { label: 'Cancelación y reembolso', title: 'Políticas de Cancelación y Reembolso', section: 'cancelacion' },
  { label: 'Privacidad de datos', title: 'Políticas de Privacidad', section: 'privacidad' },
  { label: 'Reglamento interno', title: 'Reglamento Interno de Hospedaje', section: 'reglamento' }
];

export const Footer: React.FC<FooterProps> = ({ onOpenLibroReclamaciones, onOpenLegal, onOpenFaq }) => {
  const info = useHostalInfo();
  const linkCls = 'text-cream/70 hover:text-cream transition-colors text-left';

  return (
    <footer className="bg-night text-cream border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-14 pb-24 md:pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-serif text-2xl">{info.name}</p>
            <p className="mt-2 text-sm text-cream/60 max-w-[30ch]">
              Hospedaje con recepción las 24 horas en el centro de Cajamarca.
            </p>
            <p className="mt-5 text-xs text-cream/60 leading-relaxed">
              {info.businessName}
              <br />
              RUC {info.ruc}
            </p>
            <button
              type="button"
              onClick={onOpenLibroReclamaciones}
              className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-white/15 px-4 py-3 text-left hover:bg-white/5 transition-colors"
              aria-label="Abrir Libro de Reclamaciones, conforme a la Ley 29571"
            >
              <BookOpen className="w-5 h-5 text-amber" aria-hidden="true" />
              <span className="text-sm leading-tight">
                Libro de Reclamaciones
                <span className="block text-[11px] text-cream/50">Ley N.º 29571 · Indecopi</span>
              </span>
            </button>
          </div>

          <nav aria-label="Secciones" className="text-sm">
            <p className="font-serif text-lg mb-3">La web</p>
            <ul className="space-y-2">
              <li><a href="#habitaciones" className={linkCls}>Habitaciones</a></li>
              <li><a href="#servicios" className={linkCls}>Tu noche aquí</a></li>
              <li><a href="#ubicacion" className={linkCls}>Ubicación</a></li>
              <li><a href="#opiniones" className={linkCls}>Opiniones</a></li>
              <li><button type="button" onClick={onOpenFaq} className={linkCls}>Preguntas frecuentes</button></li>
            </ul>
          </nav>

          <nav aria-label="Políticas" className="text-sm">
            <p className="font-serif text-lg mb-3">Políticas</p>
            <ul className="space-y-2">
              {legalLinks.map(l => (
                <li key={l.section}>
                  <button type="button" onClick={() => onOpenLegal(l.title, l.section)} className={linkCls}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="font-serif text-lg mb-3">Recepción 24 h</p>
            <address className="not-italic space-y-2 text-cream/70">
              <p>{info.address}</p>
              <p><a href={`tel:${info.primaryPhone.replace(/\s/g, '')}`} className="hover:text-cream">{info.primaryPhone}</a></p>
              {info.secondaryPhone && (
                <p><a href={`tel:${info.secondaryPhone.replace(/\s/g, '')}`} className="hover:text-cream">{info.secondaryPhone}</a></p>
              )}
              <p><a href={`mailto:${info.email}`} className="hover:text-cream break-all">{info.email}</a></p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} {info.name} · Cajamarca, Perú</p>
          <a href="#admin" target="_blank" rel="noopener noreferrer" className="hover:text-cream/70">
            Acceso administración
          </a>
        </div>
      </div>
    </footer>
  );
};

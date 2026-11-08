import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { HOSTAL_INFO } from '../data/hostalData';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  section: 'privacidad' | 'terminos' | 'reglamento' | 'cancelacion' | 'deslinde';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  title,
  section
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto cursor-pointer"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 cursor-default">
        
        {/* Header */}
        <div className="bg-night text-white p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-night flex items-center justify-center text-amber">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber">
                Información Legal & Normativa
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Cerrar modal legal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content depending on section */}
        <div className="p-6 text-sm text-muted space-y-4 max-h-[65vh] overflow-y-auto leading-relaxed">
          {section === 'privacidad' && (
            <>
              <p>
                En <strong>{HOSTAL_INFO.businessName}</strong> (RUC: {HOSTAL_INFO.ruc}), garantizamos la confidencialidad y protección de los datos personales proporcionados por nuestros huéspedes, en estricto cumplimiento de la <strong>Ley Nº 29733 (Ley de Protección de Datos Personales del Perú)</strong> y su reglamento.
              </p>
              <h4 className="font-bold text-ink pt-2">1. Uso de la Información</h4>
              <p>
                Los datos solicitados (nombre, documento de identidad, teléfono, correo) son utilizados únicamente para la gestión de su reserva, emisión de comprobantes electrónicos autorizados por SUNAT, registro de huéspedes obligatorio conforme a la normativa hotelera del MINCETUR y comunicación directa sobre su estadía.
              </p>
              <h4 className="font-bold text-ink pt-2">2. Seguridad de los Datos</h4>
              <p>
                No comercializamos, cedemos ni compartimos sus datos con terceros con fines publicitarios. Sus datos se resguardan bajo protocolos de seguridad físicos y digitales.
              </p>
            </>
          )}

          {section === 'terminos' && (
            <>
              <p>
                Bienvenido a <strong>{HOSTAL_INFO.name}</strong>. Al solicitar una reserva a través de nuestros canales oficiales (WhatsApp, vía telefónica o presencial), el huésped acepta los siguientes términos:
              </p>
              <h4 className="font-bold text-ink pt-2">1. Registro de Huéspedes</h4>
              <p>
                Es requisito indispensable presentar documento de identidad físico y vigente (DNI, Carné de Extranjería o Pasaporte) de todos los ocupantes al momento del ingreso. En caso de menores de edad, deben estar acompañados de sus padres o apoderados con autorización notarial conforme a la ley peruana.
              </p>
              <h4 className="font-bold text-ink pt-2">2. Horarios</h4>
              <p>
                El check-in regular inicia a las 12:00 PM y el check-out es hasta las 11:00 AM. Contamos con recepción las 24 horas para recibir ingresos tardíos previa coordinación.
              </p>
            </>
          )}

          {section === 'reglamento' && (
            <>
              <p>
                Para garantizar la seguridad, tranquilidad y descanso de todos los visitantes, solicitamos cumplir las siguientes pautas de convivencia:
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Silencio y Descanso:</strong> Se debe guardar el debido silencio a partir de las 10:00 PM para favorecer el reposo de todos los huéspedes.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Espacios Libres de Humo:</strong> Queda terminantemente prohibido fumar cigarrillos, vapes o sustancias análogas dentro de las habitaciones.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Cuidado de las Instalaciones:</strong> Los huéspedes son responsables por el cuidado de las toallas, sábanas, llaves y artefactos puestos a su disposición.</span>
                </div>
              </div>
            </>
          )}

          {section === 'cancelacion' && (
            <>
              <h4 className="font-bold text-ink">Políticas de Cancelación y Reprogramación</h4>
              <p>
                Entendemos que los itinerarios de viaje pueden sufrir cambios imprevistos por vuelos o traslados terrestres.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 pt-2">
                <li><strong>Cancelación con 24 horas de anticipación:</strong> Sin penalidad ni cobro de gastos de anulación.</li>
                <li><strong>Reprogramación de fechas:</strong> Sujeta a disponibilidad de habitaciones, sin cobro de penalidad si se comunica antes del mediodía de la fecha de llegada.</li>
                <li><strong>No-show (No presentación):</strong> Si el huésped no se presenta ni avisa a recepción antes de las 6:00 PM de su día de llegada, la reserva podrá ser liberada.</li>
              </ul>
            </>
          )}

          {section === 'deslinde' && (
            <>
              <h4 className="font-bold text-ink">Deslinde de Responsabilidad</h4>
              <p>
                <strong>{HOSTAL_INFO.name}</strong> ofrece custodia gratuita de equipaje en recepción. No obstante, se recomienda mantener objetos de alto valor (joyas, sumas considerables de dinero en efectivo) bajo supervisión personal directa.
              </p>
              <p>
                El hostal no se responsabiliza por retrasos de transporte interprovincial de terceros ajenos a nuestra administración.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-cream p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-night text-white rounded-xl text-xs font-semibold hover:bg-night-2 transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};

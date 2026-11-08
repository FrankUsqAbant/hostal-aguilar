import React, { useState, useEffect } from 'react';
import { X, HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { FAQS, generateWhatsAppLink } from '../data/hostalData';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            <div className="w-10 h-10 rounded-xl bg-night-2 flex items-center justify-center text-amber">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber">
                Atención al Huésped
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                Preguntas Frecuentes
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Cerrar preguntas frecuentes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FAQ Accordion list */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {FAQS.map((faq, index) => {
            const isOpenItem = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-line overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpenItem ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-ink text-sm hover:bg-cream transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpenItem ? (
                    <ChevronUp className="w-4 h-4 text-adobe shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpenItem && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-muted leading-relaxed border-t border-line bg-cream/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer with direct WhatsApp question */}
        <div className="bg-cream p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-muted">
            ¿Tienes otra duda o requerimiento especial?
          </span>
          <a
            href={generateWhatsAppLink('¡Hola Hostal Aguilar! Tengo una consulta sobre el hospedaje en Cajamarca.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};

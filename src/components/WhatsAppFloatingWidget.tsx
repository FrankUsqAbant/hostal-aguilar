import React from 'react';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../data/hostalData';
import { useHostalInfo } from '../utils/hostalStore';

/** Botón flotante de WhatsApp: solo en celular (en escritorio ya está en la barra y en cada sección). */
export const WhatsAppFloatingWidget: React.FC = () => {
  const info = useHostalInfo();
  const url = generateWhatsAppLink(
    '¡Hola Hostal Aguilar! Quiero consultar disponibilidad de habitación en Cajamarca.',
    info.whatsappNumber
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="md:hidden fixed bottom-4 right-4 z-30 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-night/30"
      aria-label="Escribir al Hostal Aguilar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" aria-hidden="true" />
    </a>
  );
};

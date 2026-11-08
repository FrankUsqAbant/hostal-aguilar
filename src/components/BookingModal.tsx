import React, { useState, useEffect } from 'react';
import { X, Calendar, BedDouble, Users, MessageCircle } from 'lucide-react';
import { HOSTAL_INFO, ROOM_CHIP_DETAILS, generateWhatsAppLink } from '../data/hostalData';
import { useRooms, useHostalInfo } from '../utils/hostalStore';
import { Room, RoomType } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoom?: Room | null;
  initialDate?: string;
  initialRoomType?: RoomType;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialRoom,
  initialDate,
  initialRoomType
}) => {
  const rooms = useRooms();
  const info = useHostalInfo();

  // Fechas en hora de Cajamarca (America/Lima), no en UTC
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
  const defaultCheckIn = initialDate || today;

  const calcNextDay = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // Precio y nombre según lo guardado en el panel de administración
  const priceFor = (type: RoomType) =>
    rooms.find(r => r.type === type)?.pricePerNight ?? ROOM_CHIP_DETAILS[type]?.price ?? 0;

  const [checkIn, setCheckIn] = useState<string>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(calcNextDay(defaultCheckIn));
  const [selectedType, setSelectedType] = useState<RoomType>(initialRoomType || (initialRoom?.type as RoomType) || 'doble');
  const [guestName, setGuestName] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialRoom) {
      setSelectedType(initialRoom.type);
    } else if (initialRoomType) {
      setSelectedType(initialRoomType);
    }
    if (initialDate) {
      setCheckIn(initialDate);
      setCheckOut(calcNextDay(initialDate));
    }
  }, [initialRoom, initialDate, initialRoomType]);

  // Handle ESC key and prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate price and title
  const roomMeta = ROOM_CHIP_DETAILS[selectedType] || ROOM_CHIP_DETAILS.doble;
  const selectedRoom = rooms.find(r => r.type === selectedType);
  const roomName = selectedRoom?.name || `Habitación ${roomMeta.label}`;
  const pricePerNight = priceFor(selectedType);

  // Calculate nights
  const checkInD = new Date(`${checkIn}T12:00:00Z`);
  const checkOutD = new Date(`${checkOut}T12:00:00Z`);
  const timeDiff = checkOutD.getTime() - checkInD.getTime();
  const nights = Math.max(1, Math.round(timeDiff / (1000 * 3600 * 24)));
  const estimatedTotal = nights * pricePerNight;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const guestText = guestName ? `Mi nombre es ${guestName}. ` : '';
    const notesText = notes ? ` Nota: ${notes}.` : '';
    const message = `¡Hola Hostal Aguilar! ${guestText}Deseo consultar disponibilidad y reservar en Cajamarca:
• Tipo: ${roomName}
• Llegada: ${checkIn}
• Salida: ${checkOut} (${nights} noche${nights > 1 ? 's' : ''})
• Huéspedes: ${guestsCount} persona(s)
• Total estimado: S/ ${estimatedTotal}.${notesText}
¿Tienen habitación disponible?`;

    window.open(generateWhatsAppLink(message, info.whatsappNumber), '_blank');
    onClose();
  };

  const roomTypesList: RoomType[] = ['simple', 'doble', 'matrimonial', 'romantica'];

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto cursor-pointer"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200 cursor-default">
        
        {/* Modal Header */}
        <div className="bg-night text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold text-amber uppercase tracking-wider">
            Hostal Aguilar • Jr. Los Andes 115
          </span>
          <h3 className="font-serif text-2xl font-bold mt-1 text-white">
            Consultar Disponibilidad
          </h3>
          <p className="text-xs text-cream mt-1">
            Reserva directa sin intermediarios. Confirmación inmediata vía WhatsApp 24/7.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendWhatsApp} className="p-6 space-y-4">
          
          {/* Room Selection 4 Tabs */}
          <div>
            <label className="text-xs font-bold text-ink block mb-2">
              Tipo de Habitación
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roomTypesList.map(type => {
                const isSelected = selectedType === type;
                const meta = ROOM_CHIP_DETAILS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-2 rounded-xl text-center border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-adobe bg-cream font-bold text-adobe ring-1 ring-adobe shadow-2xs'
                        : 'border-line hover:bg-cream text-ink font-medium'
                    }`}
                  >
                    <p className="font-semibold truncate">{meta.label}</p>
                    <p className="text-adobe text-[11px] font-bold mt-0.5">
                      S/ {priceFor(type)}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted mt-1.5 italic">
              {roomMeta.capacity} • {roomMeta.hint}
            </p>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cream rounded-xl p-3 border border-line">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                Llegada (Check-in)
              </label>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (e.target.value >= checkOut) {
                      setCheckOut(calcNextDay(e.target.value));
                    }
                  }}
                  className="bg-transparent text-xs font-semibold text-ink w-full outline-hidden cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="bg-cream rounded-xl p-3 border border-line">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                Salida (Check-out)
              </label>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="date"
                  value={checkOut}
                  min={calcNextDay(checkIn)}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-ink w-full outline-hidden cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          {/* Guest Name & Number of Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">
                Nombre de contacto (opcional)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-line bg-cream focus:bg-white focus:border-adobe outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1">
                Huéspedes
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-line bg-cream focus:bg-white focus:border-adobe outline-hidden"
                >
                  <option value={1}>1 Persona</option>
                  <option value={2}>2 Personas</option>
                  <option value={3}>3 Personas</option>
                  <option value={4}>4 Personas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="text-xs font-bold text-ink block mb-1">
              Notas adicionales (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Llego en bus a las 11:00 PM, requiero factura..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-line bg-cream focus:bg-white focus:border-adobe outline-hidden"
            />
          </div>

          {/* Calculated Summary Box */}
          <div className="p-3.5 bg-cream rounded-2xl border border-line flex items-center justify-between">
            <div>
              <span className="text-xs text-muted block">
                {nights} noche{nights > 1 ? 's' : ''} × S/ {pricePerNight}
              </span>
              <span className="text-xs font-semibold text-ink">
                {roomName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Total Estimado
              </span>
              <span className="text-xl font-black text-adobe">
                S/ {estimatedTotal}
              </span>
            </div>
          </div>

          {/* Submit Button via WhatsApp */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Consultar y Reservar por WhatsApp</span>
          </button>
        </form>

      </div>
    </div>
  );
};

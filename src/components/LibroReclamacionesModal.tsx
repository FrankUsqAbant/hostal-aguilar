import React, { useState, useEffect } from 'react';
import { X, BookOpen, CheckCircle, AlertCircle, FileText, Send } from 'lucide-react';
import { HOSTAL_INFO } from '../data/hostalData';

interface LibroProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LibroReclamacionesModal: React.FC<LibroProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [complaintNumber, setComplaintNumber] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    nombre: '',
    tipoDoc: 'DNI',
    numDoc: '',
    telefono: '',
    email: '',
    direccion: '',
    tipo: 'Reclamo',
    monto: '',
    descripcion: '',
    pedido: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `HA-REC-${Math.floor(100000 + Math.random() * 900000)}`;
    setComplaintNumber(code);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto cursor-pointer"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-6 animate-in fade-in duration-200 cursor-default">
        
        {/* Header */}
        <div className="bg-[#0B1528] text-white p-6 relative border-b border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Cerrar libro de reclamaciones"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-night border border-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                Libro de Reclamaciones Virtual
              </h3>
              <p className="text-xs text-amber mt-0.5">
                Conforme al Código de Protección y Defensa del Consumidor (Ley Nº 29571)
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-700/80 text-[11px] text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
            <span><strong>Razón Social:</strong> {HOSTAL_INFO.businessName}</span>
            <span><strong>RUC:</strong> {HOSTAL_INFO.ruc}</span>
            <span><strong>Establecimiento:</strong> {HOSTAL_INFO.address}</span>
          </div>
        </div>

        {/* Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-ink font-serif">
              ¡Hoja de Reclamación Registrada con Éxito!
            </h4>
            <p className="text-sm text-muted max-w-md mx-auto">
              Su reclamo ha sido recibido conforme a ley. Hemos generado su código de registro único:
            </p>
            <div className="inline-block p-3 px-6 bg-cream rounded-xl border border-line font-mono text-lg font-bold text-adobe">
              {complaintNumber}
            </div>
            <p className="text-xs text-muted max-w-md mx-auto">
              Se ha enviado una copia a su correo <strong>{formData.email}</strong>. De acuerdo al D.S. 011-2011-PCM, atenderemos su solicitud en un plazo máximo de quince (15) días hábiles.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-night text-white text-sm font-semibold rounded-xl hover:bg-night-2 transition-colors"
              >
                Cerrar y Aceptar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-ink">
            
            {/* Disclaimer box */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Reclamo:</strong> Disconformidad relacionada a los bienes o servicios brindados.<br />
                <strong>Queja:</strong> Malestar o descontento respecto a la atención al público.
              </div>
            </div>

            {/* Sección 1: Datos del Consumidor */}
            <div>
              <h5 className="font-bold text-ink uppercase tracking-wider text-[11px] mb-2.5 border-b pb-1">
                1. Identificación del Consumidor Reclamante
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Nombre Completo y Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-cream focus:bg-white focus:border-adobe outline-hidden"
                    placeholder="Ej. María Elena Rojas"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Documento de Identidad *</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.tipoDoc}
                      onChange={(e) => setFormData({...formData, tipoDoc: e.target.value})}
                      className="px-2 py-2 border rounded-lg bg-cream text-xs outline-hidden"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">C.E.</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                    <input
                      type="text"
                      required
                      value={formData.numDoc}
                      onChange={(e) => setFormData({...formData, numDoc: e.target.value})}
                      className="flex-1 px-3 py-2 border rounded-lg bg-cream focus:bg-white focus:border-adobe outline-hidden"
                      placeholder="Número de documento"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-cream focus:bg-white focus:border-adobe outline-hidden"
                    placeholder="Ej. 976 123 456"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-cream focus:bg-white focus:border-adobe outline-hidden"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Identificación del Bien Contratado */}
            <div>
              <h5 className="font-bold text-ink uppercase tracking-wider text-[11px] mb-2.5 border-b pb-1">
                2. Detalle del Servicio Contratado
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tipo de Solicitud *</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-cream text-xs outline-hidden font-medium"
                  >
                    <option value="Reclamo">Reclamo (Disconformidad con el servicio)</option>
                    <option value="Queja">Queja (Atención o trato del personal)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Monto reclamado (S/ opcional)</label>
                  <input
                    type="number"
                    value={formData.monto}
                    onChange={(e) => setFormData({...formData, monto: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-cream focus:bg-white focus:border-adobe outline-hidden"
                    placeholder="S/ 0.00"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Detalle y Pedido */}
            <div>
              <h5 className="font-bold text-ink uppercase tracking-wider text-[11px] mb-2.5 border-b pb-1">
                3. Detalle de la Reclamación y Pedido
              </h5>
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1">Detalle del Reclamo o Queja *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-cream focus:bg-white focus:border-adobe outline-hidden"
                    placeholder="Describa claramente los hechos ocurridos..."
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Pedido Concreto *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.pedido}
                    onChange={(e) => setFormData({...formData, pedido: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-cream focus:bg-white focus:border-adobe outline-hidden"
                    placeholder="Indique qué solución o medida solicita..."
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted hover:bg-cream rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-night text-white rounded-xl font-bold hover:bg-night-2 transition-colors shadow-xs flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Hoja de Reclamación</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

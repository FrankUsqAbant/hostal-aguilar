import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, FileText, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { HOSTAL_INFO } from '../../data/hostalData';
import { getStoredHostalInfo, saveStoredHostalInfo } from '../../utils/hostalStore';

export const AdminGeneralInfo: React.FC = () => {
  const [info, setInfo] = useState<typeof HOSTAL_INFO>(getStoredHostalInfo);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredHostalInfo(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    saveStoredHostalInfo(HOSTAL_INFO);
    setInfo(HOSTAL_INFO);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Datos de Contacto e Información del Hostal
          </h3>
          <p className="text-xs text-slate-500">
            Configuración visible en el encabezado, pie de página y botones de reserva directa
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer Datos</span>
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Información del establecimiento actualizada correctamente.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-900" />
              Teléfono Principal (Recepción 1)
            </label>
            <input
              type="text"
              required
              value={info.primaryPhone}
              onChange={(e) => setInfo({ ...info, primaryPhone: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-900" />
              Teléfono Secundario (Recepción 2)
            </label>
            <input
              type="text"
              value={info.secondaryPhone}
              onChange={(e) => setInfo({ ...info, secondaryPhone: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Número de WhatsApp (con código de país 51)
            </label>
            <input
              type="text"
              required
              value={info.whatsappNumber}
              onChange={(e) => setInfo({ ...info, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-900" />
              Correo Electrónico de Reservas
            </label>
            <input
              type="email"
              required
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-900" />
              Dirección Completa
            </label>
            <input
              type="text"
              required
              value={info.address}
              onChange={(e) => setInfo({ ...info, address: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-900" />
              Razón Social
            </label>
            <input
              type="text"
              required
              value={info.businessName}
              onChange={(e) => setInfo({ ...info, businessName: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-900" />
              RUC
            </label>
            <input
              type="text"
              required
              value={info.ruc}
              onChange={(e) => setInfo({ ...info, ruc: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-900" />
              Horario de Atención
            </label>
            <input
              type="text"
              required
              value={info.schedule}
              onChange={(e) => setInfo({ ...info, schedule: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración General</span>
          </button>
        </div>
      </form>
    </div>
  );
};

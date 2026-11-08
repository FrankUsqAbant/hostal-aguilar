import React, { useState } from 'react';
import { Bed, DollarSign, Users, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { Room } from '../../types';
import { ROOMS } from '../../data/hostalData';
import { getStoredRooms, saveStoredRooms } from '../../utils/hostalStore';

export const AdminRoomsManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(getStoredRooms);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePriceChange = (roomId: string, newPrice: number) => {
    const updated = rooms.map(r => {
      if (r.id === roomId) {
        return { ...r, pricePerNight: Math.max(1, newPrice) };
      }
      return r;
    });
    setRooms(updated);
  };

  const handleCapacityChange = (roomId: string, capacity: string) => {
    const updated = rooms.map(r => {
      if (r.id === roomId) {
        return { ...r, capacity };
      }
      return r;
    });
    setRooms(updated);
  };

  const handleSaveAll = () => {
    saveStoredRooms(rooms);
    setSuccessMsg('Tarifas e información de habitaciones guardadas correctamente.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleReset = () => {
    saveStoredRooms(ROOMS);
    setRooms(ROOMS);
    setSuccessMsg('Habitaciones restauradas a las tarifas oficiales.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Tarifas y Habitaciones
          </h3>
          <p className="text-xs text-slate-500">
            Ajusta los precios por noche en Soles (S/) para temporadas regulares, Carnavales o feriados
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Precios</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Precios</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                  {room.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  ID: {room.id}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">
                {room.name}
              </h4>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                {room.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 mb-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-blue-900" />
                    Precio por Noche (S/)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={room.pricePerNight}
                    onChange={(e) => handlePriceChange(room.id, parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-900" />
                    Capacidad
                  </label>
                  <input
                    type="text"
                    value={room.capacity}
                    onChange={(e) => handleCapacityChange(room.id, e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                {room.bedType}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                Disponible para reservas
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

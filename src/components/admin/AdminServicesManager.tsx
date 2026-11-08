import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  EyeOff,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  X,
  Save,
  AlertTriangle,
  Info
} from 'lucide-react';
import { AdminAmenity, createService, updateService, deleteService, toggleServiceStatus } from '../../utils/adminAuth';
import { AVAILABLE_SERVICE_ICONS, ServiceIcon } from './ServiceIcon';

interface AdminServicesManagerProps {
  services: AdminAmenity[];
  onSaveServices: (services: AdminAmenity[]) => void;
  onResetServices: () => void;
}

export const AdminServicesManager: React.FC<AdminServicesManagerProps> = ({
  services,
  onSaveServices,
  onResetServices
}) => {
  const [editingService, setEditingService] = useState<AdminAmenity | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  // Form state
  const [formData, setFormData] = useState<Partial<AdminAmenity>>({
    title: '',
    description: '',
    iconName: 'wifi',
    category: 'Habitación',
    active: true,
    highlight: false
  });
  const [formError, setFormError] = useState<string | null>(null);

  const categories = Array.from(new Set(services.map(s => s.category || 'General')));

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'todos' || (service.category || 'General') === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      iconName: 'sparkles',
      category: 'Habitación',
      active: true,
      highlight: false
    });
    setFormError(null);
    setEditingService(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (service: AdminAmenity) => {
    setFormData({ ...service });
    setFormError(null);
    setIsCreating(false);
    setEditingService(service);
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setEditingService(null);
    setFormError(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isCreating) {
      const res = createService(formData, services);
      if (!res.success) {
        setFormError(res.error || 'Error al agregar servicio');
        return;
      }
      onSaveServices(res.services);
      handleCloseForm();
    } else if (editingService) {
      const updated: AdminAmenity = {
        ...editingService,
        ...formData,
        id: editingService.id,
        title: formData.title || editingService.title,
        description: formData.description || editingService.description,
        iconName: formData.iconName || editingService.iconName
      };
      const res = updateService(updated, services);
      if (!res.success) {
        setFormError(res.error || 'Error al actualizar servicio');
        return;
      }
      onSaveServices(res.services);
      handleCloseForm();
    }
  };

  const handleToggle = (id: string) => {
    const updated = toggleServiceStatus(id, services);
    onSaveServices(updated);
  };

  const handleDelete = (id: string) => {
    const res = deleteService(id, services);
    if (res.success) {
      onSaveServices(res.services);
      setDeleteConfirmId(null);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const copy = [...services];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onSaveServices(copy);
  };

  const activeCount = services.filter(s => s.active !== false).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Servicios</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{services.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            {services.length}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Activos en la Web</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ocultos / Pausados</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{services.length - activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
          >
            <option value="todos">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetServices}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            title="Restaurar a los 6 servicios originales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </button>
        </div>
      </div>

      {/* Services Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Listado de Servicios Registrados ({filteredServices.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Los cambios se reflejan inmediatamente en la web
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredServices.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No se encontraron servicios que coincidan con la búsqueda.
            </div>
          ) : (
            filteredServices.map((service, index) => (
              <div
                key={service.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  service.active === false ? 'bg-slate-50/60 opacity-70' : 'hover:bg-slate-50/40'
                }`}
              >
                {/* Left: Icon & Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                    <ServiceIcon iconName={service.iconName} className="w-6 h-6 text-blue-900" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">
                        {service.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {service.category || 'General'}
                      </span>
                      {service.active === false ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                          Oculto en Web
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          Visible 24/7
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 max-w-xl">
                      {service.description}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Icono: <span className="font-semibold text-slate-600">{service.iconName}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Order buttons */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 mr-1">
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Subir posición"
                      aria-label="Subir posición"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === services.length - 1}
                      className="p-1.5 hover:bg-white text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Bajar posición"
                      aria-label="Bajar posición"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Active */}
                  <button
                    type="button"
                    onClick={() => handleToggle(service.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      service.active === false
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {service.active === false ? 'Mostrar' : 'Pausar'}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(service)}
                    className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors cursor-pointer"
                    title="Editar servicio"
                    aria-label={`Editar ${service.title}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(service.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Eliminar servicio"
                    aria-label={`Eliminar ${service.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-center text-slate-900 mb-2">
              ¿Eliminar este servicio?
            </h4>
            <p className="text-xs text-slate-600 text-center mb-6">
              Esta acción quitará el servicio de la vista pública en la web de Hostal Aguilar.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editingService) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isCreating ? 'Agregar Nuevo Servicio' : 'Editar Servicio'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Completa la información que verán los huéspedes en la página web
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseForm}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Desayuno Andino Incluido, Estacionamiento Vigilado..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción Detallada *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explica las características y beneficios para el huésped..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.category || 'Habitación'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Habitación, Recepción, Conectividad..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Icono Representativo
                  </label>
                  <select
                    value={formData.iconName || 'wifi'}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
                  >
                    {AVAILABLE_SERVICE_ICONS.map(icon => (
                      <option key={icon.id} value={icon.id}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Icon Visual Selector */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">
                  Selecciona visualmente el icono:
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
                  {AVAILABLE_SERVICE_ICONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: item.id })}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                        formData.iconName === item.id
                          ? 'bg-blue-900 text-white shadow-xs ring-2 ring-blue-600'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                      title={item.name}
                    >
                      <ServiceIcon
                        iconName={item.id}
                        className={`w-5 h-5 ${formData.iconName === item.id ? 'text-white' : 'text-blue-900'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card in Form */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Vista previa de cómo lucirá en la web:
                </p>
                <div className="w-48 mx-auto bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-2.5">
                    <ServiceIcon iconName={formData.iconName || 'wifi'} className="w-6 h-6 text-blue-900" />
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 leading-tight mb-1">
                    {formData.title || 'Título del servicio'}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {formData.description || 'Descripción del servicio para los huéspedes'}
                  </p>
                </div>
              </div>

              {/* Status checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded-sm border-slate-300 text-blue-900 focus:ring-blue-600 w-4 h-4"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Servicio Activo (visible para todos los visitantes)
                  </span>
                </label>
              </div>

              {/* Modal footer buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreating ? 'Guardar Servicio' : 'Actualizar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

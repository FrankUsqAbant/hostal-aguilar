import React, { useState } from 'react';
import {
  Sparkles,
  Bed,
  Lock,
  Phone,
  LogOut,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { useAdminAuth, useServices, useSaveStatus } from '../../utils/hostalStore';
import { AdminLogin } from './AdminLogin';
import { AdminServicesManager } from './AdminServicesManager';
import { AdminSecurityManager } from './AdminSecurityManager';
import { AdminRoomsManager } from './AdminRoomsManager';
import { AdminGeneralInfo } from './AdminGeneralInfo';

type AdminTab = 'servicios' | 'habitaciones' | 'seguridad' | 'contacto' | 'resumen';

interface AdminPortalProps {
  onBackToSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSite }) => {
  const { admin, isAuthenticated, loading, logout, changePassword } = useAdminAuth();
  const saveStatus = useSaveStatus();
  const { services, updateServices, resetServicesToDefaults } = useServices();
  const [activeTab, setActiveTab] = useState<AdminTab>('servicios');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-300 flex items-center justify-center text-sm" role="status">
        Verificando sesión…
      </div>
    );
  }

  // If not authenticated, show dedicated login screen
  if (!isAuthenticated) {
    return <AdminLogin onBackToSite={onBackToSite} />;
  }

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'servicios',
      label: 'Nuestros Servicios',
      icon: <Sparkles className="w-4 h-4" />,
      badge: `${services.filter(s => s.active !== false).length} activos`
    },
    {
      id: 'habitaciones',
      label: 'Habitaciones y Tarifas',
      icon: <Bed className="w-4 h-4" />
    },
    {
      id: 'seguridad',
      label: 'Seguridad y Contraseña',
      icon: <Lock className="w-4 h-4" />
    },
    {
      id: 'contacto',
      label: 'Contacto y Recepción',
      icon: <Phone className="w-4 h-4" />
    },
    {
      id: 'resumen',
      label: 'Resumen General',
      icon: <LayoutDashboard className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-900 selection:text-white">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-white">
                  Hostal Aguilar
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Panel ADM
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Sistema de Control y Gestión • Cajamarca
              </p>
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">
                {admin.email}
              </p>
              <p className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Administrador Activo
              </p>
            </div>

            <div className="h-6 w-px bg-slate-700" />

            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Ver Sitio Web</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
            <div className="p-3 bg-slate-800/80 rounded-xl mb-3 text-xs">
              <p className="text-slate-400">Conectado como:</p>
              <p className="font-semibold text-white">{admin.email}</p>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {tab.icon}
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onBackToSite}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Sitio Web</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Secondary Bar: Tab Navigation on Desktop */}
      <nav className="bg-white border-b border-slate-200/80 shadow-2xs sticky top-16 z-20 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 py-3.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-blue-900 text-blue-900 bg-blue-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Los cambios se publican al guardar</span>
          </div>
        </div>
      </nav>

      {/* Estado de publicación de los cambios */}
      {saveStatus && (
        <div
          role={saveStatus.state === 'error' ? 'alert' : 'status'}
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-full px-5 py-2.5 text-xs font-semibold shadow-lg ${
            saveStatus.state === 'error'
              ? 'bg-red-700 text-white'
              : saveStatus.state === 'saving'
                ? 'bg-slate-800 text-white'
                : 'bg-emerald-700 text-white'
          }`}
        >
          {saveStatus.state === 'saving' && 'Publicando cambios…'}
          {saveStatus.state === 'saved' && 'Cambios publicados en la web'}
          {saveStatus.state === 'error' && saveStatus.message}
        </div>
      )}

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'servicios' && (
          <AdminServicesManager
            services={services}
            onSaveServices={updateServices}
            onResetServices={resetServicesToDefaults}
          />
        )}

        {activeTab === 'habitaciones' && (
          <AdminRoomsManager />
        )}

        {activeTab === 'seguridad' && (
          <AdminSecurityManager
            admin={admin}
            onChangePassword={changePassword}
          />
        )}

        {activeTab === 'contacto' && (
          <AdminGeneralInfo />
        )}

        {activeTab === 'resumen' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Panel Operativo • Hostal Aguilar
              </h3>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Desde esta pestaña administrativa independiente puedes gestionar en tiempo real los servicios que se muestran al público, modificar tarifas de habitaciones, ajustar teléfonos y enlaces de WhatsApp, y actualizar tu contraseña de acceso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('servicios')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Gestión de Servicios
                </h4>
                <p className="text-xs text-slate-500">
                  {services.length} servicios registrados ({services.filter(s => s.active !== false).length} activos). Haz clic para agregar, editar o reordenar.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('habitaciones')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold mb-3">
                  <Bed className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Habitaciones y Tarifas
                </h4>
                <p className="text-xs text-slate-500">
                  Tarifas Simple (S/50), Doble (S/80), Matrimonial (S/90) y Romántica (S/110).
                </p>
              </div>

              <div
                onClick={() => setActiveTab('seguridad')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Seguridad y Contraseña
                </h4>
                <p className="text-xs text-slate-500">
                  Actualiza tu contraseña de acceso y correo oficial ({admin.email}).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Hostal Aguilar Cajamarca • Panel de Administración Seguro</p>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, Save, Info } from 'lucide-react';
import { validatePasswordChange } from '../../utils/adminAuth';
import type { AdminUser } from '../../utils/hostalStore';

interface AdminSecurityManagerProps {
  admin: AdminUser;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<string | null>;
}

const inputCls =
  'w-full pl-3.5 pr-10 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white';

const PasswordField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}> = ({ label, value, onChange, placeholder, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
        <div className="relative mt-1">
          <input
            type={show ? 'text' : 'password'}
            required
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </label>
    </div>
  );
};

export const AdminSecurityManager: React.FC<AdminSecurityManagerProps> = ({ admin, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    if (!validation.success) {
      setError(validation.error || 'Revisa los datos ingresados.');
      return;
    }

    setBusy(true);
    const result = await onChangePassword(currentPassword, newPassword);
    setBusy(false);

    if (result) {
      setError(result);
      return;
    }
    setSuccess('Contraseña actualizada. Úsala en tu próximo ingreso.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Seguridad y acceso</h3>
          <p className="text-xs text-slate-500">
            Sesión iniciada como <span className="font-semibold text-slate-700">{admin.email}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-blue-900" />
            <h4 className="text-sm font-bold text-slate-900">Cambiar contraseña</h4>
          </div>

          {success && (
            <p role="status" className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </p>
          )}
          {error && (
            <p role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordField
              label="Contraseña actual *"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="Tu contraseña actual"
              autoComplete="current-password"
            />
            <PasswordField
              label="Nueva contraseña *"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirmar nueva contraseña *"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{busy ? 'Actualizando…' : 'Actualizar contraseña'}</span>
            </button>
          </form>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-xs text-slate-600 space-y-3 self-start">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Info className="w-4 h-4 text-blue-900" />
            <span>Cómo funciona el acceso</span>
          </div>
          <p>Las cuentas y contraseñas se guardan en Supabase, cifradas. La web nunca guarda tu contraseña.</p>
          <p>Solo los correos autorizados en la tabla <span className="font-mono">admins</span> pueden editar el contenido.</p>
          <p>Para agregar otro administrador o cambiar el correo de acceso, se hace desde el panel de Supabase (Authentication y tabla admins).</p>
        </div>
      </div>
    </div>
  );
};

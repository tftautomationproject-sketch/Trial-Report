import React, { useState } from 'react';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSCODE = '0096';

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSCODE) {
      setError(false);
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1e3a8a] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1e3a8a]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                เข้าสู่โหมด Admin
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Admin Authentication
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>กรุณากรอกรหัสผ่านเพื่อเข้าถึงสิทธิ์ Admin</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                maxLength={10}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-center font-mono text-lg tracking-widest transition focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-500 ring-2 ring-red-200 bg-red-50/50 text-red-900'
                    : 'border-slate-300 focus:border-[#1e3a8a] focus:ring-blue-100 bg-slate-50/50'
                }`}
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-red-600 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded border-slate-300 text-[#1e3a8a] focus:ring-blue-500"
              />
              <span>แสดงรหัส</span>
            </label>
            <span className="text-slate-400">Security Protected</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={!password.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2b5c] hover:bg-[#1e3a8a] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-900/20 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>ยืนยันเข้าสู่ระบบ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

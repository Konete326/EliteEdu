import React from 'react';
import { X, Mail, Phone, MapPin, ShieldCheck, User } from 'lucide-react';

const AdminProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Admin Profile</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center text-center border-b border-line dark:border-line-dark">
          <div className="relative mb-3">
            {user.photo_url || user.avatar_url ? (
              <img src={user.photo_url || user.avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-xs" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl border-2 border-primary/20 shadow-xs">
                {initials}
              </div>
            )}
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface dark:border-surface-dark" />
          </div>
          <h4 className="text-base font-bold text-ink dark:text-ink-dark">{user.name}</h4>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
              {user.role || 'Admin'}
            </span>
            <span className="text-xs text-ink-muted">• {user.designation || 'Administrator'}</span>
          </div>
        </div>

        <div className="p-4 space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
            <Mail className="w-4 h-4 text-ink-muted shrink-0" />
            <div className="min-w-0 text-left">
              <span className="text-[10px] text-ink-muted block font-medium">Email Address</span>
              <span className="font-semibold text-ink dark:text-ink-dark truncate block">{user.email || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
            <Phone className="w-4 h-4 text-ink-muted shrink-0" />
            <div className="min-w-0 text-left">
              <span className="text-[10px] text-ink-muted block font-medium">Contact Number</span>
              <span className="font-semibold text-ink dark:text-ink-dark">{user.phone || user.mobile || 'Not provided'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
            <MapPin className="w-4 h-4 text-ink-muted shrink-0" />
            <div className="min-w-0 text-left">
              <span className="text-[10px] text-ink-muted block font-medium">Campus</span>
              <span className="font-semibold text-ink dark:text-ink-dark">{user.campus_name || user.campus?.name || 'All Campuses (Central)'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="min-w-0 text-left">
              <span className="text-[10px] text-ink-muted block font-medium">Account Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active & Verified</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-surface-secondary dark:bg-surface-secondary-dark border-t border-line dark:border-line-dark flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileModal;

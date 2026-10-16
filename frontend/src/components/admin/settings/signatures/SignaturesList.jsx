import { useState } from 'react';
import { CheckCircle2, Trash2, Stamp, PenTool, Star } from 'lucide-react';
import SignatureDeleteModal from './SignatureDeleteModal';

const SignaturesList = ({ signatures, onSetDefault, onDelete }) => {
  const [tab, setTab] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = signatures.filter((s) => {
    if (tab === 'stamps') return s.is_stamp;
    if (tab === 'pens') return !s.is_stamp;
    return true;
  });

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text dark:text-text-dark">Saved Signatures & Stamps Library</h3>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">Manage active document signers and official seals</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface-alt dark:bg-white/5 rounded-xl border border-line dark:border-white/10 text-xs">
          {[
            { id: 'all', label: `All (${signatures.length})` },
            { id: 'pens', label: `Signatures (${signatures.filter((s) => !s.is_stamp).length})` },
            { id: 'stamps', label: `Stamps (${signatures.filter((s) => s.is_stamp).length})` }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${tab === t.id ? 'bg-primary text-white shadow-xs' : 'text-text-muted hover:text-text'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-line dark:border-white/10 rounded-xl p-8 text-center space-y-2">
          <PenTool className="w-8 h-8 text-text-muted/40 mx-auto" />
          <p className="text-xs font-medium text-text-muted">No signatures or stamps found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item._id}
              className={`relative border rounded-xl p-3 space-y-3 transition-all ${item.is_default ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : 'border-line dark:border-white/10 bg-white/40 dark:bg-white/5'}`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md flex items-center gap-1 ${item.is_stamp ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                  {item.is_stamp ? <Stamp className="w-3 h-3" /> : <PenTool className="w-3 h-3" />}
                  {item.is_stamp ? 'OFFICIAL STAMP' : 'SIGNATURE'}
                </span>
                {item.is_default && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> DEFAULT
                  </span>
                )}
              </div>

              <div className="h-28 rounded-lg bg-white border border-line flex items-center justify-center p-2 overflow-hidden shadow-2xs">
                <img src={item.image_url} alt={item.label} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-text dark:text-text-dark truncate" title={item.label}>{item.label}</h4>
                <p className="text-[10px] text-text-muted dark:text-text-muted-dark">Created by {item.user_id?.name || 'Admin'} • {item.type}</p>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-line dark:border-white/10">
                {!item.is_default && (
                  <button
                    type="button"
                    onClick={() => onSetDefault(item._id)}
                    className="flex-1 py-1 text-[11px] font-medium rounded-lg border border-line dark:border-white/10 hover:border-primary text-text-muted hover:text-primary flex items-center justify-center gap-1 transition-colors"
                  >
                    <Star className="w-3 h-3" /> Set Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="p-1 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors ml-auto"
                  title="Delete signature"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SignatureDeleteModal target={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={onDelete} />
    </div>
  );
};

export default SignaturesList;

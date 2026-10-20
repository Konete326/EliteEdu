import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

const ChatRichCardBubble = ({ message, onAction }) => {
  const [submitting, setSubmitting] = useState(false);
  const card = message.card_payload;
  if (!card || card.card_type === 'None') return null;

  const head = card.head || {};
  const fields = card.fields || [];
  const actions = card.actions || [];
  const actionTaken = card.action_taken?.status;

  const handleActionClick = async (val) => {
    if (submitting || actionTaken) return;
    setSubmitting(true);
    try {
      await onAction(message._id, val);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-xl overflow-hidden border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs my-1">
      <div
        className="px-3.5 py-2.5 flex items-center justify-between text-white"
        style={{ backgroundColor: head.accent_color && head.accent_color !== '#4f46e5' ? head.accent_color : 'var(--color-primary, #0d9488)' }}
      >
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <h4 className="text-xs font-bold truncate">{head.title || 'Interactive Notice'}</h4>
          </div>
          {head.sub_title && <p className="text-[10px] text-white/80 truncate">{head.sub_title}</p>}
        </div>
        {head.status_badge && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white shrink-0 uppercase tracking-wider">
            {head.status_badge}
          </span>
        )}
      </div>

      {card.body?.text && (
        <div className="p-3 text-xs text-ink dark:text-ink-dark border-b border-line dark:border-line-dark break-words" title={card.body.text}>
          {card.body.text}
        </div>
      )}

      {fields.length > 0 && (
        <div className="p-3 grid grid-cols-2 gap-2 text-xs border-b border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50">
          {fields.map((f, idx) => (
            <div key={idx} className="min-w-0">
              <span className="text-[10px] uppercase font-semibold text-ink-muted block tracking-wider">{f.key}</span>
              <p className="text-xs font-medium text-ink dark:text-ink-dark break-words" title={f.value || ''}>{f.value || '—'}</p>
            </div>
          ))}
        </div>
      )}

      <div className="p-2.5 bg-surface dark:bg-surface-dark flex items-center justify-end gap-2">
        {actionTaken ? (
          <div className="w-full flex items-center justify-between py-1 px-2 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-xs">
            <span className="text-[11px] text-ink-muted font-medium">Resolution:</span>
            <div className="flex items-center gap-1 font-bold">
              {actionTaken === 'Approved' ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              ) : actionTaken === 'Rejected' ? (
                <span className="text-rose-600 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Rejected
                </span>
              ) : (
                <span className="text-primary flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Acknowledged
                </span>
              )}
              {card.action_taken?.by_name && (
                <span className="text-[10px] text-ink-muted font-normal">by {card.action_taken.by_name}</span>
              )}
            </div>
          </div>
        ) : actions.length > 0 ? (
          actions.map((act) => {
            const isDanger = act.style === 'Danger';
            const isPrimary = act.style === 'Primary';
            return (
              <button
                key={act.action_value}
                type="button"
                disabled={submitting}
                onClick={() => handleActionClick(act.action_value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                  isDanger
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500'
                    : isPrimary
                    ? 'bg-primary hover:bg-primary-hover text-white shadow-xs'
                    : 'bg-surface-secondary hover:bg-surface-secondary/80 text-ink dark:text-ink-dark border border-line dark:border-line-dark'
                }`}
              >
                {act.label}
              </button>
            );
          })
        ) : null}
      </div>
    </div>
  );
};

export default ChatRichCardBubble;

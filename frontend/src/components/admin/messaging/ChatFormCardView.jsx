import React, { useState } from 'react';
import { CheckCircle2, Send, FileCheck } from 'lucide-react';

const ChatFormCardView = ({ message, card, currentUserId, onFormSubmit }) => {
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const mySub = card.submissions?.find((s) => String(s.user_id) === String(currentUserId));
  const isSubmitted = Boolean(mySub);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || isSubmitted || card.is_closed) return;
    setSubmitting(true);
    try {
      await onFormSubmit(message._id, { values });
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mt-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs space-y-1">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Response Submitted</span>
        </div>
        <p className="text-[11px] text-ink-muted">
          Total responses: {card.submissions?.length || 1}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 mt-2.5">
      {card.form_fields?.map((field) => (
        <div key={field.field_id} className="space-y-1">
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>

          {field.field_type === 'dropdown' ? (
            <select
              value={values[field.field_id] || ''}
              required={field.required}
              onChange={(e) => setValues({ ...values, [field.field_id]: e.target.value })}
              className="w-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl px-2.5 py-1.5 text-xs outline-none"
            >
              <option value="">Select option...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.field_type === 'date_picker' ? (
            <input
              type="date"
              value={values[field.field_id] || ''}
              required={field.required}
              onChange={(e) => setValues({ ...values, [field.field_id]: e.target.value })}
              className="w-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl px-2.5 py-1.5 text-xs outline-none"
            />
          ) : (
            <input
              type="text"
              value={values[field.field_id] || ''}
              required={field.required}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              onChange={(e) => setValues({ ...values, [field.field_id]: e.target.value })}
              className="w-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl px-2.5 py-1.5 text-xs outline-none"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-2 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
      >
        <Send className="w-3.5 h-3.5" />
        {submitting ? 'Submitting...' : 'Submit Response'}
      </button>

      <div className="flex items-center gap-1 text-[10px] text-ink-muted justify-end pt-0.5">
        <FileCheck className="w-3 h-3" />
        <span>{card.submissions?.length || 0} responses recorded</span>
      </div>
    </form>
  );
};

export default ChatFormCardView;

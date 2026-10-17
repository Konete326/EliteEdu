import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pin, Pencil, PhoneCall, UserPlus, Trash2 } from 'lucide-react';

export default function CrmLeadRowActions({
  lead,
  onTogglePin,
  onOpenFollowUp,
  onOpenConvert,
  onOpenDelete
}) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onTogglePin(lead._id)}
        title={lead.is_pinned ? 'Unpin Lead' : 'Pin to top'}
        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
          lead.is_pinned
            ? 'bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700'
            : 'border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-text-primary'
        }`}
      >
        <Pin className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => navigate(`/admin/crm/inquiries/${lead._id}/edit`)}
        title="Edit Lead"
        className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-primary cursor-pointer transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onOpenFollowUp(lead)}
        title="Log Follow-up"
        className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-emerald-600 cursor-pointer transition-colors"
      >
        <PhoneCall className="w-3.5 h-3.5" />
      </button>

      {!lead.is_converted && (
        <button
          type="button"
          onClick={() => onOpenConvert(lead)}
          title="Convert to Enrolled Student"
          className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-primary/10 text-text-muted hover:text-primary cursor-pointer transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={() => onOpenDelete(lead)}
        title="Delete Lead"
        className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-bad/10 text-text-muted hover:text-bad cursor-pointer transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

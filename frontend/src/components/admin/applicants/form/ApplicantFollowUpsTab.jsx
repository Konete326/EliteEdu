import { useState } from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';

const STATUS_OPTIONS = [
  'Interview Scheduled',
  'Interview Conducted',
  'Shortlisted',
  'Offer Sent',
  'Salary Negotiated',
  'Pending Documentation'
];

const ApplicantFollowUpsTab = ({ formData, onAddFollowUp, onRemoveFollowUp }) => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('Interview Scheduled');
  const [followedBy, setFollowedBy] = useState('HR Admin');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    onAddFollowUp({
      note: note.trim(),
      status,
      followed_up_by: followedBy.trim(),
      created_at: new Date()
    });
    setNote('');
  };

  return (
    <div className="p-6 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-sm space-y-6">
      <h3 className="text-sm font-bold text-ink dark:text-ink-dark pb-2 border-b border-line dark:border-white/10">
        Follow-up Logs & Interview Notes
      </h3>

      <div className="p-4 rounded-xl border border-line/60 dark:border-white/5 bg-surface-secondary/20 dark:bg-white/[0.01] space-y-3">
        <h4 className="text-xs font-bold text-ink dark:text-ink-dark">Add New Follow-up Note</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1">Status / Milestone</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1">Followed Up By</label>
            <input
              type="text"
              value={followedBy}
              onChange={(e) => setFollowedBy(e.target.value)}
              placeholder="Admin / Interviewer Name"
              className="w-full px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium"
            />
          </div>
        </div>

        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Interview feedback, remarks, negotiation notes..."
          className="w-full px-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Follow-up</span>
          </button>
        </div>
      </div>

      {formData.follow_ups?.length > 0 ? (
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-ink dark:text-ink-dark block">Timeline History ({formData.follow_ups.length})</span>
          {formData.follow_ups.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-line dark:border-white/5 bg-surface-secondary/30 dark:bg-white/[0.02] flex items-start justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary">
                    {item.status}
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    by {item.followed_up_by} • {new Date(item.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-ink dark:text-ink-dark font-medium">{item.note}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFollowUp(idx)}
                className="p-1 rounded-lg text-ink-muted hover:text-bad transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-line dark:border-white/10 rounded-2xl text-ink-muted text-xs">
          <MessageSquare className="w-6 h-6 mx-auto mb-1 opacity-40" />
          <span>No follow-up notes recorded yet.</span>
        </div>
      )}
    </div>
  );
};

export default ApplicantFollowUpsTab;

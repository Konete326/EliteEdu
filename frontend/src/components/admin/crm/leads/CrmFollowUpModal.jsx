import React, { useState } from 'react';
import { PhoneCall, X } from 'lucide-react';
import api from '../../../../services/api';

export default function CrmFollowUpModal({ isOpen, onClose, lead, onSaved }) {
  const [channel, setChannel] = useState('Call');
  const [outcome, setOutcome] = useState('Contacted');
  const [notes, setNotes] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [leadStatus, setLeadStatus] = useState(lead?.lead_status || 'Contacted');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    try {
      setSaving(true);
      const res = await api.post(`/crm/leads/${lead._id}/follow-up`, {
        channel, outcome, notes, next_date: nextDate || null, lead_status: leadStatus
      });
      if (res.data?.success) {
        if (onSaved) onSaved(res.data.lead);
        onClose();
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Log Follow-up: {lead.student_name}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-text-muted hover:bg-hover"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Channel *</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent">
                <option value="Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Visit">Campus Visit</option>
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Outcome *</label>
              <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent">
                <option value="Contacted">Contacted</option>
                <option value="Busy / No Answer">Busy / No Answer</option>
                <option value="Callback Requested">Callback Requested</option>
                <option value="Campus Tour Scheduled">Campus Tour</option>
                <option value="Test Scheduled">Test Scheduled</option>
                <option value="Not Interested">Not Interested</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Next Follow-up Date</label>
              <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Update Status</label>
              <select value={leadStatus} onChange={(e) => setLeadStatus(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent">
                {['New Inquiry', 'Contacted', 'Visit Scheduled', 'Test / Interview', 'Offer Made', 'Enrolled', 'Lost'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Conversation Notes *</label>
            <textarea required rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Record parent response, discussion..." className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-xl border border-line text-xs">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs cursor-pointer">
              {saving ? 'Saving...' : 'Save Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Phone, MessageCircle, Send, Calendar, Clock } from 'lucide-react';
import api from '../../../../services/api';

export default function CrmFollowUpDetailPane({ lead, onFollowUpLogged }) {
  const [channel, setChannel] = useState('Call');
  const [outcome, setOutcome] = useState('Contacted');
  const [notes, setNotes] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [saving, setSaving] = useState(false);

  if (!lead) {
    return (
      <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark p-8 text-center text-xs text-text-muted">
        Select a prospective inquiry from the queue to view contact timeline and log conversations.
      </div>
    );
  }

  const phoneNum = `${lead.contact_country_code || '+92'}${lead.contact_number}`.replace(/[^0-9+]/g, '');
  const waNum = phoneNum.replace('+', '');

  const handleLog = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    try {
      setSaving(true);
      const res = await api.post(`/crm/leads/${lead._id}/follow-up`, {
        channel, outcome, notes, next_date: nextDate || null
      });
      if (res.data?.success) {
        setNotes('');
        setNextDate('');
        if (onFollowUpLogged) onFollowUpLogged(res.data.lead);
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark p-5 space-y-4 shadow-xs">
      <div className="flex items-start justify-between pb-3 border-b border-line dark:border-line-dark">
        <div>
          <h3 className="font-bold text-sm text-text-primary dark:text-text-primary-dark">{lead.student_name}</h3>
          <p className="text-xs text-text-muted">Parent: {lead.father_name || 'N/A'} • {lead.grade_id?.name || lead.class_name}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${phoneNum}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs"
          >
            <Phone size={12} /> Call
          </a>
          <a
            href={`https://wa.me/${waNum}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-2xs"
          >
            <MessageCircle size={12} /> WhatsApp
          </a>
        </div>
      </div>

      <form onSubmit={handleLog} className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/30 space-y-2.5 text-xs">
        <span className="font-bold text-text-primary dark:text-text-primary-dark">Quick Log Conversation</span>
        <div className="grid grid-cols-2 gap-2">
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className="px-2 py-1.5 rounded-lg border border-line dark:border-line-dark bg-transparent">
            <option value="Call">Phone Call</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Visit">Campus Visit</option>
          </select>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="px-2 py-1.5 rounded-lg border border-line dark:border-line-dark bg-transparent">
            <option value="Contacted">Contacted</option>
            <option value="Callback Requested">Callback</option>
            <option value="Tour Scheduled">Tour Scheduled</option>
            <option value="Not Interested">Not Interested</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="w-1/2 px-2 py-1.5 rounded-lg border border-line dark:border-line-dark bg-transparent text-xs" />
          <input required type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Conversation feedback..." className="flex-1 px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-transparent text-xs" />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-xs cursor-pointer">
            <Send size={12} /> {saving ? 'Logging...' : 'Log Follow-up'}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Conversation History</h4>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {(!lead.follow_ups || lead.follow_ups.length === 0) ? (
            <p className="text-xs text-text-muted py-4 text-center">No call notes logged yet.</p>
          ) : (
            lead.follow_ups.slice().reverse().map((f, i) => (
              <div key={i} className="p-2.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-text-primary dark:text-text-primary-dark">
                  <span>{f.channel} • {f.outcome}</span>
                  <span className="text-[10px] text-text-muted font-normal">{new Date(f.follow_up_date || Date.now()).toLocaleDateString()}</span>
                </div>
                <p className="text-text-secondary">{f.notes}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

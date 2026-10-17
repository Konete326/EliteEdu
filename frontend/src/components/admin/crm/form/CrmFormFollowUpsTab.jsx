import React, { useState } from 'react';
import { PhoneCall, Calendar, Plus, MessageSquare } from 'lucide-react';

export default function CrmFormFollowUpsTab({ followUps = [], onChange }) {
  const [channel, setChannel] = useState('Call');
  const [outcome, setOutcome] = useState('Contacted');
  const [notes, setNotes] = useState('');
  const [nextDate, setNextDate] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    const entry = {
      channel,
      outcome,
      notes: notes.trim(),
      next_date: nextDate || null,
      follow_up_date: new Date()
    };
    onChange('follow_ups', [...followUps, entry]);
    if (nextDate) onChange('next_follow_up', nextDate);
    setNotes('');
    setNextDate('');
  };

  return (
    <div className="bg-surface dark:bg-surface-dark p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4 max-w-4xl">
      <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2 border-b border-line dark:border-line-dark pb-2">
        <PhoneCall className="w-4 h-4 text-primary" /> Follow-up Log & Timeline
      </h3>

      <form onSubmit={handleAdd} className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/20 space-y-3">
        <span className="text-xs font-bold text-text-primary dark:text-text-primary-dark">Schedule Next Follow-up</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Channel</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent">
              <option value="Call">Phone Call</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Visit">Visit</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Outcome</label>
            <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent">
              <option value="Contacted">Contacted</option>
              <option value="Busy">Busy</option>
              <option value="Tour Scheduled">Tour Scheduled</option>
              <option value="Test Scheduled">Test Scheduled</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Next Follow-up Date</label>
            <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Notes *</label>
          <input required type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Conversation feedback or discussion points..." className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-transparent" />
        </div>
        <div className="flex justify-end pt-1">
          <button type="submit" className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs cursor-pointer">
            <Plus size={13} /> Add Follow-up
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {followUps.length === 0 ? (
          <p className="text-xs text-text-muted py-6 text-center">No follow-ups recorded yet.</p>
        ) : (
          followUps.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary dark:text-text-primary-dark">{item.channel} • {item.outcome}</span>
                  <span className="text-[11px] text-text-muted">{new Date(item.follow_up_date || Date.now()).toLocaleDateString()}</span>
                </div>
                <p className="text-text-secondary">{item.notes}</p>
                {item.next_date && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold">
                    <Calendar className="w-3 h-3" /> Next: {new Date(item.next_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

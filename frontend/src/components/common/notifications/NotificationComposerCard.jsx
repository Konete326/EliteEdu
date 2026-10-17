import { useState } from 'react';
import { Send, BellRing } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { getApiBase } from '../../../utils/apiBase';
import NotificationTemplatesBar from './NotificationTemplatesBar';

const PRIORITIES = ['Normal', 'Important', 'Urgent'];
const TYPES = ['Announcement', 'Academic', 'Attendance', 'Promotion', 'Admission', 'Security', 'System'];
const AUDIENCES = ['All', 'Admins', 'Teachers', 'Students'];

const NotificationComposerCard = ({ campuses = [], token, onCreated }) => {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Announcement');
  const [priority, setPriority] = useState('Normal');
  const [targetAudience, setTargetAudience] = useState('All');
  const [campusId, setCampusId] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [sending, setSending] = useState(false);

  const applyTemplate = (tmpl) => {
    setTitle(tmpl.title);
    setMessage(tmpl.message);
    setType(tmpl.type);
    setPriority(tmpl.priority);
    setTargetAudience(tmpl.target_audience);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      return toast.warning('Title and Message are required');
    }
    setSending(true);
    try {
      const res = await fetch(`${getApiBase()}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, message, type, priority,
          target_audience: targetAudience,
          campus_id: campusId || null,
          action_url: actionUrl
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Broadcast failed');
      toast.success('Notification broadcasted successfully!', 'Broadcast Sent');
      setTitle('');
      setMessage('');
      setActionUrl('');
      if (onCreated) onCreated(data.notification);
    } catch (err) {
      toast.error(err.message, 'Broadcast Failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-line dark:border-white/10 pb-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <BellRing className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Broadcast Notification</h3>
          <p className="text-[11px] text-ink-muted">Send alerts to faculty, students, or entire campus</p>
        </div>
      </div>

      <NotificationTemplatesBar onSelectTemplate={applyTemplate} />

      <form onSubmit={handleSend} className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Title *</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Annual Sports Day Announcement" className="w-full px-3 py-2 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Message *</label>
          <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type announcement message details..." className="w-full px-3 py-2 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Category</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-2.5 py-2 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Audience</label>
            <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full px-2.5 py-2 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary">
              {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Priority</label>
            <div className="flex gap-1">
              {PRIORITIES.map((p) => (
                <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${priority === p ? 'bg-primary text-white border-primary' : 'bg-surface-secondary/50 dark:bg-white/5 border-line dark:border-white/10 text-ink-muted'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Campus (Optional)</label>
            <select value={campusId} onChange={(e) => setCampusId(e.target.value)} className="w-full px-2.5 py-2 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary">
              <option value="">All Campuses</option>
              {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Action Link (Optional)</label>
          <input type="text" value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} placeholder="/admin/students or external link" className="w-full px-3 py-2 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary" />
        </div>
        <button type="submit" disabled={sending} className="w-full py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
          <Send className="w-3.5 h-3.5" />
          <span>{sending ? 'Broadcasting...' : 'Broadcast Notification'}</span>
        </button>
      </form>
    </div>
  );
};

export default NotificationComposerCard;

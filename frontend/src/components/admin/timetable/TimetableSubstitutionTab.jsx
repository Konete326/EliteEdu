import { useState, useEffect, useCallback } from 'react';
import { UserX, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import TimetableSubstitutionRow from './TimetableSubstitutionRow';

const TimetableSubstitutionTab = ({ campusId }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ reliefItems: [], absentCount: 0, day_of_week: '', date: '' });
  const [selectedSubs, setSelectedSubs] = useState({});
  const [submittingSlot, setSubmittingSlot] = useState(null);

  const loadSubstitutions = useCallback(async () => {
    setLoading(true);
    try {
      const q = campusId ? `?campus_id=${campusId}` : '';
      const res = await api.get(`/timetable/substitutions${q}`);
      if (res.data?.success) setData(res.data);
    } catch {
      showToast('Failed to load substitutions', 'error');
    } finally { setLoading(false); }
  }, [campusId, showToast]);

  useEffect(() => { loadSubstitutions(); }, [loadSubstitutions]);

  const handleAssign = async (slotId) => {
    const subTeacherId = selectedSubs[slotId];
    if (!subTeacherId) return showToast('Please select a substitute teacher', 'error');
    setSubmittingSlot(slotId);
    try {
      const res = await api.post('/timetable/substitutions', { slot_id: slotId, substitute_teacher_id: subTeacherId, date: data.date });
      if (res.data?.success) {
        showToast('Substitute teacher assigned & notified', 'success');
        loadSubstitutions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign substitute', 'error');
    } finally { setSubmittingSlot(null); }
  };

  const handleCancel = async (subId) => {
    try {
      await api.delete(`/timetable/substitutions/${subId}`);
      showToast('Substitution removed', 'success');
      loadSubstitutions();
    } catch {
      showToast('Failed to cancel substitution', 'error');
    }
  };

  const items = data.reliefItems || [];
  const assignedCount = items.filter((i) => Boolean(i.substitution)).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm">
          <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Absent / On Leave</span><UserX className="w-4 h-4 text-rose-500" /></div>
          <div className="mt-1 text-2xl font-black text-rose-600 font-mono">{data.absentCount || 0} Staff</div>
          <p className="text-[10px] text-ink-muted">Today ({data.day_of_week || 'Today'}, {data.date})</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm">
          <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Relief Required</span><AlertCircle className="w-4 h-4 text-amber-500" /></div>
          <div className="mt-1 text-2xl font-black text-amber-600 font-mono">{items.length} Periods</div>
          <p className="text-[10px] text-ink-muted">Classes needing substitution</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm">
          <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Resolved &amp; Covered</span><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
          <div className="mt-1 text-2xl font-black text-emerald-600 font-mono">{assignedCount} / {items.length}</div>
          <p className="text-[10px] text-ink-muted">Substitute teachers assigned</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-line pb-2.5">
          <h3 className="text-sm font-black text-ink dark:text-ink-dark flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" /> Daily Relief Duty Allocator
          </h3>
          <span className="text-[11px] font-bold text-ink-muted">Auto-identifies free period teachers</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-blue-600" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-ink-muted space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-ink">All Classes Fully Covered!</p>
            <p className="text-[11px]">No absent teachers with scheduled classes found for today.</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {items.map((item) => (
              <TimetableSubstitutionRow
                key={item.slot._id} item={item} selectedSub={selectedSubs[item.slot._id]}
                onSelectSub={(id, val) => setSelectedSubs((prev) => ({ ...prev, [id]: val }))}
                onAssign={handleAssign} onCancel={handleCancel} submitting={submittingSlot === item.slot._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableSubstitutionTab;

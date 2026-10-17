import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, X, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../../../services/api';

export default function CrmConvertModal({ isOpen, onClose, lead, onConverted }) {
  const navigate = useNavigate();
  const [section, setSection] = useState('A');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen || !lead) return null;

  const handleConvert = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/crm/leads/${lead._id}/convert`, { section });
      if (res.data?.success) {
        setResult(res.data);
        if (onConverted) onConverted(res.data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Convert Lead to Student</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-text-muted hover:bg-hover"><X className="w-4 h-4" /></button>
        </div>

        {result ? (
          <div className="space-y-4 py-2 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Admission Successful!</h4>
              <p className="text-xs text-text-muted mt-1">{lead.student_name} is now enrolled with GR No: <strong className="text-primary">{result.student?.gr_number}</strong></p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button type="button" onClick={() => { onClose(); navigate(`/admin/students/admission-letter?studentId=${result.student?._id}`); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white cursor-pointer hover:bg-primary-hover shadow-xs">
                <FileText className="w-3.5 h-3.5" /> <span>Print Admission Letter</span>
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold border border-line hover:bg-hover cursor-pointer">Done</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-secondary/40 border border-line space-y-1">
              <div className="flex justify-between"><span className="text-text-muted">Student:</span><span className="font-bold">{lead.student_name}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Class:</span><span className="font-semibold">{lead.grade_id?.name || lead.class_name || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Contact:</span><span>{lead.contact_country_code || '+92'} {lead.contact_number}</span></div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Assign Section *</label>
              <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line bg-transparent font-medium outline-hidden">
                {['A', 'B', 'C', 'D', 'E'].map((s) => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
            <p className="text-[11px] text-text-muted">Auto-assigns next official GR number, generates student credentials, and updates status.</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-line">
              <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-xl border border-line hover:bg-hover font-medium cursor-pointer">Cancel</button>
              <button type="button" disabled={loading} onClick={handleConvert} className="px-4 py-1.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50">
                {loading ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

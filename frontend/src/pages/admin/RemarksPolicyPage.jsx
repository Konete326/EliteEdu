import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Sparkles, Plus, AlertCircle } from 'lucide-react';
import axios from '../../api/axios';
import RemarkPolicyCard from '../../components/admin/examsuite/remarks/RemarkPolicyCard';
import { STANDARD_REMARKS_PRESETS } from '../../config/remarksPresets';

const RemarksPolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [polRes, gradeRes] = await Promise.all([
        axios.get('/exam-suite/remarks-policy'),
        axios.get('/grades')
      ]);
      setPolicies(polRes.data.policies || []);
      setGrades(gradeRes.data.grades || gradeRes.data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdate = (idx, updated) => {
    const list = [...policies];
    list[idx] = updated;
    setPolicies(list);
  };

  const handleAddBand = () => {
    setPolicies([...policies, { type: 'Teacher', remark: '', from_percent: 50, to_percent: 70, apply_to_all_classes: true, target_grades: [] }]);
  };

  const handleSaveAll = async () => {
    for (const p of policies) {
      if (!p.remark?.trim() || p.from_percent === undefined || p.to_percent === undefined) {
        setToastMsg('Please fill all required policy fields before saving');
        setTimeout(() => setToastMsg(''), 3000);
        return;
      }
    }
    try {
      setSaving(true);
      await axios.post('/exam-suite/remarks-policy', { policies });
      setToastMsg('Remarks policy saved successfully!');
      setTimeout(() => setToastMsg(''), 3000);
      fetchData();
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Remarks Policy</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Map percentage bands to report card remarks with class targeting.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setPolicies(STANDARD_REMARKS_PRESETS)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-line dark:border-white/10 bg-surface dark:bg-[#0c0c0c] hover:border-primary text-text-muted hover:text-primary transition-colors cursor-pointer">
            <Sparkles size={14} className="text-primary" /> Load Standard Presets
          </button>
          <button type="button" onClick={handleAddBand} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-line dark:border-white/10 bg-surface dark:bg-[#0c0c0c] hover:border-primary text-text-muted hover:text-primary transition-colors cursor-pointer">
            <Plus size={14} /> Add Band
          </button>
          <button onClick={handleSaveAll} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors cursor-pointer">
            <Save size={15} /> {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading policy cards...</div>
      ) : policies.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-line dark:border-white/10 bg-surface-secondary/20 dark:bg-white/5 space-y-3">
          <AlertCircle className="w-10 h-10 text-primary mx-auto opacity-70" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">No Remarks Policy Configured</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">Configure automatic teacher remarks for student report cards based on marks percentage.</p>
          <div className="pt-2 flex justify-center gap-3">
            <button type="button" onClick={() => setPolicies(STANDARD_REMARKS_PRESETS)} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs">
              Load Standard Academic Presets (Recommended)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {policies.map((p, idx) => (
            <RemarkPolicyCard
              key={p._id || idx} policy={p} index={idx} total={policies.length} grades={grades}
              onChange={(updated) => handleUpdate(idx, updated)}
              onAddAfter={() => {
                const list = [...policies];
                list.splice(idx + 1, 0, { type: 'Teacher', remark: '', from_percent: 50, to_percent: 70, apply_to_all_classes: true, target_grades: [] });
                setPolicies(list);
              }}
              onRemove={() => setPolicies(policies.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RemarksPolicyPage;

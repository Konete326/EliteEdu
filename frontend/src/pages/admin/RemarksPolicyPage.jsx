import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import axios from '../../api/axios';
import RemarkPolicyCard from '../../components/admin/examsuite/remarks/RemarkPolicyCard';

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
        axios.get('/api/exam-suite/remarks-policy'),
        axios.get('/api/grades')
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

  const handleAddAfter = (idx) => {
    const list = [...policies];
    list.splice(idx + 1, 0, {
      type: 'Teacher', remark: '', from_percent: 50, to_percent: 70, apply_to_all_classes: true, target_grades: []
    });
    setPolicies(list);
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
      await axios.post('/api/exam-suite/remarks-policy', { policies });
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
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Map percentage bands to remarks, optionally per class.</p>
        </div>
        <button onClick={handleSaveAll} disabled={saving} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors self-start sm:self-auto">
          <Save size={16} /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading policy cards...</div>
      ) : (
        <div className="space-y-4">
          {policies.map((p, idx) => (
            <RemarkPolicyCard
              key={p._id || idx} policy={p} index={idx} total={policies.length} grades={grades}
              onChange={(updated) => handleUpdate(idx, updated)}
              onAddAfter={() => handleAddAfter(idx)}
              onRemove={() => setPolicies(policies.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RemarksPolicyPage;

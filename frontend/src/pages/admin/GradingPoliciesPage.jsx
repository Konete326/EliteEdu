import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Sliders, AlertTriangle } from 'lucide-react';
import axios from '../../api/axios';
import GradingPolicyCard from '../../components/admin/examsuite/grading/GradingPolicyCard';
import FailCriteriaTab from '../../components/admin/exams/FailCriteriaTab';

const GradingPoliciesPage = () => {
  const [activeTab, setActiveTab] = useState('cards');
  const [policies, setPolicies] = useState([]);
  const [failCriteria, setFailCriteria] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [polRes, gradeRes] = await Promise.all([
        axios.get('/grading-policies'),
        axios.get('/grades')
      ]);
      const pol = polRes.data.policy || {};
      setPolicies(pol.policies || []);
      setFailCriteria(pol.fail_criteria || null);
      setGrades(gradeRes.data.grades || gradeRes.data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (idx, updated) => {
    const list = [...policies];
    list[idx] = updated;
    setPolicies(list);
  };

  const handleAddAfter = (idx) => {
    const list = [...policies];
    list.splice(idx + 1, 0, {
      letter_grade: 'B', from_percent: 50, to_percent: 59,
      status: 'Passed', status_color: '#3B82F6', apply_to_all_classes: true, target_grades: []
    });
    setPolicies(list);
  };

  const handleRemove = (idx) => {
    setPolicies(policies.filter((_, i) => i !== idx));
  };

  const handleSaveAll = async () => {
    for (const p of policies) {
      if (!p.letter_grade?.trim() || p.from_percent === undefined || p.to_percent === undefined) {
        setToastMsg('Please fill all required grade and percentage fields');
        setTimeout(() => setToastMsg(''), 3000);
        return;
      }
    }
    try {
      setSaving(true);
      await axios.put('/grading-policies/policies', { policies });
      setToastMsg('Grading policies saved successfully!');
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Grading Policies</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Set percentage thresholds, letter grades, and fail criteria.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button type="button" onClick={() => setActiveTab('cards')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeTab === 'cards' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs' : 'text-slate-500'}`}>Policy Cards</button>
            <button type="button" onClick={() => setActiveTab('criteria')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeTab === 'criteria' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs' : 'text-slate-500'}`}>Fail Criteria</button>
          </div>
          {activeTab === 'cards' && (
            <button onClick={handleSaveAll} disabled={saving} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
              <Save size={15} />
              {saving ? 'Saving...' : 'Save All'}
            </button>
          )}
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 size={16} />
          {toastMsg}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading grading policies...</div>
      ) : activeTab === 'cards' ? (
        <div className="space-y-4">
          {policies.map((p, idx) => (
            <GradingPolicyCard key={p._id || idx} policy={p} index={idx} total={policies.length} grades={grades} onChange={(u) => handleUpdate(idx, u)} onAddAfter={() => handleAddAfter(idx)} onRemove={() => handleRemove(idx)} />
          ))}
        </div>
      ) : (
        <FailCriteriaTab initialCriteria={failCriteria} onSave={async (crit) => { await axios.put('/grading-policies/fail-criteria', crit); setToastMsg('Fail criteria updated'); setTimeout(() => setToastMsg(''), 3000); }} saving={saving} />
      )}
    </div>
  );
};

export default GradingPoliciesPage;

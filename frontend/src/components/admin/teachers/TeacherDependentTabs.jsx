import { Lock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DocumentUploadList from '../../common/DocumentUploadList';

const TAB_TITLES = {
  security_deposit: 'Security Deposits', increment_history: 'Increment History',
  loan_advance: 'Loans & Advances', follow_up: 'Follow-up History',
  documents: 'Documents Repository', active_sessions: 'Active Login Sessions'
};

const TeacherDependentTabs = ({ activeTab, teacherId, formData, onSaveNow, onUpdateField }) => {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const title = TAB_TITLES[activeTab] || 'Tab Details';

  if (!teacherId) {
    return (
      <div className="p-12 text-center rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Save staff record to unlock {title}</h3>
        <p className="text-xs text-ink-muted max-w-md mx-auto">
          Basic profile information must be created in the database before attaching {title.toLowerCase()}.
        </p>
        <button
          type="button"
          onClick={onSaveNow}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-all"
        >
          Save Basic Profile Now
        </button>
      </div>
    );
  }

  if (activeTab === 'documents') {
    return (
      <DocumentUploadList
        documents={formData.documents || []}
        onChange={(docs) => onUpdateField('documents', docs)}
        title="Teacher Documents Repository"
      />
    );
  }

  const items = formData[activeTab === 'security_deposit' ? 'security_deposits' :
    activeTab === 'increment_history' ? 'increments' :
    activeTab === 'loan_advance' ? 'loans' :
    activeTab === 'follow_up' ? 'follow_ups' : 'sessions'] || [];

  const handleAddItem = () => {
    if (!val1.trim()) return;
    const fieldName = activeTab === 'security_deposit' ? 'security_deposits' :
      activeTab === 'increment_history' ? 'increments' :
      activeTab === 'loan_advance' ? 'loans' : 'follow_ups';
    onUpdateField(fieldName, [...items, { amount: Number(val1) || 0, reason: val2.trim() || 'Standard' }]);
    setVal1('');
    setVal2('');
  };

  const handleRemove = (idx) => {
    const fieldName = activeTab === 'security_deposit' ? 'security_deposits' :
      activeTab === 'increment_history' ? 'increments' :
      activeTab === 'loan_advance' ? 'loans' : 'follow_ups';
    onUpdateField(fieldName, items.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">{title}</h3>
        <span className="text-xs text-ink-muted">{items.length} records</span>
      </div>

      {activeTab !== 'active_sessions' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={val1}
            onChange={(e) => setVal1(e.target.value)}
            placeholder="Amount / Detail"
            className="flex-1 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs outline-none"
          />
          <input
            type="text"
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
            placeholder="Reason / Note"
            className="flex-1 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs outline-none"
          />
          <button type="button" onClick={handleAddItem} className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="py-8 text-center text-xs text-ink-muted">No records registered under {title}.</div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-secondary/40 text-xs">
              <span className="font-semibold text-ink dark:text-ink-dark">{item.reason || `PKR ${item.amount}`}</span>
              <button type="button" onClick={() => handleRemove(idx)} className="text-bad hover:scale-110">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDependentTabs;

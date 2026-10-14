import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const ChildrenInformationWidget = ({ children = [], onChildrenChange }) => {
  const [childName, setChildName] = useState('');
  const [childGr, setChildGr] = useState('');

  const handleAddChild = () => {
    if (!childName.trim()) return;
    onChildrenChange([...children, { name: childName.trim(), gr_number: childGr.trim(), grade_name: '' }]);
    setChildName('');
    setChildGr('');
  };

  const handleRemoveChild = (idx) => {
    onChildrenChange(children.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-3">
      <h3 className="text-sm font-bold text-ink dark:text-ink-dark pb-2 border-b border-line dark:border-line-dark">
        Children Information
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="Child Name"
          className="flex-1 px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs outline-none"
        />
        <input
          type="text"
          value={childGr}
          onChange={(e) => setChildGr(e.target.value)}
          placeholder="GR No"
          className="w-20 px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs outline-none"
        />
        <button type="button" onClick={handleAddChild} className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-1.5">
        {children.map((c, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary/50 text-xs">
            <span className="font-semibold text-ink dark:text-ink-dark">{c.name} {c.gr_number && `(GR: ${c.gr_number})`}</span>
            <button type="button" onClick={() => handleRemoveChild(i)} className="text-bad hover:scale-110">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildrenInformationWidget;

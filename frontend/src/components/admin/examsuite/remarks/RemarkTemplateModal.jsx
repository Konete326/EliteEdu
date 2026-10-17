import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const RemarkTemplateModal = ({ isOpen, onClose, onSave, template, subjects }) => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name || '');
      setText(template.text || '');
      setSelectedSubjects((template.subjects || []).map(s => s._id || s));
    } else {
      setName('');
      setText('');
      setSelectedSubjects([]);
    }
  }, [template, isOpen]);

  if (!isOpen) return null;

  const toggleSubject = (subId) => {
    setSelectedSubjects(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), text: text.trim(), subjects: selectedSubjects });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white">
            {template ? 'Edit Remark Template' : 'Add Remark Template'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Template Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Consistent High Achiever"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Remark Text</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Demonstrates exceptional understanding and analytical skills..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Applicable Subjects (Leave empty to apply to all subjects)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30">
              {(subjects || []).map(s => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => toggleSubject(s._id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                    selectedSubjects.includes(s._id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary-hover shadow-xs">
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Remark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemarkTemplateModal;

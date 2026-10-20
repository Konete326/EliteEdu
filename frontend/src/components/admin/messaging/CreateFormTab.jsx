import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const CreateFormTab = ({ title, setTitle, description, setDescription, fields, setFields }) => {
  const handleAddField = () => {
    if (fields.length < 5) {
      setFields([
        ...fields,
        { field_id: `f_${Date.now()}`, label: `Field ${fields.length + 1}`, field_type: 'text', options: [] }
      ]);
    }
  };

  const handleRemoveField = (idx) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== idx));
    }
  };

  const handleFieldChange = (idx, key, val) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], [key]: val };
    setFields(updated);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Form Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Teacher Transport Request"
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Description (Optional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief details about this form"
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Form Fields (1 - 5)
        </label>
        {fields.map((f, idx) => (
          <div key={f.field_id || idx} className="flex items-center gap-2">
            <input
              type="text"
              value={f.label}
              onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
              placeholder="Field name"
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs outline-none"
            />
            <select
              value={f.field_type}
              onChange={(e) => handleFieldChange(idx, 'field_type', e.target.value)}
              className="w-28 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 text-xs outline-none"
            >
              <option value="text">Text</option>
              <option value="dropdown">Dropdown</option>
              <option value="date_picker">Date</option>
            </select>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField(idx)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
        {fields.length < 5 && (
          <button
            type="button"
            onClick={handleAddField}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline pt-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add field
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateFormTab;

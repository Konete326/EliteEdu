import React, { useState } from 'react';
import { Settings, X, Plus, Check } from 'lucide-react';

export default function CrmSettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('statuses');
  const [statuses, setStatuses] = useState([
    'New Inquiry', 'Contacted', 'Visit Scheduled', 'Test / Interview', 'Offer Made', 'Enrolled', 'Lost'
  ]);
  const [sources, setSources] = useState([
    'Walk-in', 'Facebook', 'Website', 'WhatsApp', 'Referral', 'Banner'
  ]);
  const [newVal, setNewVal] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newVal.trim()) return;
    if (activeTab === 'statuses') {
      if (!statuses.includes(newVal.trim())) setStatuses([...statuses, newVal.trim()]);
    } else {
      if (!sources.includes(newVal.trim())) setSources([...sources, newVal.trim()]);
    }
    setNewVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
              CRM Stage & Source Settings
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-text-muted hover:bg-hover">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex rounded-xl bg-surface-secondary/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('statuses')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'statuses' ? 'bg-primary text-white shadow-xs' : 'text-text-muted'
            }`}
          >
            Pipeline Stages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'sources' ? 'bg-primary text-white shadow-xs' : 'text-text-muted'
            }`}
          >
            Lead Sources
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            placeholder={`Add new ${activeTab === 'statuses' ? 'stage' : 'source'}...`}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-transparent"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
          {(activeTab === 'statuses' ? statuses : sources).map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 rounded-lg border border-line dark:border-line-dark bg-surface-secondary/30 text-xs font-medium text-text-secondary flex items-center gap-1"
            >
              <Check className="w-3 h-3 text-emerald-500" />
              {item}
            </span>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-line dark:border-line-dark">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

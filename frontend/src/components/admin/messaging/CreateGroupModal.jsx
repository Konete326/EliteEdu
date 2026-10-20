import React, { useState, useEffect } from 'react';
import { X, Users, Check } from 'lucide-react';
import api from '../../../services/api';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupType, setGroupType] = useState('Staff_Group');
  const [groupName, setGroupName] = useState('');
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [section, setSection] = useState('A');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/grades')
      .then((res) => {
        const list = res.data?.grades || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setGrades(Array.isArray(list) ? list : []);
      })
      .catch(() => setGrades([]));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        group_type: groupType,
        group_name: groupName.trim(),
        grade_id: groupType === 'Class_Group' ? selectedGrade : null,
        section: groupType === 'Class_Group' ? section : ''
      };
      const res = await api.post('/messaging/conversations/group', payload);
      if (res.data?.success) {
        onGroupCreated(res.data.data);
        onClose();
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-150">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">New Group & Broadcast</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setGroupType('Staff_Group'); setGroupName('All Faculty & Staff Group'); }}
              className={`p-2.5 rounded-xl border text-center transition-all ${groupType === 'Staff_Group' ? 'border-[#1e1b4b] bg-indigo-50/50 text-[#1e1b4b] font-bold shadow-2xs' : 'border-slate-200 text-slate-500'}`}
            >Staff Group</button>
            <button
              type="button"
              onClick={() => { setGroupType('Class_Group'); setGroupName(''); }}
              className={`p-2.5 rounded-xl border text-center transition-all ${groupType === 'Class_Group' ? 'border-[#1e1b4b] bg-indigo-50/50 text-[#1e1b4b] font-bold shadow-2xs' : 'border-slate-200 text-slate-500'}`}
            >Class Broadcast</button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={groupType === 'Staff_Group' ? 'All Faculty & Staff Group' : 'e.g. Class 5-A Broadcast'}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none"
              required
            />
          </div>

          {groupType === 'Class_Group' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Grade</label>
                <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none" required>
                  <option value="">Select Grade</option>
                  {(Array.isArray(grades) ? grades : []).map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Section</label>
                <input type="text" value={section} onChange={(e) => setSection(e.target.value.toUpperCase())} placeholder="A" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none uppercase font-bold" />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1e1b4b] hover:bg-indigo-900 text-white flex items-center gap-1.5 shadow-xs">
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Creating...' : 'Create Group'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;

import React, { useState, useEffect } from 'react';
import { X, Users, Check } from 'lucide-react';
import api from '../../../services/api';
import GroupAvatarUploader from './GroupAvatarUploader';
import GroupMemberSelector from './GroupMemberSelector';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupType, setGroupType] = useState('Custom_Group');
  const [groupName, setGroupName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [members, setMembers] = useState([]);
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

  const handleToggleMember = (m) => {
    setMembers((prev) => {
      const exists = prev.some((item) => item.user_id === m.user_id);
      return exists ? prev.filter((item) => item.user_id !== m.user_id) : [...prev, m];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        group_type: groupType,
        group_name: groupName.trim(),
        avatar_url: avatarUrl,
        grade_id: groupType === 'Class_Group' ? selectedGrade : null,
        section: groupType === 'Class_Group' ? section : '',
        members: groupType === 'Custom_Group' ? members : []
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-line dark:border-line-dark shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Create Group</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            {['Custom_Group', 'Staff_Group', 'Class_Group'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setGroupType(type);
                  if (type === 'Staff_Group' && !groupName) setGroupName('All Faculty & Staff Group');
                }}
                className={`p-2 rounded-xl border text-center transition-all ${groupType === type ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs' : 'border-line dark:border-line-dark text-ink-muted'}`}
              >
                {type === 'Custom_Group' ? 'Custom Group' : type === 'Staff_Group' ? 'Staff Group' : 'Class Broadcast'}
              </button>
            ))}
          </div>

          <GroupAvatarUploader avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} />

          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={groupType === 'Staff_Group' ? 'All Faculty & Staff Group' : groupType === 'Class_Group' ? 'e.g. Class 5-A Broadcast' : 'e.g. Science Teachers & Staff'}
              className="w-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl px-3 py-2 text-xs outline-none"
              required
            />
          </div>

          {groupType === 'Custom_Group' && (
            <GroupMemberSelector selectedMembers={members} onToggleMember={handleToggleMember} />
          )}

          {groupType === 'Class_Group' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Select Grade</label>
                <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl px-3 py-2 text-xs outline-none" required>
                  <option value="">Select Grade</option>
                  {(Array.isArray(grades) ? grades : []).map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Section</label>
                <input type="text" value={section} onChange={(e) => setSection(e.target.value.toUpperCase())} placeholder="A" className="w-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl px-3 py-2 text-xs outline-none uppercase font-bold" />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-ink-muted hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark">Cancel</button>
            <button type="submit" disabled={saving || (groupType === 'Custom_Group' && members.length === 0)} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white flex items-center gap-1.5 shadow-xs disabled:opacity-50">
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

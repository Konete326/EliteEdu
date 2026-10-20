import React, { useState, useEffect } from 'react';
import { Search, Check, UserCheck, Shield, GraduationCap } from 'lucide-react';
import api from '../../../services/api';

const GroupMemberSelector = ({ selectedMembers = [], onToggleMember }) => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [directory, setDirectory] = useState({ staff: [], students: [] });

  useEffect(() => {
    setLoading(true);
    api.get('/messaging/directory')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setDirectory(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const staff = directory.staff || [];
  const students = directory.students || [];
  const allList = tab === 'staff' ? staff : tab === 'students' ? students : [...staff, ...students];

  const filtered = allList.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.role_label?.toLowerCase().includes(q) ||
      m.code?.toLowerCase().includes(q)
    );
  });

  const isSelected = (id) => selectedMembers.some((sm) => sm.user_id === id);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-ink dark:text-ink-dark">
          Select Members ({selectedMembers.length} selected)
        </label>
        <div className="flex items-center gap-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`px-2 py-0.5 rounded-md transition-colors ${tab === 'all' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'}`}
          >All</button>
          <button
            type="button"
            onClick={() => setTab('staff')}
            className={`px-2 py-0.5 rounded-md transition-colors ${tab === 'staff' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'}`}
          >Staff</button>
          <button
            type="button"
            onClick={() => setTab('students')}
            className={`px-2 py-0.5 rounded-md transition-colors ${tab === 'students' ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'}`}
          >Students</button>
        </div>
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff, teachers or students..."
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl outline-none"
        />
      </div>

      <div className="max-h-44 overflow-y-auto divide-y divide-line dark:divide-line-dark border border-line dark:border-line-dark rounded-xl bg-surface dark:bg-surface-dark">
        {loading ? (
          <div className="p-4 text-center text-xs text-ink-muted">Loading members...</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-center text-xs text-ink-muted">No members found</div>
        ) : (
          filtered.map((m) => {
            const active = isSelected(m.user_id);
            return (
              <div
                key={m.user_id}
                onClick={() => onToggleMember(m)}
                className={`p-2 px-3 flex items-center justify-between cursor-pointer hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors ${active ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                      {m.name?.slice(0, 2).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-semibold text-ink dark:text-ink-dark truncate">{m.name}</p>
                    <p className="text-[10px] text-ink-muted dark:text-ink-muted-dark truncate flex items-center gap-1">
                      {m.user_model === 'Student' ? <GraduationCap className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
                      <span>{m.role_label}</span>
                      {m.code && <span>• {m.code}</span>}
                    </p>
                  </div>
                </div>

                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-primary border-primary text-white' : 'border-line dark:border-line-dark'}`}>
                  {active && <Check className="w-3 h-3" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GroupMemberSelector;

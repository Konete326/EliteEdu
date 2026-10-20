import React, { useState, useEffect } from 'react';
import { X, Search, UserCheck } from 'lucide-react';
import api from '../../../services/api';

const NewChatModal = ({ isOpen, onClose, onSelectContact }) => {
  const [tab, setTab] = useState('staff');
  const [search, setSearch] = useState('');
  const [directory, setDirectory] = useState({ staff: [], students: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchDirectory = async () => {
      try {
        setLoading(true);
        const res = await api.get('/messaging/directory');
        if (res.data?.success) {
          setDirectory(res.data.data || { staff: [], students: [] });
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchDirectory();
  }, [isOpen]);

  if (!isOpen) return null;

  const rawList = tab === 'staff' ? directory?.staff : directory?.students;
  const list = Array.isArray(rawList) ? rawList : [];
  const filtered = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.role_label && item.role_label.toLowerCase().includes(search.toLowerCase())) ||
    (item.code && item.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-150">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">New Direct Message</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-150 flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role or ID..."
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none"
            />
          </div>
          <div className="flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTab('staff')}
              className={`px-3 py-1 rounded-lg transition-colors ${tab === 'staff' ? 'bg-[#1e1b4b] text-white shadow-2xs' : 'text-slate-500'}`}
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => setTab('students')}
              className={`px-3 py-1 rounded-lg transition-colors ${tab === 'students' ? 'bg-[#1e1b4b] text-white shadow-2xs' : 'text-slate-500'}`}
            >
              Students
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading directory...</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No contacts found</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.user_id}
                onClick={() => onSelectContact(item)}
                className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs shrink-0">
                    {item.name ? item.name.slice(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{item.name}</h4>
                    <span className="text-[10px] text-slate-400 truncate block">{item.role_label} {item.code ? `• ${item.code}` : ''}</span>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;

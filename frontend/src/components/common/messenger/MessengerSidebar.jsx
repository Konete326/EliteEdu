import { useState } from 'react';
import { Users, GraduationCap, ShieldCheck, FileText, Search, User, MessageSquare } from 'lucide-react';

const CHANNELS = [
  { id: 'All_Staff', label: 'All Staff Room', icon: Users, desc: 'School-wide channel' },
  { id: 'Teachers', label: 'Faculty Lounge', icon: GraduationCap, desc: 'Teaching staff' },
  { id: 'Admins', label: 'Admin Council', icon: ShieldCheck, desc: 'Campus admins' },
  { id: 'Circulars', label: 'Official Circulars', icon: FileText, desc: 'Formal memos' }
];

const MessengerSidebar = ({ activeTarget, onSelectTarget, directory = [], currentUserId }) => {
  const [search, setSearch] = useState('');

  const filteredStaff = directory.filter((u) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return u.name?.toLowerCase().includes(term) || u.role?.toLowerCase().includes(term);
  });

  return (
    <div className="flex flex-col h-full bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark overflow-hidden">
      <div className="p-3.5 border-b border-line space-y-2.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-black uppercase text-ink dark:text-ink-dark">Staff Messenger</h3>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search colleagues..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        <div>
          <p className="px-2 pb-1 text-[10px] font-black uppercase tracking-wider text-ink-muted">Channels</p>
          <div className="space-y-0.5">
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              const isActive = activeTarget.type === 'channel' && activeTarget.id === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectTarget({ type: 'channel', id: ch.id, label: ch.label })}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                    isActive ? 'bg-primary text-white shadow-sm font-bold' : 'text-ink dark:text-ink-dark hover:bg-surface-secondary/50 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-ink-muted'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{ch.label}</p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-ink-muted'}`}>{ch.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-2 pb-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-ink-muted">Direct Messages</p>
            <span className="text-[10px] font-mono font-bold text-ink-muted">{filteredStaff.length}</span>
          </div>
          <div className="space-y-0.5">
            {filteredStaff.length === 0 ? (
              <p className="text-[11px] text-ink-muted px-2 py-3 text-center">No colleagues found</p>
            ) : (
              filteredStaff.map((staff) => {
                const isActive = activeTarget.type === 'direct' && activeTarget.user?._id === staff._id;
                return (
                  <button
                    key={staff._id}
                    onClick={() => onSelectTarget({ type: 'direct', user: staff, label: staff.name })}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                      isActive ? 'bg-primary text-white shadow-sm font-bold' : 'text-ink dark:text-ink-dark hover:bg-surface-secondary/50 font-medium'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {staff.profile_picture ? (
                        <img src={staff.profile_picture} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        staff.name?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{staff.name}</p>
                      <p className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-ink-muted'}`}>{staff.role}</p>
                    </div>
                    {staff.unread_count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold">
                        {staff.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessengerSidebar;

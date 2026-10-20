import React from 'react';
import { UserCheck, CalendarCheck, AlertTriangle, FileText, Bell } from 'lucide-react';

const COMMANDS = [
  { name: '/student', syntax: '/student <GR# or Name>', desc: 'Lookup Student: Bio, Attendance & Fees', icon: UserCheck, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' },
  { name: '/attendance', syntax: '/attendance [Class]', desc: 'Campus or class attendance summary card', icon: CalendarCheck, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/60' },
  { name: '/defaulters', syntax: '/defaulters [Class]', desc: 'Outstanding fee arrears & top defaulters (Admin)', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' },
  { name: '/leave', syntax: '/leave <Days> <Reason>', desc: 'Submit staff leave with approval buttons', icon: FileText, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' },
  { name: '/circular', syntax: '/circular <Title> | <Msg>', desc: 'Broadcast notice with acknowledge button', icon: Bell, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' }
];

const SlashCommandMenu = ({ query, onSelect }) => {
  const q = (query || '').toLowerCase().trim();
  const filtered = COMMANDS.filter((c) => c.name.startsWith(q) || c.syntax.toLowerCase().includes(q));

  if (filtered.length === 0) return null;

  return (
    <div className="absolute bottom-full left-3 right-3 mb-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-30 p-1.5">
      <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Smart ERP Slash Commands</span>
        <span className="text-[10px] text-slate-400 font-mono">Click to insert</span>
      </div>
      <div className="max-h-56 overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/60">
        {filtered.map((cmd) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.name}
              type="button"
              onClick={() => onSelect(`${cmd.name} `)}
              className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-2.5"
            >
              <div className={`p-1.5 rounded-lg ${cmd.color} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">{cmd.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{cmd.syntax}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{cmd.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlashCommandMenu;

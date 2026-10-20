import React from 'react';
import { UserCheck, CalendarCheck, AlertTriangle, FileText, Bell } from 'lucide-react';

const COMMANDS = [
  { name: '/student', syntax: '/student <GR# or Name>', desc: 'Lookup Student: Bio, Attendance & Fees', icon: UserCheck, color: 'text-primary bg-primary/10' },
  { name: '/attendance', syntax: '/attendance [Class]', desc: 'Campus or class attendance summary card', icon: CalendarCheck, color: 'text-emerald-500 bg-emerald-500/10' },
  { name: '/defaulters', syntax: '/defaulters [Class]', desc: 'Outstanding fee arrears & top defaulters (Admin)', icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10' },
  { name: '/leave', syntax: '/leave <Days> <Reason>', desc: 'Submit staff leave with approval buttons', icon: FileText, color: 'text-primary bg-primary/10' },
  { name: '/circular', syntax: '/circular <Title> | <Msg>', desc: 'Broadcast notice with acknowledge button', icon: Bell, color: 'text-primary bg-primary/10' }
];

const SlashCommandMenu = ({ query, onSelect }) => {
  const q = (query || '').toLowerCase().trim();
  const filtered = COMMANDS.filter((c) => c.name.startsWith(q) || c.syntax.toLowerCase().includes(q));

  if (filtered.length === 0) return null;

  return (
    <div className="absolute bottom-full left-3 right-3 mb-2 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-md rounded-2xl border border-line dark:border-line-dark shadow-xl overflow-hidden z-30 p-1.5">
      <div className="px-3 py-1.5 border-b border-line dark:border-line-dark flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Smart ERP Slash Commands</span>
        <span className="text-[10px] text-ink-muted font-mono">Click to insert</span>
      </div>
      <div className="max-h-56 overflow-y-auto divide-y divide-line/60 dark:divide-line-dark/60">
        {filtered.map((cmd) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.name}
              type="button"
              onClick={() => onSelect(`${cmd.name} `)}
              className="w-full text-left p-2 rounded-xl hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors flex items-center gap-2.5"
            >
              <div className={`p-1.5 rounded-lg ${cmd.color} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink dark:text-ink-dark font-mono">{cmd.name}</span>
                  <span className="text-[10px] text-ink-muted font-mono">{cmd.syntax}</span>
                </div>
                <p className="text-[11px] text-ink-muted truncate">{cmd.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlashCommandMenu;

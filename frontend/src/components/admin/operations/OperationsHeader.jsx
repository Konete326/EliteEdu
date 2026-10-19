import { AlertCircle, HeartHandshake, Search, FileCheck } from 'lucide-react';

const MODULE_CONFIGS = {
  Complaint: { title: 'Complaints & Grievances Desk', desc: 'Parent, student and faculty complaints with resolution tracking', icon: AlertCircle },
  Counseling: { title: 'Student Counseling & Feedback', desc: 'Guidance logs, well-being mentorship and feedback sessions', icon: HeartHandshake },
  Lost_Found: { title: 'Campus Lost & Found Desk', desc: 'Reported lost articles, found belongings and claim records', icon: Search },
  Consent_Letter: { title: 'Parental Consent & News Circulars', desc: 'Official parental permission slips, notices and school announcements', icon: FileCheck }
};

const OperationsHeader = ({ recordType = 'Complaint', stats = {} }) => {
  const config = MODULE_CONFIGS[recordType] || MODULE_CONFIGS.Complaint;
  const Icon = config.icon;

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">{config.title}</h1>
          <p className="text-xs font-semibold text-ink-muted">{config.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs">
          <span className="text-[10px] uppercase font-bold text-primary block">Total Records</span>
          <span className="font-black text-primary">{stats.total || 0}</span>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
          <span className="text-[10px] uppercase font-bold text-amber-600 block">Pending / Open</span>
          <span className="font-black text-amber-700 dark:text-amber-400">{stats.active || 0}</span>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block">Resolved / Approved</span>
          <span className="font-black text-emerald-700 dark:text-emerald-400">{stats.resolved || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default OperationsHeader;

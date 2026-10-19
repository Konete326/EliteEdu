import { GraduationCap, Users, UserCheck, BookOpen, Package } from 'lucide-react';

const ENTITIES = [
  { id: 'students', label: 'Students', subtitle: 'Admissions & Roster', icon: GraduationCap, color: 'text-primary' },
  { id: 'teachers', label: 'Teachers & Staff', subtitle: 'Faculty & HR Profile', icon: Users, color: 'text-indigo-500' },
  { id: 'crm_leads', label: 'CRM Leads', subtitle: 'Inquiries & Prospects', icon: UserCheck, color: 'text-emerald-500' },
  { id: 'questions', label: 'Question Bank', subtitle: 'Exam & Quiz Items', icon: BookOpen, color: 'text-amber-500' },
  { id: 'store_items', label: 'Store Inventory', subtitle: 'POS & Uniform Stock', icon: Package, color: 'text-rose-500' }
];

const BulkImportEntityCards = ({ activeEntity, onSelectEntity, disabled }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {ENTITIES.map((ent) => {
        const Icon = ent.icon;
        const isActive = activeEntity === ent.id;
        return (
          <button
            key={ent.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectEntity(ent.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              isActive
                ? 'bg-primary/10 border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20'
                : 'bg-surface dark:bg-surface-dark border-line hover:border-primary/40 hover:bg-surface-secondary/40'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-primary text-white shadow-sm' : 'bg-surface-secondary dark:bg-white/5 ' + ent.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
            <h4 className="text-xs font-bold text-ink dark:text-ink-dark group-hover:text-primary transition-colors">
              {ent.label}
            </h4>
            <p className="text-[10px] text-ink-muted line-clamp-1 mt-0.5">
              {ent.subtitle}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default BulkImportEntityCards;

import { Users, GraduationCap, Target, HelpCircle, BookOpen, CreditCard, Download } from 'lucide-react';

const ENTITIES = [
  { id: 'students', label: 'Students', icon: Users },
  { id: 'teachers', label: 'Teachers & Staff', icon: GraduationCap },
  { id: 'crm_leads', label: 'CRM Leads', icon: Target },
  { id: 'questions', label: 'Question Bank', icon: HelpCircle },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'account_transactions', label: 'Accounts', icon: CreditCard }
];

const MigrationEntitySelector = ({ selectedEntity, onSelect, onDownloadTemplate }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Select Target Entity</h3>
        <p className="text-xs text-gray-500">Choose the destination model for batch validation & import</p>
      </div>
      <button
        onClick={onDownloadTemplate}
        className="px-3.5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 self-start md:self-auto"
      >
        <Download className="w-3.5 h-3.5" /> Download Sample CSV
      </button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {ENTITIES.map((ent) => {
        const Icon = ent.icon;
        const isSelected = selectedEntity === ent.id;
        return (
          <button
            key={ent.id}
            onClick={() => onSelect(ent.id)}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
              isSelected
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="text-xs">{ent.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default MigrationEntitySelector;

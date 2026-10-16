import { Search, Filter, School } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Network Errors', value: 'NETWORK_ERROR' },
  { label: 'Console Errors', value: 'CONSOLE_ERROR' },
  { label: 'Runtime Crashes', value: 'RUNTIME_ERROR' },
  { label: 'Server Errors', value: 'SERVER_ERROR' },
  { label: 'User Activities', value: 'USER_ACTIVITY' }
];

const SEVERITIES = [
  { label: 'All Severities', value: 'ALL' },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'Error', value: 'ERROR' },
  { label: 'Warning', value: 'WARNING' },
  { label: 'Info', value: 'INFO' }
];

const LogsFilterBar = ({
  search,
  setSearch,
  category,
  setCategory,
  severity,
  setSeverity,
  selectedSchoolId,
  setSelectedSchoolId,
  schools,
  isSuperAdmin,
  onResetPage
}) => {
  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        <div className={`relative ${isSuperAdmin ? 'lg:col-span-5' : 'lg:col-span-6'}`}>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onResetPage();
            }}
            placeholder="Search error message, action, user, endpoint..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark placeholder:text-ink-muted outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="lg:col-span-3">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              onResetPage();
            }}
            className="w-full px-3 py-2 rounded-xl text-xs bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary transition-all cursor-pointer font-medium"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={severity}
            onChange={(e) => {
              setSeverity(e.target.value);
              onResetPage();
            }}
            className="w-full px-3 py-2 rounded-xl text-xs bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary transition-all cursor-pointer font-medium"
          >
            {SEVERITIES.map((sev) => (
              <option key={sev.value} value={sev.value}>{sev.label}</option>
            ))}
          </select>
        </div>

        {isSuperAdmin && (
          <div className="lg:col-span-2">
            <select
              value={selectedSchoolId}
              onChange={(e) => {
                setSelectedSchoolId(e.target.value);
                onResetPage();
              }}
              className="w-full px-3 py-2 rounded-xl text-xs bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary transition-all cursor-pointer font-medium"
            >
              <option value="ALL">All Schools / Tenants</option>
              {schools.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsFilterBar;

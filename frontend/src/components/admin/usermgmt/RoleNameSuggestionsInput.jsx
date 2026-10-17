import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { getApiBase } from '../../../utils/apiBase';

const DEFAULT_SUGGESTIONS = [
  'PST', 'JEST', 'HST', 'SST', 'Headmaster', 'Incharge Headmaster',
  'Section Incharge', 'Academic Coordinator', 'Subject Specialist',
  'Senior Teacher', 'Lab Assistant', 'Vice Principal', 'Principal',
  'Accountant', 'Admin Officer', 'Librarian', 'Physical Instructor'
];

const RoleNameSuggestionsInput = ({ value, onChange, token }) => {
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    const fetchExistingDesignations = async () => {
      try {
        const [tRes, sRes] = await Promise.allSettled([
          fetch(`${getApiBase()}/teachers`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
          fetch(`${getApiBase()}/staff-applicants`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json())
        ]);
        const set = new Set(DEFAULT_SUGGESTIONS);
        if (tRes.status === 'fulfilled' && tRes.value?.teachers) {
          tRes.value.teachers.forEach((t) => {
            if (t.designation?.trim()) set.add(t.designation.trim());
          });
        }
        if (sRes.status === 'fulfilled' && sRes.value?.applicants) {
          sRes.value.applicants.forEach((a) => {
            if (a.designation?.trim()) set.add(a.designation.trim());
          });
        }
        if (isMounted) {
          setSuggestions(Array.from(set));
        }
      } catch {}
    };
    fetchExistingDesignations();
    return () => { isMounted = false; };
  }, [token]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-ink dark:text-ink-dark">Role Name *</label>
        <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
          <Sparkles className="w-3 h-3" /> Staff Suggestions
        </span>
      </div>
      <input
        type="text"
        required
        list="staff-role-suggestions"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Senior Teacher, PST, Coordinator"
        className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary text-xs"
      />
      <datalist id="staff-role-suggestions">
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <div className="flex flex-wrap items-center gap-1 pt-1 max-h-16 overflow-y-auto">
        {suggestions.slice(0, 9).map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChange(chip)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer border ${
              value.toLowerCase() === chip.toLowerCase()
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-surface-secondary/60 dark:bg-white/5 border-line dark:border-white/10 hover:border-primary/40 text-ink-muted hover:text-ink'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleNameSuggestionsInput;

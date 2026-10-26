import { Award, ThumbsUp, Save, Filter, BookOpen } from 'lucide-react';

const TERMS = ['First Term', 'Mid Term', 'Final Term', 'Annual'];

const BehaviorFilterSidebar = ({
  grades = [],
  selectedGrade,
  onGradeChange,
  sections = ['A', 'B', 'C', 'D'],
  selectedSection,
  onSectionChange,
  term,
  onTermChange,
  session,
  onSessionChange,
  onSetAllRatings,
  onSave,
  saving
}) => (
  <div className="bg-surface dark:bg-surface-dark p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark shadow-2xs flex flex-col gap-3 text-xs">
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 pb-1.5 border-b border-line dark:border-line-dark text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">
        <Filter className="w-3.5 h-3.5 text-primary" /> Class & Term Scope
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark mb-1">Class / Grade</label>
        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="w-full px-2.5 py-1.5 border border-line dark:border-line-dark rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
        >
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark mb-1">Section</label>
        <div className="flex flex-wrap gap-1">
          {sections.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSectionChange(sec)}
              className={`min-w-[32px] px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedSection === sec
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted dark:text-ink-muted-dark border border-line/60 dark:border-line-dark/60 hover:bg-line/40'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark mb-1">Term</label>
          <select
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            className="w-full px-2 py-1.5 border border-line dark:border-line-dark rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
          >
            {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark mb-1">Session</label>
          <input
            type="text"
            value={session}
            onChange={(e) => onSessionChange(e.target.value)}
            className="w-full px-2 py-1.5 border border-line dark:border-line-dark rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>
    </div>

    <div className="p-2.5 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line/70 dark:border-line-dark/70 space-y-1.5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5">
        <Award className="w-3.5 h-3.5 text-primary" /> 1-Click Batch Rating
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => onSetAllRatings(5, 'Exemplary')}
          className="py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
        >
          <Award className="w-3 h-3 shrink-0" /> Set 5/5
        </button>
        <button
          type="button"
          onClick={() => onSetAllRatings(4, 'Good')}
          className="py-1.5 px-2 bg-primary-soft hover:bg-primary-soft/80 text-primary dark:text-primary-dark border border-primary/20 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
        >
          <ThumbsUp className="w-3 h-3 shrink-0" /> Set 4/5
        </button>
      </div>
    </div>

    <div className="p-2.5 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line/50 dark:border-line-dark/50 space-y-1.5 text-[10px]">
      <div className="font-bold text-ink-muted dark:text-ink-muted-dark flex items-center gap-1.5 uppercase tracking-wider">
        <BookOpen className="w-3 h-3 text-primary" /> Rating Scale Guide
      </div>
      <div className="flex flex-wrap gap-1 text-[10px]">
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">5: Outstanding</span>
        <span className="px-1.5 py-0.5 rounded bg-primary-soft text-primary dark:text-primary-dark font-bold border border-primary/20">4: Good</span>
        <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/20">3: Satisfactory</span>
        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20">2: Fair</span>
        <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/20">1: Urgent</span>
      </div>
    </div>

    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all"
    >
      <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
      <span>{saving ? 'Saving...' : 'Save Behavior Sheet'}</span>
    </button>
  </div>
);

export default BehaviorFilterSidebar;

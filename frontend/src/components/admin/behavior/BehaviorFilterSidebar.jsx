import { Check, Sparkles, ThumbsUp, Save, Filter, BookOpen } from 'lucide-react';

const TERMS = ['First Term', 'Mid Term', 'Final Term'];
const SECTIONS = ['A', 'B', 'C', 'D'];

const BehaviorFilterSidebar = ({
  grades = [], selectedGrade, onGradeChange, selectedSection, onSectionChange,
  term, onTermChange, session, onSessionChange, onSetAllRatings, onSave, saving
}) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-500">
        <Filter className="w-3.5 h-3.5 text-blue-600" /> Class & Term Scope
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select Class / Grade</label>
        <select
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-xl text-xs font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Section</label>
        <div className="flex gap-1.5">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSectionChange(sec)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSection === sec
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Term</label>
          <select
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            className="w-full px-2.5 py-1.5 border rounded-xl text-xs font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Session</label>
          <input
            type="text"
            value={session}
            onChange={(e) => onSessionChange(e.target.value)}
            className="w-full px-2.5 py-1.5 border rounded-xl text-xs font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>

    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/40 space-y-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" /> 1-Click Batch Automation
      </div>
      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={() => onSetAllRatings(5, 'Exemplary')}
          className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" /> Set All Exemplary (5/5)
        </button>
        <button
          type="button"
          onClick={() => onSetAllRatings(4, 'Good')}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <ThumbsUp className="w-3.5 h-3.5" /> Set All Good (4/5)
        </button>
      </div>
    </div>

    <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 space-y-1.5 text-[11px]">
      <div className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
        <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Rating Scale Guide
      </div>
      <div className="text-gray-500 dark:text-gray-400 space-y-0.5">
        <div><span className="font-bold text-emerald-600">5:</span> Outstanding / Exemplary</div>
        <div><span className="font-bold text-blue-600">4:</span> Very Good / Commendable</div>
        <div><span className="font-bold text-cyan-600">3:</span> Satisfactory / Normal</div>
        <div><span className="font-bold text-amber-600">2:</span> Fair / Room to Improve</div>
        <div><span className="font-bold text-rose-600">1:</span> Needs Urgent Improvement</div>
      </div>
    </div>

    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
    >
      {saving ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {saving ? 'Saving Records...' : '✓ Save Class Behavior Sheet'}
    </button>
  </div>
);

export default BehaviorFilterSidebar;

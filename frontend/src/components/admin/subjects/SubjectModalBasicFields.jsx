import { AlertCircle } from 'lucide-react';
import SubjectToggle from './SubjectToggle';

const SubjectModalBasicFields = ({
  formData, touched, isNameValid, isCodeValid, isManualCode, campuses = [],
  onNameChange, onCodeChange, onResetAutoCode, onFieldChange, onBlur
}) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark">
            Subject Name <span className="text-bad">*</span>
          </label>
          {!isManualCode && formData.code && (
            <span className="text-[11px] text-primary dark:text-primary-dark font-medium">Auto-code active</span>
          )}
        </div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onNameChange}
          onBlur={() => onBlur('name')}
          placeholder="e.g. Computer Science"
          className={`w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border ${
            touched.name && !isNameValid ? 'border-bad focus:ring-bad' : 'border-line dark:border-white/10 focus:border-primary'
          } text-ink dark:text-ink-dark outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
        />
        {touched.name && !isNameValid && (
          <p className="flex items-center gap-1 text-xs text-bad mt-1">
            <AlertCircle className="w-3.5 h-3.5" /> Enter valid name (1-50 characters)
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark">
            Subject Code <span className="text-bad">*</span>
          </label>
          <div className="flex items-center gap-2">
            {!isManualCode && formData.code ? (
              <span className="text-[11px] text-good dark:text-good-dark font-medium">Auto-fill active</span>
            ) : null}
            {isManualCode && (
              <button type="button" onClick={onResetAutoCode} className="text-[11px] text-primary hover:underline cursor-pointer">
                Reset to auto-code
              </button>
            )}
          </div>
        </div>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={onCodeChange}
          onBlur={() => onBlur('code')}
          placeholder="e.g. CS / MATH"
          className={`w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border ${
            touched.code && !isCodeValid ? 'border-bad focus:ring-bad' : 'border-line dark:border-white/10 focus:border-primary'
          } text-ink dark:text-ink-dark uppercase font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
        />
        {touched.code && !isCodeValid && (
          <p className="flex items-center gap-1 text-xs text-bad mt-1">
            <AlertCircle className="w-3.5 h-3.5" /> Enter valid alphanumeric code (1-20 characters)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Campus (Optional)</label>
          <select
            name="campus_id"
            value={formData.campus_id}
            onChange={(e) => onFieldChange('campus_id', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
          >
            <option value="">All Campuses (Global)</option>
            {campuses.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => onFieldChange('status', e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10">
        <div>
          <p className="text-xs font-semibold text-ink dark:text-ink-dark">Mandatory Subject</p>
          <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">Compulsory for enrolled students in grade</p>
        </div>
        <SubjectToggle checked={formData.mandatory} onChange={(val) => onFieldChange('mandatory', val)} ariaLabel="Mandatory toggle" />
      </div>
    </div>
  );
};

export default SubjectModalBasicFields;

import { CalendarCheck } from 'lucide-react';

const StudentEnrollmentStatusCard = ({ formData, onChange }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <CalendarCheck className="w-4 h-4 text-primary" />
        <span>Enrollment & Status Details</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">GR / Admission Number</label>
          <input
            type="text"
            value={formData.gr_number || ''}
            onChange={(e) => onChange('gr_number', e.target.value)}
            placeholder="Auto-generated on creation"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Admission Date</label>
          <input
            type="date"
            value={formData.admission_date || ''}
            onChange={(e) => onChange('admission_date', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Religion</label>
          <select
            value={formData.religion || 'Islam'}
            onChange={(e) => onChange('religion', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none"
          >
            <option value="Islam">Islam</option>
            <option value="Christianity">Christianity</option>
            <option value="Hinduism">Hinduism</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Enrollment Status</label>
          <select
            value={formData.status || 'Active'}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none"
          >
            <option value="Active">Active</option>
            <option value="Left">Left</option>
            <option value="Graduated">Graduated</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentStatusCard;

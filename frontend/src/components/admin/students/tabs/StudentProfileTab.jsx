import { User, School, Calendar, DollarSign, Award, Layers } from 'lucide-react';

const StudentProfileTab = ({ formData, campuses, grades, onChange }) => {
  const selectedCampusGrades = grades.filter((g) => {
    if (!formData.campus_id) return true;
    const gCampId = g.campus_id?._id || g.campus_id;
    return !gCampId || gCampId === formData.campus_id;
  });

  const admittedGradeObj = grades.find((g) => (g._id === formData.grade_admitted));
  const currentGradeObj = grades.find((g) => (g._id === formData.current_grade));

  const admittedSections = admittedGradeObj?.sections || ['A', 'B', 'C', 'D'];
  const currentSections = currentGradeObj?.sections || ['A', 'B', 'C', 'D'];

  const netMonthly = Math.max(0, Number(formData.monthly_fee || 0) - Number(formData.discount || 0));

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <User className="w-4 h-4 text-primary" />
          <span>Basic Student Identity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Full Name <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. Muhammad Ali"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Father Name <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.father_name || ''}
              onChange={(e) => onChange('father_name', e.target.value)}
              placeholder="e.g. Tariq Mehmood"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Surname / Caste
            </label>
            <input
              type="text"
              value={formData.surname || ''}
              onChange={(e) => onChange('surname', e.target.value)}
              placeholder="e.g. Khan, Sheikh"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Gender
            </label>
            <select
              value={formData.gender || 'Male'}
              onChange={(e) => onChange('gender', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dob || ''}
              onChange={(e) => onChange('dob', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              B-Form / CNIC No.
            </label>
            <input
              type="text"
              value={formData.b_form || ''}
              onChange={(e) => onChange('b_form', e.target.value)}
              placeholder="42101-1234567-1"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Religion
            </label>
            <select
              value={formData.religion || 'Islam'}
              onChange={(e) => onChange('religion', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              <option value="Islam">Islam</option>
              <option value="Christianity">Christianity</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Enrollment Status
            </label>
            <select
              value={formData.status || 'Active'}
              onChange={(e) => onChange('status', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              <option value="Active">Active</option>
              <option value="Left">Left</option>
              <option value="Graduated">Graduated</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Admission Date
            </label>
            <input
              type="date"
              value={formData.admission_date || ''}
              onChange={(e) => onChange('admission_date', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <School className="w-4 h-4 text-primary" />
          <span>Campus & Academic Placement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Campus <span className="text-bad">*</span>
            </label>
            <select
              required
              value={formData.campus_id || ''}
              onChange={(e) => onChange('campus_id', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              <option value="">Select Campus</option>
              {campuses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Class Admitted
            </label>
            <select
              value={formData.grade_admitted || ''}
              onChange={(e) => {
                onChange('grade_admitted', e.target.value);
                if (!formData.current_grade) onChange('current_grade', e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              <option value="">Select Admitted Class</option>
              {selectedCampusGrades.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Section Admitted
            </label>
            <select
              value={formData.section_admitted || 'A'}
              onChange={(e) => onChange('section_admitted', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              {admittedSections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Current Class <span className="text-bad">*</span>
            </label>
            <select
              value={formData.current_grade || ''}
              onChange={(e) => onChange('current_grade', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              <option value="">Select Current Class</option>
              {selectedCampusGrades.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Current Section
            </label>
            <select
              value={formData.current_section || 'A'}
              onChange={(e) => onChange('current_section', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              {currentSections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              GR / Admission Number
            </label>
            <input
              type="text"
              value={formData.gr_number || ''}
              onChange={(e) => onChange('gr_number', e.target.value)}
              placeholder="Auto-generated on creation"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none font-mono"
            />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <DollarSign className="w-4 h-4 text-primary" />
          <span>Fee & Tuition Structure</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Monthly Fee (PKR)
            </label>
            <input
              type="number"
              min="0"
              value={formData.monthly_fee || 0}
              onChange={(e) => onChange('monthly_fee', Number(e.target.value))}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Discount / Scholarship (PKR)
            </label>
            <input
              type="number"
              min="0"
              value={formData.discount || 0}
              onChange={(e) => onChange('discount', Number(e.target.value))}
              placeholder="e.g. 500"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary/80 dark:bg-[#141414] border border-line dark:border-white/10 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-ink-muted uppercase">Net Monthly Receivable</span>
            <span className="text-base font-extrabold text-primary">
              Rs. {netMonthly.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileTab;

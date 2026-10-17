import React from 'react';
import { User } from 'lucide-react';

export default function CrmBasicInfoCard({ formData, onChange, grades = [] }) {
  const handleDobChange = (e) => {
    const dob = e.target.value;
    onChange('dob', dob);
    if (dob) {
      const birth = new Date(dob);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      onChange('age', Math.max(0, age));
    }
  };

  return (
    <div className="bg-surface dark:bg-surface-dark p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2 border-b border-line dark:border-line-dark pb-2">
        <User className="w-4 h-4 text-primary" /> Basic Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Student Name *</label>
          <input required type="text" value={formData.student_name || ''} onChange={(e) => onChange('student_name', e.target.value)} placeholder="Student Name" className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-medium" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Father Name</label>
          <input type="text" value={formData.father_name || ''} onChange={(e) => onChange('father_name', e.target.value)} placeholder="Father Name" className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Surname</label>
          <input type="text" value={formData.surname || ''} onChange={(e) => onChange('surname', e.target.value)} placeholder="Surname" className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Target Class *</label>
          <select required value={formData.grade_id || ''} onChange={(e) => onChange('grade_id', e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-medium">
            <option value="">Select Class</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Country</label>
          <input type="text" value={formData.country || 'Pakistan'} onChange={(e) => onChange('country', e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-medium" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Contact Number *</label>
          <div className="flex gap-1">
            <input type="text" value={formData.contact_country_code || '+92'} onChange={(e) => onChange('contact_country_code', e.target.value)} className="w-14 px-2 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent text-center font-mono" />
            <input required type="text" value={formData.contact_number || ''} onChange={(e) => onChange('contact_number', e.target.value)} placeholder="3001234567" className="flex-1 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-mono" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Gender</label>
          <select value={formData.gender || ''} onChange={(e) => onChange('gender', e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Date of Birth</label>
          <input type="date" value={formData.dob ? String(formData.dob).substring(0, 10) : ''} onChange={handleDobChange} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Age (Years)</label>
          <input type="number" value={formData.age ?? ''} onChange={(e) => onChange('age', Number(e.target.value))} placeholder="Age" className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-medium" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Session</label>
          <input type="text" value={formData.academic_session || '2026-2027'} onChange={(e) => onChange('academic_session', e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-medium" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Email (Optional)</label>
          <input type="email" value={formData.email || ''} onChange={(e) => onChange('email', e.target.value)} placeholder="parent@example.com" className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Inquiry Date</label>
          <input type="date" value={formData.inquiry_date ? String(formData.inquiry_date).substring(0, 10) : ''} onChange={(e) => onChange('inquiry_date', e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent" />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Message / Notes</label>
        <textarea rows={2} value={formData.message || ''} onChange={(e) => onChange('message', e.target.value)} placeholder="Inquiry notes..." className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-transparent" />
      </div>
    </div>
  );
}

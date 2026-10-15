import { Award, Building2, User, Mail, Phone, Calendar } from 'lucide-react';

const TeacherProfileHero = ({ teacher }) => {
  if (!teacher) return null;
  const initials = teacher.name
    ? teacher.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'TC';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/5 dark:to-transparent border border-primary/20 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 text-primary dark:text-primary-dark font-extrabold text-2xl flex items-center justify-center border-2 border-primary/30 overflow-hidden shadow-inner">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.name} className="w-full h-full object-cover" />
            ) : initials}
          </div>
          <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-good text-white shadow-xs">
            {teacher.status || 'Active'}
          </span>
        </div>

        <div className="flex-1 text-center md:text-left space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ink dark:text-ink-dark tracking-tight">
              {teacher.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white shadow-xs">
              {teacher.designation || 'Faculty Member'} {teacher.bps_grade ? `(BPS-${teacher.bps_grade})` : ''}
            </span>
          </div>

          <p className="text-xs text-ink-muted dark:text-ink-muted-dark flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span>{teacher.campus_id?.name || 'Main Campus'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>ID: {teacher.employee_code || teacher.personal_id || 'FAC-001'}</span>
            </span>
            {teacher.email && !teacher.email.includes('@school.local') && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>{teacher.email}</span>
              </span>
            )}
            {teacher.contact_number && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>{teacher.contact_number}</span>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileHero;

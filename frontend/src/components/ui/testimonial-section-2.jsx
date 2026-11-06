import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Building2, Calendar, Briefcase, Award } from 'lucide-react';

export default function Testimonial2({ students = [], teachers = [], title = 'Academic Community Spotlight' }) {
  const [selected, setSelected] = useState(null);

  const displayList = useMemo(() => {
    const mappedTeachers = (teachers || [])
      .filter((t) => t && t.name)
      .map((t) => {
        const campusStr = t.campus_id?.name || 'Main Campus';
        const desigStr = t.designation || 'Teacher';
        const deptStr = t.department ? ` • ${t.department}` : '';
        const quoteStr = t.specialization
          ? `Specialized in ${t.specialization}. Mentoring scholars toward academic excellence.`
          : (t.qualification
            ? `Academic qualification: ${t.qualification}. Dedicated educator at ${campusStr}.`
            : `Dedicated educator at ${campusStr}. Committed to nurturing the next generation.`);

        return {
          id: `teacher-${t._id || Math.random()}`,
          name: t.name,
          role: `${desigStr}${deptStr}`,
          type: 'Teacher',
          image: t.photo_url || '',
          quote: quoteStr,
          dateLabel: 'Joined',
          dateValue: t.joining_date ? new Date(t.joining_date).toLocaleDateString() : '—',
          campus: campusStr,
          status: t.status || 'Active',
          detailLabel: t.specialization ? 'Specialization' : 'Qualification',
          detailValue: t.specialization || t.qualification || 'Academics Faculty'
        };
      });

    const mappedStudents = (students || [])
      .filter((s) => s && s.name)
      .map((s) => {
        const gradeStr = s.current_grade?.name || 'Class';
        const sectionStr = s.current_section || 'A';
        const campusStr = s.campus_id?.name || 'Main Campus';
        const grStr = s.gr_number || '—';
        const quoteStr = s.elective_stream && s.elective_stream !== 'None'
          ? `Enrolled in ${s.elective_stream} stream. Actively committed to academic progress.`
          : `Registered scholar at ${campusStr}. Committed to academic excellence and personal growth.`;

        return {
          id: `student-${s._id || Math.random()}`,
          name: s.name,
          fatherName: s.father_name || '',
          role: `${gradeStr} - ${sectionStr} • GR: ${grStr}`,
          type: 'Student',
          image: s.photo_url || '',
          quote: quoteStr,
          dateLabel: 'Admitted',
          dateValue: s.admission_date ? new Date(s.admission_date).toLocaleDateString() : '—',
          campus: campusStr,
          status: s.status || 'Active',
          detailLabel: s.elective_stream && s.elective_stream !== 'None' ? 'Stream' : 'Section',
          detailValue: s.elective_stream && s.elective_stream !== 'None' ? s.elective_stream : sectionStr
        };
      });

    const combined = [];
    const maxLen = Math.max(mappedTeachers.length, mappedStudents.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < mappedTeachers.length) combined.push(mappedTeachers[i]);
      if (i < mappedStudents.length) combined.push(mappedStudents[i]);
    }

    return combined;
  }, [students, teachers]);

  if (displayList.length < 6) {
    return null;
  }

  const rowSize = Math.max(3, Math.ceil(displayList.length / 3));
  const row1 = displayList.slice(0, rowSize);
  const row2 = displayList.slice(rowSize, rowSize * 2);
  const row3 = displayList.slice(rowSize * 2);

  return (
    <div className="relative w-full py-10 sm:py-14 overflow-hidden rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-white/10 text-ink dark:text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 border border-primary/20">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Community</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-ink dark:text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-xl mx-auto">
          {`Dynamic interactive showcase featuring ${teachers.length} faculty member(s) and ${students.length} registered scholar(s).`}
        </p>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-0 z-0 opacity-10 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] border-y border-line dark:border-white/10 pointer-events-none" />

        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-surface dark:from-[#0c0c0f] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-surface dark:from-[#0c0c0f] to-transparent z-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 sm:gap-6 py-6 items-center justify-center overflow-hidden">
          {[row1, row2, row3].map((row, rowIndex) => {
            if (!row || row.length === 0) return null;
            return (
              <motion.div
                key={rowIndex}
                className="flex items-center gap-4 sm:gap-6 min-w-max"
                animate={{
                  x: rowIndex % 2 === 0 ? ['0%', '-25%'] : ['-25%', '0%']
                }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                {[...row, ...row, ...row, ...row].map((item, i) => (
                  <Capsule
                    key={`${item.id}-${rowIndex}-${i}`}
                    item={item}
                    onClick={() => setSelected(item)}
                  />
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-surface dark:bg-[#121214] text-ink dark:text-white p-6 sm:p-8 rounded-2xl border border-line dark:border-white/10 shadow-2xl z-50 space-y-5"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 pb-4 border-b border-line dark:border-white/10">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-line dark:border-white/20 bg-primary/10 flex items-center justify-center text-primary font-black text-lg shrink-0">
                  {selected.image ? (
                    <img
                      src={selected.image}
                      alt={selected.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span>
                      {selected.name ? selected.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'EP'}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-ink dark:text-white truncate">
                      {selected.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selected.type === 'Teacher'
                        ? 'bg-primary/15 text-primary border border-primary/25'
                        : 'bg-good/15 text-good border border-good/25'
                    }`}>
                      {selected.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-good/10 text-good border border-good/20">
                      {selected.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary truncate mt-0.5">
                    {selected.role}
                  </p>
                  {selected.fatherName && (
                    <p className="text-[11px] text-ink-muted truncate">
                      Father: {selected.fatherName}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-secondary/70 dark:bg-white/5 border border-line dark:border-white/5">
                <p className="text-sm font-medium text-ink-sub dark:text-ink-sub-dark italic leading-relaxed">
                  &ldquo;{selected.quote}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/5">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate text-ink-muted">
                    Campus: <strong className="text-ink dark:text-white">{selected.campus}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/5">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate text-ink-muted">
                    {selected.dateLabel}: <strong className="text-ink dark:text-white">{selected.dateValue}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/5">
                  {selected.type === 'Teacher' ? (
                    <Briefcase className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <Award className="w-4 h-4 text-primary shrink-0" />
                  )}
                  <span className="truncate text-ink-muted">
                    {selected.detailLabel}: <strong className="text-ink dark:text-white">{selected.detailValue}</strong>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Capsule({ item, onClick }) {
  const initials = item.name ? item.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'EP';
  const isTeacher = item.type === 'Teacher';

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="group flex items-center gap-3.5 p-2 pr-6 rounded-full bg-surface dark:bg-[#141416] border border-line dark:border-white/10 hover:border-primary/60 dark:hover:border-primary/60 hover:shadow-md cursor-pointer transition-all shrink-0"
    >
      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-line dark:border-white/10 group-hover:border-primary shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="flex flex-col items-start leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-ink dark:text-white group-hover:text-primary transition-colors max-w-[140px] truncate">
            {item.name}
          </span>
          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
            isTeacher
              ? 'bg-primary/15 text-primary border border-primary/25'
              : 'bg-good/15 text-good border border-good/25'
          }`}>
            {item.type}
          </span>
        </div>
        <span className="text-[11px] text-ink-muted max-w-[170px] truncate">
          {item.role}
        </span>
      </div>
    </motion.div>
  );
}

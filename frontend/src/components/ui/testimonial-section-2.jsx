import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Sparkles, Building2, Calendar, User } from 'lucide-react';

const FALLBACK_STUDENTS = [
  {
    id: 'fb-1',
    name: 'Ayan Ahmed',
    role: 'Class 10-A • GR: 1001',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    quote: 'Focused on science and technological innovations for national leadership.',
    admissionDate: '2024-03-15',
    campus: 'Main Branch',
    status: 'Active'
  },
  {
    id: 'fb-2',
    name: 'Fatima Noor',
    role: 'Class 9-B • GR: 1002',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    quote: 'Excelling in mathematics and language arts with high academic distinction.',
    admissionDate: '2024-04-10',
    campus: 'Main Branch',
    status: 'Active'
  },
  {
    id: 'fb-3',
    name: 'Muhammad Bilal',
    role: 'Class 8-A • GR: 1003',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    quote: 'Passionate about computer science, robotics, and creative problem solving.',
    admissionDate: '2024-05-02',
    campus: 'Main Branch',
    status: 'Active'
  },
  {
    id: 'fb-4',
    name: 'Zainab Bibi',
    role: 'Class 7-C • GR: 1004',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    quote: 'Engaged in extracurricular arts, literature, and school debate competitions.',
    admissionDate: '2024-06-12',
    campus: 'Main Branch',
    status: 'Active'
  },
  {
    id: 'fb-5',
    name: 'Hamza Tariq',
    role: 'Class 6-A • GR: 1005',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    quote: 'Consistently maintaining high attendance and positive behavioral ratings.',
    admissionDate: '2024-07-20',
    campus: 'Main Branch',
    status: 'Active'
  },
  {
    id: 'fb-6',
    name: 'Ayesha Siddiqui',
    role: 'Class 5-B • GR: 1006',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    quote: 'Aspiring healthcare professional with a passion for biological sciences.',
    admissionDate: '2024-08-01',
    campus: 'Main Branch',
    status: 'Active'
  },
  {
    id: 'fb-7',
    name: 'Usman Ghani',
    role: 'Class 4-A • GR: 1007',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    quote: 'Active participant in sports and STEM junior research activities.',
    admissionDate: '2024-08-15',
    campus: 'Main Branch',
    status: 'Active'
  },
  {
    id: 'fb-8',
    name: 'Maryam Asif',
    role: 'Class 3-A • GR: 1008',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    quote: 'Exemplary reading comprehension and creative storytelling abilities.',
    admissionDate: '2024-09-01',
    campus: 'Main Branch',
    status: 'Active'
  },
  {
    id: 'fb-9',
    name: 'Daniyal Raza',
    role: 'Class 2-B • GR: 1009',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    quote: 'Developing foundational literacy and collaborative classroom teamwork.',
    admissionDate: '2024-09-10',
    campus: 'Main Branch',
    status: 'Active'
  }
];

export default function Testimonial2({ students = [], title = 'Registered Scholars Spotlight' }) {
  const [selected, setSelected] = useState(null);

  const displayList = useMemo(() => {
    const realMapped = (students || []).map((s) => {
      const gradeStr = s.current_grade?.name || 'Class';
      const sectionStr = s.current_section || 'A';
      const campusStr = s.campus_id?.name || 'Main Branch';
      const grStr = s.gr_number || '—';
      const quoteStr = s.elective_stream && s.elective_stream !== 'None'
        ? `Enrolled in ${s.elective_stream} stream. Actively committed to academic progress.`
        : `Registered scholar at ${campusStr}. Committed to academic excellence and personal growth.`;

      return {
        id: s._id || String(Math.random()),
        name: s.name,
        fatherName: s.father_name || '',
        role: `${gradeStr} - ${sectionStr} • GR: ${grStr}`,
        image: s.photo_url || '',
        quote: quoteStr,
        admissionDate: s.admission_date ? new Date(s.admission_date).toLocaleDateString() : '—',
        campus: campusStr,
        status: s.status || 'Active',
        isReal: true
      };
    });

    if (realMapped.length >= 9) {
      return realMapped.slice(0, 18);
    }

    const needed = 9 - realMapped.length;
    const fillers = FALLBACK_STUDENTS.slice(0, needed).map((f) => ({ ...f, isReal: false }));
    return [...realMapped, ...fillers];
  }, [students]);

  const rowSize = Math.max(3, Math.ceil(displayList.length / 3));
  const row1 = displayList.slice(0, rowSize);
  const row2 = displayList.slice(rowSize, rowSize * 2);
  const row3 = displayList.slice(rowSize * 2);

  const hasAnyReal = students && students.length > 0;

  return (
    <div className="relative w-full py-10 sm:py-14 overflow-hidden rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-white/10 text-ink dark:text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 border border-primary/20">
          <GraduationCap className="w-4 h-4" />
          <span>Learner Community</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-ink dark:text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-xl mx-auto">
          {hasAnyReal
            ? `Dynamic interactive showcase featuring ${students.length} registered student(s) currently enrolled.`
            : 'Enrolled students will automatically populate this showcase upon admission.'}
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
                      {selected.name ? selected.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-ink dark:text-white">
                      {selected.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-good/10 text-good border border-good/20">
                      {selected.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary">
                    {selected.role}
                  </p>
                  {selected.fatherName && (
                    <p className="text-[11px] text-ink-muted">
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

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/5">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate text-ink-muted">
                    Campus: <strong className="text-ink dark:text-white">{selected.campus}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/5">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate text-ink-muted">
                    Admitted: <strong className="text-ink dark:text-white">{selected.admissionDate}</strong>
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
  const initials = item.name ? item.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';

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
        <span className="text-xs sm:text-sm font-bold text-ink dark:text-white group-hover:text-primary transition-colors">
          {item.name}
        </span>
        <span className="text-[11px] text-ink-muted">
          {item.role}
        </span>
      </div>
    </motion.div>
  );
}

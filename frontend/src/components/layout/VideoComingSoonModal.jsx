import { createPortal } from 'react-dom';
import { X, Play, Sparkles, BookOpen, Clock, Film } from 'lucide-react';

const UPCOMING_MODULES = [
  { title: 'Campus & Role Setup', duration: '08:45', category: 'Administration' },
  { title: 'Fee Structure & Challan Generation', duration: '12:30', category: 'Finance' },
  { title: 'Timetable Scheduling & Conflict Prevention', duration: '10:15', category: 'Academics' },
  { title: 'Examination Marks & Consolidated Cards', duration: '14:20', category: 'Exams' }
];

const VideoComingSoonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#111111] border border-line dark:border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="relative bg-gradient-to-br from-primary/90 via-primary to-teal-800 p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs text-white border border-white/25 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  EliteEdu Training Hub
                </span>
                <h3 className="text-base font-bold tracking-tight">Video Tutorials &amp; Masterclasses</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="relative rounded-xl border border-line dark:border-white/10 overflow-hidden bg-surface-secondary/40 dark:bg-black/40 p-5 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-xs">
              <Play className="w-6 h-6 fill-primary/20 ml-0.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-ink dark:text-white">High-Definition Tutorials in Production</h4>
              <p className="text-xs text-ink-muted leading-relaxed max-w-sm mx-auto">
                Comprehensive screen recordings with Urdu voiceover are being prepared to help your staff master every module in seconds.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-ink dark:text-white">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                Upcoming Video Curriculum
              </span>
              <span className="text-[11px] font-semibold text-primary">4 Masterclasses</span>
            </div>
            <div className="divide-y divide-line/60 dark:divide-white/5 border border-line dark:border-white/10 rounded-xl overflow-hidden bg-surface dark:bg-[#161616]">
              {UPCOMING_MODULES.map((mod, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-surface-secondary dark:bg-white/10 text-[10px] font-bold text-ink-muted flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink dark:text-white truncate">{mod.title}</p>
                      <span className="text-[10px] text-ink-muted font-medium">{mod.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-ink-muted shrink-0 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{mod.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end border-t border-line dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm shadow-primary/20 cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default VideoComingSoonModal;

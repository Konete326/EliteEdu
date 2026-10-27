import { useState, useEffect } from 'react';
import { Star, X, Save, Loader2, Sparkles, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

const CONDUCT_OPTIONS = [
  { id: 'Exemplary', label: 'Exemplary', icon: Sparkles, color: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { id: 'Good', label: 'Good', icon: ShieldCheck, color: 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 'Satisfactory', label: 'Satisfactory', icon: Star, color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { id: 'Needs Improvement', label: 'Needs Attention', icon: AlertCircle, color: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400' }
];

const PRESET_FEEDBACKS = [
  'Consistently disciplined and polite with peers.',
  'Active classroom participation and energetic attitude.',
  'Shows exemplary teamwork, honesty and punctuality.',
  'Attentive in lectures, completes classwork promptly.',
  'Needs to improve punctuality and homework submission.',
  'Requires teacher guidance to maintain focus during class.'
];

const DOMAIN_FIELDS = [
  { key: 'punctuality', domain: 'affective', label: 'Punctuality' },
  { key: 'discipline', domain: 'affective', label: 'Discipline' },
  { key: 'teamwork', domain: 'affective', label: 'Teamwork' },
  { key: 'communication', domain: 'psychomotor', label: 'Communication' },
  { key: 'creativity', domain: 'psychomotor', label: 'Creativity' }
];

export default function BehaviorEvaluationModal({
  isOpen,
  onClose,
  student,
  evaluation,
  onSave
}) {
  const [overallStars, setOverallStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [conduct, setConduct] = useState('Good');
  const [observation, setObservation] = useState('');
  const [affectiveRatings, setAffectiveRatings] = useState({});
  const [psychomotorRatings, setPsychomotorRatings] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (evaluation) {
      setConduct(evaluation.general_conduct || 'Good');
      setObservation(evaluation.teacher_observation || '');
      setAffectiveRatings(evaluation.affective_ratings || { punctuality: 5, discipline: 5, teamwork: 5, neatness: 5, obedience: 5 });
      setPsychomotorRatings(evaluation.psychomotor_ratings || { handwriting: 5, communication: 5, sports: 5, creativity: 5, computer_skills: 5 });
      const avg = evaluation.affective_ratings?.discipline || 5;
      setOverallStars(avg);
    } else {
      setConduct('Good');
      setObservation('');
      setOverallStars(5);
      setAffectiveRatings({ punctuality: 5, discipline: 5, teamwork: 5, neatness: 5, obedience: 5 });
      setPsychomotorRatings({ handwriting: 5, communication: 5, sports: 5, creativity: 5, computer_skills: 5 });
    }
  }, [evaluation, isOpen]);

  if (!isOpen || !student) return null;

  const handleStarClick = (num) => {
    setOverallStars(num);
    const mappedConduct = num === 5 ? 'Exemplary' : num === 4 ? 'Good' : num === 3 ? 'Satisfactory' : 'Needs Improvement';
    setConduct(mappedConduct);
    setAffectiveRatings((prev) => ({
      ...prev,
      punctuality: num,
      discipline: num,
      teamwork: num,
      neatness: num,
      obedience: num
    }));
    setPsychomotorRatings((prev) => ({
      ...prev,
      handwriting: num,
      communication: num,
      sports: num,
      creativity: num,
      computer_skills: num
    }));
  };

  const handleDomainChange = (domain, key, val) => {
    if (domain === 'affective') {
      setAffectiveRatings((prev) => ({ ...prev, [key]: val }));
    } else {
      setPsychomotorRatings((prev) => ({ ...prev, [key]: val }));
    }
  };

  const handleAddPreset = (txt) => {
    setObservation((prev) => {
      const clean = prev.trim();
      if (!clean) return txt;
      if (clean.includes(txt)) return clean;
      return `${clean} ${txt}`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        general_conduct: conduct,
        affective_ratings: affectiveRatings,
        psychomotor_ratings: psychomotorRatings,
        teacher_observation: observation.trim()
      };
      await onSave(student._id, payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const starDisplayValue = hoverStars || overallStars;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-5 py-4 border-b border-line dark:border-line-dark flex items-center justify-between gap-3 shrink-0 bg-surface-secondary/30 dark:bg-white/5">
          <div className="flex items-center gap-3 min-w-0">
            {student.photo_url ? (
              <img
                src={student.photo_url}
                alt={student.name}
                className="w-10 h-10 rounded-xl object-cover border border-line dark:border-line-dark shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center border border-primary/20 shrink-0">
                {(student.name || 'S').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-black text-sm text-ink dark:text-ink-dark truncate">{student.name}</h3>
              <p className="text-[11px] text-ink-muted truncate font-medium">
                Roll #{student.roll_number || 'N/A'} • Sec {student.current_section || 'A'} • GR {student.gr_number || 'N/A'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          <div className="p-4 rounded-2xl bg-surface-secondary/40 dark:bg-white/5 border border-line/60 dark:border-line-dark/60 text-center space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-wider text-ink-muted">
              Overall Student Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverStars(star)}
                  onMouseLeave={() => setHoverStars(0)}
                  onClick={() => handleStarClick(star)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= starDisplayValue
                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                        : 'text-line-dark dark:text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-ink dark:text-ink-dark">
              {starDisplayValue === 5 && '🌟 5 Stars • Exemplary Academic & Social Conduct'}
              {starDisplayValue === 4 && '⭐ 4 Stars • Good & Cooperative Behavior'}
              {starDisplayValue === 3 && '👍 3 Stars • Satisfactory Compliance'}
              {starDisplayValue === 2 && '⚠️ 2 Stars • Needs Attention & Guidance'}
              {starDisplayValue === 1 && '🚨 1 Star • Disciplinary Review Required'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              General Conduct Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONDUCT_OPTIONS.map((opt) => {
                const isSelected = conduct === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setConduct(opt.id)}
                    className={`p-2.5 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? opt.color + ' ring-2 ring-primary/40 shadow-xs'
                        : 'border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink-muted hover:text-ink'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="text-[11px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Core Behavioral Domains
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DOMAIN_FIELDS.map((f) => {
                const currentVal = f.domain === 'affective'
                  ? (affectiveRatings[f.key] ?? 5)
                  : (psychomotorRatings[f.key] ?? 5);
                return (
                  <div
                    key={f.key}
                    className="p-2.5 rounded-xl border border-line/60 dark:border-line-dark/60 bg-surface dark:bg-surface-dark flex items-center justify-between"
                  >
                    <span className="font-semibold text-ink dark:text-ink-dark text-[11px]">{f.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleDomainChange(f.domain, f.key, s)}
                          className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            size={13}
                            className={s <= currentVal ? 'text-amber-400 fill-amber-400' : 'text-line-dark dark:text-white/20'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Teacher Observation &amp; Feedback Notes
              </label>
              <span className="text-[10px] text-ink-faint">Report card synced</span>
            </div>
            <textarea
              rows={3}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Write detailed remarks or tap quick presets below..."
              className="w-full p-3 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark placeholder:text-ink-muted/50 focus:border-primary focus:outline-none transition-colors text-xs leading-relaxed"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_FEEDBACKS.map((txt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddPreset(txt)}
                  className="px-2.5 py-1 rounded-lg border border-line/60 dark:border-line-dark/60 bg-surface-secondary/50 dark:bg-white/5 hover:border-primary/50 text-[10px] text-ink-muted hover:text-ink transition-colors cursor-pointer"
                >
                  + {txt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line dark:border-line-dark">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saving ? 'Saving...' : 'Save Assessment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

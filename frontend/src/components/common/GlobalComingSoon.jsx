import { Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalComingSoon = ({
  title = 'Module Under Development',
  subtitle = 'Institutional Academic Studio',
  description = 'This section is being engineered for Milestone 2. Advanced workflows, automation, and real-time management will be available shortly.',
  icon: Icon = Clock,
  badge = 'Coming Soon',
  features = [],
  backUrl = null
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-ink-muted">
            {subtitle}
          </p>
        </div>

        {backUrl && (
          <button
            type="button"
            onClick={() => navigate(backUrl)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-bold text-ink dark:text-ink-dark hover:border-primary transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>
        )}
      </div>

      <div className="relative rounded-3xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-6 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-xs overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
          <Icon className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <span>{badge} • Under Active Engineering</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-ink dark:text-ink-dark tracking-tight pt-1">
            {title} Studio
          </h2>

          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {description}
          </p>
        </div>

        {features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-3xl pt-2">
            {features.map((feat, i) => {
              const FeatIcon = feat.icon || CheckCircle2;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-line/60 dark:border-line-dark/60 bg-surface-secondary/50 dark:bg-white/5 text-left space-y-1.5 transition-all hover:border-primary/40"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FeatIcon size={16} />
                  </div>
                  <h4 className="font-bold text-xs text-ink dark:text-ink-dark pt-1">{feat.title}</h4>
                  <p className="text-[11px] text-ink-muted leading-snug">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 text-ink-muted text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-good inline-block" />
          <span className="font-medium">Core institutional student records, fees, and attendance systems remain fully operational.</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalComingSoon;

import { useEffect } from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalComingSoon = ({
  title = 'Module Under Development',
  subtitle = 'Institutional Academic Studio',
  description = 'This section is being engineered for Milestone 2. Advanced workflows and automation will be available shortly.',
  icon: Icon = Clock,
  badge = 'Coming Soon',
  backUrl = null
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${title} - EliteEdu`;

    let meta = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
      created = true;
    } else {
      meta.setAttribute('data-prev-content', meta.content);
      meta.content = 'noindex, nofollow';
    }

    return () => {
      document.title = originalTitle;
      if (created && meta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta && meta.hasAttribute('data-prev-content')) {
        meta.content = meta.getAttribute('data-prev-content');
        meta.removeAttribute('data-prev-content');
      }
    };
  }, [title]);

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
          <Icon className="w-7 h-7 text-primary" />
        </div>

        <div className="space-y-1.5 max-w-xs mx-auto">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
            <span>{badge}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-ink dark:text-ink-dark tracking-tight">
            {title}
          </h2>

          <p className="text-xs text-ink-muted leading-relaxed">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => (backUrl ? navigate(backUrl) : navigate(-1))}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary text-xs font-bold text-ink dark:text-ink-dark hover:border-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default GlobalComingSoon;

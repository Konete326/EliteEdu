import { Clock, Sparkles } from 'lucide-react';

const ComingSoonPage = ({ title = 'Module' }) => {
  return (
    <div className="space-y-6">
      <div className="sticky top-[1px] z-10 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-sm pb-4 pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-[1px]">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">{title}</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Institutional module for {title.toLowerCase()}.</p>
        </div>
      </div>

      <div className="p-12 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm text-center flex flex-col items-center justify-center min-h-[380px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 rounded-full bg-accent text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1.5 max-w-md">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft text-primary dark:bg-primary/20 dark:text-primary-dark">
            Coming Soon
          </span>
          <h2 className="text-xl font-bold text-ink dark:text-ink-dark pt-1">
            {title} Module Under Development
          </h2>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            This section is being engineered for Milestone 2. Advanced workflows and data management will be available shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;

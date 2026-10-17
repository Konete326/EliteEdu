import { useEffect, useState } from 'react';
import { CheckCircle2, AlertOctagon, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = {
  success: { icon: CheckCircle2, color: 'text-emerald-500', bar: 'bg-emerald-500' },
  error: { icon: AlertOctagon, color: 'text-rose-500', bar: 'bg-rose-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bar: 'bg-amber-500' },
  info: { icon: Info, color: 'text-blue-500', bar: 'bg-blue-500' }
};

const ToastItem = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const { id, type = 'info', title, message, duration = 4000 } = toast;
  const cfg = ICONS[type] || ICONS.info;
  const Icon = cfg.icon;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(id);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [id, duration, onDismiss]);

  return (
    <div className="pointer-events-auto w-full max-w-sm bg-surface dark:bg-[#000000] border border-line dark:border-[#272730] rounded-2xl p-3.5 shadow-2xl relative overflow-hidden transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={`p-1 rounded-xl bg-current/10 ${cfg.color} shrink-0 mt-0.5`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          {title && <h5 className="text-xs font-bold text-ink dark:text-ink-dark leading-snug truncate">{title}</h5>}
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark leading-relaxed break-words">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-line dark:bg-white/5">
        <div className={`h-full ${cfg.bar} transition-all duration-75`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ToastItem;

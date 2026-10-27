import { useState } from 'react';
import { Download, Eye, RefreshCw, X } from 'lucide-react';

export const AttachmentMedia = ({ children, className = '' }) => (
  <div className={`overflow-hidden rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark ${className}`}>
    {children}
  </div>
);

export const AttachmentContent = ({ children, className = '' }) => (
  <div className={`space-y-0.5 min-w-0 ${className}`}>
    {children}
  </div>
);

export const AttachmentTitle = ({ children, className = '' }) => (
  <h4 className={`text-xs font-bold text-ink dark:text-ink-dark truncate ${className}`}>
    {children}
  </h4>
);

export const AttachmentDescription = ({ children, className = '' }) => (
  <p className={`text-[11px] text-ink-muted truncate ${className}`}>
    {children}
  </p>
);

export const AttachmentAction = ({ children, onClick, 'aria-label': ariaLabel, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className={`p-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:border-primary transition-colors cursor-pointer ${className}`}
  >
    {children}
  </button>
);

export const AttachmentActions = ({ children, className = '' }) => (
  <div className={`flex items-center gap-1.5 pt-1 ${className}`}>
    {children}
  </div>
);

export const Attachment = ({ children, state = 'done', className = '' }) => {
  const borderTone = state === 'error'
    ? 'border-bad/40 bg-bad/5'
    : state === 'uploading'
      ? 'border-warn/40 bg-warn/5'
      : 'border-line dark:border-line-dark bg-surface dark:bg-surface-dark';

  return (
    <div className={`p-3 rounded-2xl border ${borderTone} shadow-xs flex flex-col gap-2 transition-all w-52 ${className}`}>
      {children}
    </div>
  );
};

export default function AttachmentVertical({ items = [], onRemove, onRetry }) {
  const [internalItems, setInternalItems] = useState(
    items.length > 0
      ? items
      : [
          {
            id: '1',
            name: 'sample-document.png',
            size: '2.4 MB',
            url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&auto=format&fit=crop&q=80',
            state: 'done'
          }
        ]
  );

  const handleRemove = (id) => {
    if (onRemove) onRemove(id);
    else setInternalItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleRetry = (id) => {
    if (onRetry) onRetry(id);
    else setInternalItems((prev) => prev.map((it) => (it.id === id ? { ...it, state: 'done' } : it)));
  };

  return (
    <div className="flex flex-wrap gap-3">
      {internalItems.map((item) => (
        <Attachment key={item.id} state={item.state}>
          <AttachmentMedia>
            <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{item.name}</AttachmentTitle>
            <AttachmentDescription>
              {item.state === 'uploading'
                ? 'Uploading...'
                : item.state === 'error'
                  ? 'Failed to upload'
                  : `File • ${item.size}`}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            {item.state === 'error' && (
              <AttachmentAction aria-label="Retry upload" onClick={() => handleRetry(item.id)}>
                <RefreshCw className="w-3.5 h-3.5 text-bad animate-spin" />
              </AttachmentAction>
            )}
            {item.state === 'done' && (
              <>
                <AttachmentAction aria-label="Preview">
                  <Eye className="w-3.5 h-3.5" />
                </AttachmentAction>
                <AttachmentAction aria-label="Download">
                  <Download className="w-3.5 h-3.5" />
                </AttachmentAction>
              </>
            )}
            <AttachmentAction aria-label={`Remove ${item.name}`} onClick={() => handleRemove(item.id)}>
              <X className="w-3.5 h-3.5" />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Columns, Check } from 'lucide-react';

const ColumnVisibilityMenu = ({ columns, onToggleColumn }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface-secondary/70 hover:bg-surface-secondary text-xs font-semibold text-ink-sub hover:text-ink transition-colors cursor-pointer shadow-2xs"
      >
        <Columns size={13} className="text-primary" />
        <span>Column visibility</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-56 max-h-72 overflow-y-auto rounded-xl border border-line bg-surface p-2 shadow-xl z-50 space-y-1">
          <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider px-2 py-1 border-b border-line">
            Visible Columns
          </div>
          {columns.map((col) => (
            <button
              key={col.key}
              type="button"
              onClick={() => onToggleColumn(col.key)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-surface-secondary text-ink text-left transition-colors cursor-pointer"
            >
              <span className="truncate">{col.label}</span>
              <span
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  col.visible ? 'bg-primary border-primary text-white' : 'border-line'
                }`}
              >
                {col.visible && <Check size={11} strokeWidth={3} />}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnVisibilityMenu;

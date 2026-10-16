import { Search, Trash2 } from 'lucide-react';

const SessionTopBar = ({ searchIp, setSearchIp, showRevoked, setShowRevoked, onOpenRevokeAll, onResetPage }) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={searchIp}
            onChange={(e) => {
              setSearchIp(e.target.value);
              onResetPage();
            }}
            placeholder="Filter by IP address..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowRevoked(!showRevoked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              showRevoked ? 'bg-[#e11d48]' : 'bg-line dark:bg-line-dark'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showRevoked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-xs font-semibold text-ink dark:text-ink-dark">Show Revoked</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenRevokeAll}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#e11d48] hover:bg-[#be123c] text-white shadow-xs transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4" /> Revoke All
      </button>
    </div>
  );
};

export default SessionTopBar;

import { Hash, User, Shield, GraduationCap, CheckCircle2 } from 'lucide-react';

const MessengerHeader = ({ activeTarget }) => {
  const isDirect = activeTarget.type === 'direct';
  const user = activeTarget.user;

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          {isDirect ? (
            user?.profile_picture ? (
              <img src={user.profile_picture} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />
            )
          ) : (
            <Hash className="w-4 h-4" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-ink dark:text-ink-dark truncate">{activeTarget.label}</h3>
            {isDirect && (
              <span className="px-2 py-0.5 rounded-md bg-surface-secondary text-[10px] font-bold text-ink-muted">
                {user?.role}
              </span>
            )}
          </div>
          <p className="text-[11px] text-ink-muted truncate">
            {isDirect ? (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Staff Member &bull; {user?.email}
              </span>
            ) : (
              `Institutional Channel &bull; Visible to authorized staff`
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 text-[11px] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Encrypted School Chat</span>
        </span>
      </div>
    </div>
  );
};

export default MessengerHeader;

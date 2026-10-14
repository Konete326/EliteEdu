import { Building2, Mail, Phone, Globe, MapPin, Eye, Pencil, Trash2 } from 'lucide-react';

const CampusCard = ({ campus, onView, onEdit, onDelete }) => {
  const isActive = campus.status === 'Active';
  const websiteUrl = campus.website
    ? campus.website.startsWith('http')
      ? campus.website
      : `https://${campus.website}`
    : '';

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(92,194,186,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        <div className="h-36 relative bg-gradient-to-br from-primary/25 via-primary/10 to-surface-secondary dark:from-primary/30 dark:via-primary/10 dark:to-[#141414] p-4 flex items-start justify-between border-b border-line/60 dark:border-white/5">
          <div className="w-14 h-14 rounded-2xl bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md border border-line dark:border-white/10 shadow-lg flex items-center justify-center text-primary dark:text-primary-dark group-hover:scale-105 transition-transform duration-300">
            <Building2 className="w-7 h-7" />
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              isActive
                ? 'bg-good-soft/90 dark:bg-good/20 text-good dark:text-good-dark border border-good/30'
                : 'bg-surface/80 dark:bg-surface-secondary-dark text-ink-muted dark:text-ink-muted-dark border border-line dark:border-line-dark'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-good dark:bg-good-dark' : 'bg-ink-muted'}`} />
            {campus.status}
          </span>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors line-clamp-1">
            {campus.name}
          </h3>

          <div className="space-y-2 text-xs text-ink-sub dark:text-ink-sub-dark">
            {campus.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-ink-muted dark:text-ink-muted-dark" />
                <span className="truncate">{campus.email}</span>
              </div>
            )}

            {campus.contact_number && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-ink-muted dark:text-ink-muted-dark" />
                <span className="truncate">{campus.contact_number}</span>
              </div>
            )}

            {campus.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 shrink-0 text-ink-muted dark:text-ink-muted-dark" />
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-primary dark:text-primary-dark hover:underline"
                >
                  {campus.website}
                </a>
              </div>
            )}

            {campus.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-ink-muted dark:text-ink-muted-dark" />
                <span className="line-clamp-2">{campus.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-line/60 dark:border-white/5 flex items-center justify-end gap-1.5 bg-surface-secondary/40 dark:bg-[#111111]/40">
        <button
          type="button"
          onClick={() => onView(campus)}
          title="View Details"
          className="p-2 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface dark:hover:bg-surface-secondary-dark transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onEdit(campus)}
          title="Edit Campus"
          className="p-2 rounded-lg text-ink-muted hover:text-primary dark:hover:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/20 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(campus)}
          title="Delete Campus"
          className="p-2 rounded-lg text-bad bg-bad-soft/50 dark:bg-bad/10 hover:bg-bad-soft dark:hover:bg-bad/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CampusCard;

import { Building2, Mail, Phone, Globe, MapPin, Calendar, Clock } from 'lucide-react';

const CampusDetailsView = ({ campus, onClose }) => {
  const isActive = campus.status === 'Active';
  const websiteUrl = campus.website
    ? campus.website.startsWith('http')
      ? campus.website
      : `https://${campus.website}`
    : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
        <div className="w-12 h-12 rounded-xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-ink dark:text-ink-dark truncate">{campus.name}</h4>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold ${
              isActive
                ? 'bg-good-soft dark:bg-good/20 text-good dark:text-good-dark'
                : 'bg-surface dark:bg-[#1f1f1f] text-ink-muted'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-good dark:bg-good-dark' : 'bg-ink-muted'}`} />
            {campus.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#0c0c0c] flex items-center gap-3">
          <Mail className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Official Email</p>
            <p className="font-medium text-ink dark:text-ink-dark truncate">
              {campus.email || 'Not provided'}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#0c0c0c] flex items-center gap-3">
          <Phone className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Contact Number</p>
            <p className="font-medium text-ink dark:text-ink-dark">
              {campus.contact_number || 'Not provided'}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#0c0c0c] flex items-center gap-3">
          <Globe className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Website</p>
            {campus.website ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary dark:text-primary-dark hover:underline truncate block"
              >
                {campus.website}
              </a>
            ) : (
              <p className="font-medium text-ink dark:text-ink-dark">Not provided</p>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#0c0c0c] flex items-start gap-3">
          <MapPin className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Campus Address</p>
            <p className="font-medium text-ink dark:text-ink-dark">
              {campus.address || 'Not provided'}
            </p>
          </div>
        </div>

        {campus.createdAt && (
          <div className="flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark pt-2 px-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created: {new Date(campus.createdAt).toLocaleDateString()}
            </span>
            {campus.updatedAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Updated: {new Date(campus.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-line dark:border-line-dark text-sm font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CampusDetailsView;

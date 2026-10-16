import { Building2, School, Mail, Phone, Globe, MapPin, Calendar, Clock } from 'lucide-react';
import DefaultCampusBanner from './DefaultCampusBanner';
import { useAuth } from '../../../context/AuthContext';

const CampusDetailsView = ({ campus, onClose }) => {
  const { user } = useAuth();
  const isActive = campus.status === 'Active';
  const hasImage = Boolean(campus.image_url || campus.image);
  const imageUrl = campus.image_url || campus.image;
  const websiteUrl = campus.website?.startsWith('http') ? campus.website : `https://${campus.website}`;
  const schoolLogo = campus.school_id?.logo_url || user?.school_logo || campus.logo;

  return (
    <div className="space-y-5">
      <div className="relative h-36 rounded-2xl overflow-hidden border border-line dark:border-white/10 p-4 flex items-end justify-between">
        {hasImage ? (
          <>
            <img src={imageUrl} alt={campus.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          </>
        ) : (
          <DefaultCampusBanner />
        )}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface/90 dark:bg-[#0c0c0c]/90 backdrop-blur-md border border-line dark:border-white/10 shadow-lg flex items-center justify-center p-1.5 overflow-hidden text-primary shrink-0">
            {schoolLogo ? (
              <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
            ) : hasImage ? (
              <School className="w-6 h-6" />
            ) : (
              <Building2 className="w-6 h-6" />
            )}
          </div>
          <div>
            <h4 className={`text-base font-bold truncate max-w-[260px] ${hasImage ? 'text-white' : 'text-ink dark:text-ink-dark'}`}>
              {campus.name}
            </h4>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-semibold backdrop-blur-md ${
              isActive ? 'bg-good-soft/90 text-good border border-good/30' : 'bg-surface/80 text-ink-muted'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-good' : 'bg-ink-muted'}`} />
              {campus.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#0c0c0c] flex items-center gap-3">
          <Mail className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Official Email</p>
            <p className="font-medium text-ink dark:text-ink-dark truncate">{campus.email || 'Not provided'}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#0c0c0c] flex items-center gap-3">
          <Phone className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Contact Number</p>
            <p className="font-medium text-ink dark:text-ink-dark">{campus.contact_number || 'Not provided'}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#0c0c0c] flex items-center gap-3">
          <Globe className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Website</p>
            {campus.website ? (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary dark:text-primary-dark hover:underline truncate block">
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
            <p className="font-medium text-ink dark:text-ink-dark">{campus.address || 'Not provided'}</p>
          </div>
        </div>

        {campus.createdAt && (
          <div className="flex items-center justify-between text-xs text-ink-muted dark:text-ink-muted-dark pt-2 px-1">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Created: {new Date(campus.createdAt).toLocaleDateString()}</span>
            {campus.updatedAt && (
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated: {new Date(campus.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-1">
        <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl border border-line dark:border-line-dark text-sm font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

export default CampusDetailsView;

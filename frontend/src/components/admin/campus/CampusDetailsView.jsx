import { Building2, School, Mail, Phone, Globe, MapPin, Calendar, Clock, GraduationCap, Users, BookOpen, ExternalLink, Compass, Check } from 'lucide-react';
import DefaultCampusBanner from './DefaultCampusBanner';
import { useAuth } from '../../../context/AuthContext';

const CampusDetailsView = ({
  campus,
  onClose,
  schoolLogo: propLogo,
  isActiveCampus,
  onQuickSwitch
}) => {
  const { user } = useAuth();
  if (!campus) return null;

  const isActive = campus.status === 'Active';
  const hasImage = Boolean(campus.image_url || campus.image);
  const imageUrl = campus.image_url || campus.image;
  const websiteUrl = campus.website
    ? (campus.website.startsWith('http') ? campus.website : `https://${campus.website}`)
    : '';
  const schoolLogo = propLogo || campus.school_id?.logo_url || user?.school_logo || campus.logo;
  const mapsUrl = campus.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${campus.name} ${campus.address}`)}`
    : '';

  return (
    <div className="space-y-4">
      <div className="relative h-32 rounded-2xl overflow-hidden border border-line dark:border-line-dark p-3.5 flex items-end justify-between">
        {hasImage ? (
          <>
            <img src={imageUrl} alt={campus.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          </>
        ) : (
          <DefaultCampusBanner />
        )}

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md border border-line dark:border-line-dark shadow-md flex items-center justify-center p-1.5 overflow-hidden text-primary shrink-0">
            {schoolLogo ? (
              <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
            ) : hasImage ? (
              <School className="w-5 h-5" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className={`text-sm sm:text-base font-black truncate max-w-[240px] sm:max-w-xs ${hasImage ? 'text-white' : 'text-ink dark:text-white'}`}>
              {campus.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                isActive ? 'bg-good text-white' : 'bg-surface/80 text-ink-muted'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-zinc-400'}`} />
                {campus.status}
              </span>

              {isActiveCampus && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent text-accent-ink">
                  <Compass size={10} /> Active Workspace
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-center">
        <div className="space-y-0.5">
          <span className="flex items-center justify-center gap-1 text-[10px] text-ink-muted font-semibold">
            <GraduationCap size={12} className="text-info dark:text-info-dark" /> Students
          </span>
          <p className="text-sm font-black font-mono text-ink dark:text-white">
            {campus.students_count || 0}
          </p>
        </div>
        <div className="space-y-0.5 border-x border-line dark:border-line-dark">
          <span className="flex items-center justify-center gap-1 text-[10px] text-ink-muted font-semibold">
            <Users size={12} className="text-primary dark:text-primary-dark" /> Faculty
          </span>
          <p className="text-sm font-black font-mono text-ink dark:text-white">
            {campus.teachers_count || 0}
          </p>
        </div>
        <div className="space-y-0.5">
          <span className="flex items-center justify-center gap-1 text-[10px] text-ink-muted font-semibold">
            <BookOpen size={12} className="text-good dark:text-good-dark" /> Classes
          </span>
          <p className="text-sm font-black font-mono text-ink dark:text-white">
            {campus.grades_count || 0}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark flex items-center gap-3">
          <Mail className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-ink-muted">Official Email</p>
            {campus.email ? (
              <a href={`mailto:${campus.email}`} className="font-bold text-ink dark:text-white hover:underline truncate block">
                {campus.email}
              </a>
            ) : (
              <p className="text-ink-muted">Not provided</p>
            )}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark flex items-center gap-3">
          <Phone className="w-4 h-4 text-good dark:text-good-dark shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-ink-muted">Contact Number</p>
            {campus.contact_number ? (
              <a href={`tel:${campus.contact_number}`} className="font-bold font-mono text-ink dark:text-white hover:underline block">
                {campus.contact_number}
              </a>
            ) : (
              <p className="text-ink-muted">Not provided</p>
            )}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark flex items-center gap-3">
          <Globe className="w-4 h-4 text-info dark:text-info-dark shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-ink-muted">Website</p>
            {websiteUrl ? (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline truncate block">
                {campus.website}
              </a>
            ) : (
              <p className="text-ink-muted">Not provided</p>
            )}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <MapPin className="w-4 h-4 text-bad dark:text-bad-dark shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] text-ink-muted">Campus Address</p>
              <p className="font-bold text-ink dark:text-white">{campus.address || 'Not provided'}</p>
            </div>
          </div>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-lg border border-line dark:border-line-dark text-[10px] font-bold text-primary hover:bg-primary/10 flex items-center gap-1 shrink-0"
            >
              <span>Map</span>
              <ExternalLink size={10} />
            </a>
          )}
        </div>

        {campus.createdAt && (
          <div className="flex items-center justify-between text-[10px] text-ink-muted font-mono pt-1 px-1">
            <span className="flex items-center gap-1"><Calendar size={12} /> Established: {new Date(campus.createdAt).toLocaleDateString()}</span>
            {campus.updatedAt && (
              <span className="flex items-center gap-1"><Clock size={12} /> Sync: {new Date(campus.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line dark:border-line-dark">
        <div>
          {!isActiveCampus && onQuickSwitch && (
            <button
              type="button"
              onClick={() => {
                onQuickSwitch(campus);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Compass size={12} />
              <span>Set as Active Workspace</span>
            </button>
          )}
          {isActiveCampus && (
            <span className="text-xs font-bold text-accent dark:text-accent-dark flex items-center gap-1">
              <Check size={14} /> Active Workspace
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CampusDetailsView;

import { Building2, School, Mail, Phone, Globe, MapPin, Eye, Pencil, Trash2, GraduationCap, Users, BookOpen, Check, Compass } from 'lucide-react';
import DefaultCampusBanner from './DefaultCampusBanner';
import { useAuth } from '../../../context/AuthContext';

const CampusCard = ({
  campus,
  isActiveCampus,
  onQuickSwitch,
  onView,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const isActive = campus.status === 'Active';
  const hasImage = Boolean(campus.image_url || campus.image);
  const imageUrl = campus.image_url || campus.image;
  const websiteUrl = campus.website
    ? (campus.website.startsWith('http') ? campus.website : `https://${campus.website}`)
    : '';
  const schoolLogo = campus.school_id?.logo_url || user?.school_logo || campus.logo;

  return (
    <div
      className={`rounded-2xl border bg-surface dark:bg-surface-dark shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group ${
        isActiveCampus
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-line dark:border-line-dark'
      }`}
    >
      <div>
        <div className="h-36 relative overflow-hidden p-3.5 flex items-start justify-between border-b border-line dark:border-line-dark">
          {hasImage ? (
            <>
              <img
                src={imageUrl}
                alt={campus.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </>
          ) : (
            <DefaultCampusBanner />
          )}

          <div className="relative z-10 w-11 h-11 rounded-xl bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-md border border-line dark:border-line-dark shadow-md flex items-center justify-center p-1.5 overflow-hidden text-primary group-hover:scale-105 transition-transform">
            {schoolLogo ? (
              <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
            ) : hasImage ? (
              <School className="w-5 h-5" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>

          <div className="relative z-10 flex items-center gap-1.5 flex-wrap justify-end">
            {isActiveCampus && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent text-accent-ink shadow-xs backdrop-blur-md">
                <Compass size={10} /> Active Workspace
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                isActive
                  ? 'bg-good text-white shadow-xs'
                  : 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted border border-line dark:border-line-dark'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-ink-muted'}`} />
              {campus.status}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3.5">
          <div>
            <h3 className="text-sm font-black text-ink dark:text-white group-hover:text-primary transition-colors truncate">
              {campus.name}
            </h3>
            <p className="text-[11px] text-ink-muted truncate">
              {campus.address || 'Physical Branch'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark text-center">
            <div className="space-y-0.5">
              <span className="flex items-center justify-center gap-1 text-[10px] text-ink-muted font-semibold">
                <GraduationCap size={11} className="text-info dark:text-info-dark" /> Students
              </span>
              <p className="text-xs font-bold font-mono text-ink dark:text-white">
                {campus.students_count || 0}
              </p>
            </div>
            <div className="space-y-0.5 border-x border-line dark:border-line-dark">
              <span className="flex items-center justify-center gap-1 text-[10px] text-ink-muted font-semibold">
                <Users size={11} className="text-primary dark:text-primary-dark" /> Faculty
              </span>
              <p className="text-xs font-bold font-mono text-ink dark:text-white">
                {campus.teachers_count || 0}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="flex items-center justify-center gap-1 text-[10px] text-ink-muted font-semibold">
                <BookOpen size={11} className="text-good dark:text-good-dark" /> Classes
              </span>
              <p className="text-xs font-bold font-mono text-ink dark:text-white">
                {campus.grades_count || 0}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-ink-muted">
            {campus.email && (
              <a
                href={`mailto:${campus.email}`}
                className="flex items-center gap-2 hover:text-ink dark:hover:text-white transition-colors truncate"
              >
                <Mail size={13} className="shrink-0 text-primary" />
                <span className="truncate">{campus.email}</span>
              </a>
            )}

            {campus.contact_number && (
              <a
                href={`tel:${campus.contact_number}`}
                className="flex items-center gap-2 hover:text-ink dark:hover:text-white transition-colors truncate"
              >
                <Phone size={13} className="shrink-0 text-good dark:text-good-dark" />
                <span className="truncate font-mono">{campus.contact_number}</span>
              </a>
            )}

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline transition-colors truncate"
              >
                <Globe size={13} className="shrink-0" />
                <span className="truncate">{campus.website}</span>
              </a>
            )}

            {campus.address && (
              <div className="flex items-start gap-2 truncate">
                <MapPin size={13} className="shrink-0 text-bad dark:text-bad-dark mt-0.5" />
                <span className="truncate">{campus.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-line dark:border-line-dark flex items-center justify-between gap-2 bg-surface-secondary/40 dark:bg-surface-secondary-dark/40">
        <div>
          {isActiveCampus ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-accent dark:text-accent-dark">
              <Check size={13} /> Active
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onQuickSwitch(campus)}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-primary/10 hover:bg-primary text-primary hover:text-white transition-all cursor-pointer flex items-center gap-1"
            >
              <Compass size={11} /> Switch
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(campus)}
            title="View Details"
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(campus)}
            title="Edit Campus"
            className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(campus)}
            title="Delete Campus"
            className="p-1.5 rounded-lg text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampusCard;

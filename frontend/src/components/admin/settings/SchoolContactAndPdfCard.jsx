import { Phone, Mail, Globe, MapPin, Wand2, UserCheck } from 'lucide-react';
import SchoolInfoInput from './SchoolInfoInput';

const SLOGAN_SUGGESTIONS = [
  'Strive for Excellence',
  'Knowledge is Light • علم بڑی دولت ہے',
  'Enter to Learn, Go Forth to Serve',
  'Discipline, Faith, Unity'
];

const formatPakistaniPhone = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('92')) {
    const rest = digits.slice(2);
    if (rest.length <= 3) return `+92 ${rest}`;
    return `+92 ${rest.slice(0, 3)} ${rest.slice(3, 10)}`;
  }
  if (digits.startsWith('03')) {
    const rest = digits.slice(1);
    if (rest.length <= 3) return `+92 ${rest}`;
    return `+92 ${rest.slice(0, 3)} ${rest.slice(3, 10)}`;
  }
  return value;
};

const formatWebsiteUrl = (val) => {
  if (!val) return '';
  const clean = val.trim();
  if (clean && !clean.startsWith('http://') && !clean.startsWith('https://')) {
    return `https://${clean}`;
  }
  return clean;
};

const SchoolContactAndPdfCard = ({ settings, onChange }) => {
  const handlePhoneChange = (val) => {
    onChange('contact_number', formatPakistaniPhone(val));
  };

  const handleWebsiteBlur = () => {
    if (settings.website) {
      onChange('website', formatWebsiteUrl(settings.website));
    }
  };

  const autoFillDomainAndMotto = () => {
    if (!settings.name) return;
    const slug = settings.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
    if (!settings.email) onChange('email', `info@${slug || 'school'}.edu.pk`);
    if (!settings.website) onChange('website', `https://${slug || 'school'}.edu.pk`);
    if (!settings.slogan) onChange('slogan', 'Excellence in Education & Character Building');
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center shrink-0">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-ink dark:text-ink-dark">
              Communication &amp; Official Document Parameters
            </h3>
            <p className="text-[10px] text-ink-muted">
              Slogan, campus contacts, head of institution, and legal physical premises
            </p>
          </div>
        </div>

        {settings.name && (
          <button
            type="button"
            onClick={autoFillDomainAndMotto}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-Generate Domain &amp; Motto</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <SchoolInfoInput
            label="Official School Slogan / Motto"
            value={settings.slogan}
            onChange={(val) => onChange('slogan', val)}
            placeholder="e.g. Strive for Excellence"
          />
          <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
            <span className="text-[10px] text-ink-muted font-medium">Quick Ideas:</span>
            {SLOGAN_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange('slogan', s)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer truncate max-w-[200px] ${
                  settings.slogan === s
                    ? 'bg-primary text-white border-primary font-bold'
                    : 'bg-surface-secondary/50 dark:bg-[#161616] border-line/70 dark:border-white/10 text-ink dark:text-ink-dark hover:border-primary/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <SchoolInfoInput
          label="Principal / Head Name"
          value={settings.principal_name}
          onChange={(val) => onChange('principal_name', val)}
          placeholder="e.g. Prof. Muhammad Tariq"
          icon={UserCheck}
        />

        <SchoolInfoInput
          label="Official Email"
          value={settings.email}
          onChange={(val) => onChange('email', val)}
          placeholder="info@school.edu.pk"
          icon={Mail}
        />

        <div>
          <SchoolInfoInput
            label="Contact Number"
            value={settings.contact_number}
            onChange={handlePhoneChange}
            placeholder="+92 300 1234567"
            icon={Phone}
          />
          <p className="text-[9px] text-ink-muted mt-1">Auto-formats to Pakistani standard</p>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark mb-0.5">
            Official Website
          </label>
          <div className="relative">
            <input
              type="text"
              value={settings.website || ''}
              onChange={(e) => onChange('website', e.target.value)}
              onBlur={handleWebsiteBlur}
              placeholder="https://school.edu.pk"
              className="w-full pl-3 pr-8 py-1.5 rounded-lg text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
            <Globe className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark mb-0.5">
            Physical Campus Address (Printed on Admission Reports &amp; Letters)
          </label>
          <div className="relative">
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="e.g. Plot 14-B, Sector 5-J, Korangi Industrial Area, Karachi, Pakistan"
              className="w-full pl-3 pr-8 py-1.5 rounded-lg text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
            <MapPin className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolContactAndPdfCard;

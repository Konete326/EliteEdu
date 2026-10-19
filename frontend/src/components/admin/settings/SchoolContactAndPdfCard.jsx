import { Phone, Mail, Globe, MapPin, Sparkles, UserCheck } from 'lucide-react';
import SchoolInfoInput from './SchoolInfoInput';

const SchoolContactAndPdfCard = ({ settings, onChange }) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-white/10">
        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-ink dark:text-ink-dark">
            Communication & PDF Document Parameters
          </h3>
          <p className="text-[10px] text-ink-muted">Slogan, contact info, and authority signatures printed on documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div className="sm:col-span-2">
          <SchoolInfoInput
            label="Official School Slogan / Motto"
            value={settings.slogan}
            onChange={(val) => onChange('slogan', val)}
            placeholder="e.g. Strive for Excellence"
          />
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

        <SchoolInfoInput
          label="Contact Number"
          value={settings.contact_number}
          onChange={(val) => onChange('contact_number', val)}
          placeholder="+92 300 1234567"
          icon={Phone}
        />

        <SchoolInfoInput
          label="Official Website"
          value={settings.website}
          onChange={(val) => onChange('website', val)}
          placeholder="https://school.edu.pk"
          icon={Globe}
        />

        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark mb-0.5">
            Physical Campus Address (Printed on Admission Reports & Letters)
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

import { Phone, Mail, Globe, MapPin, Sparkles, UserCheck } from 'lucide-react';

const SchoolContactAndPdfCard = ({ settings, onChange }) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-line dark:border-white/10">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark">
            Communication & PDF Document Parameters
          </h3>
          <p className="text-[11px] text-ink-muted">Slogan, contact info, and authority signatures printed on documents</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Official School Slogan / Motto (Printed on All Letters & ID Cards)
          </label>
          <input
            type="text"
            value={settings.slogan || ''}
            onChange={(e) => onChange('slogan', e.target.value)}
            placeholder="e.g. Strive for Excellence (optional)"
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary font-medium"
          />
          <p className="text-[10px] text-ink-muted mt-1">Supports English, Urdu, or regional script</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Official Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="info@school.edu.pk"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
              <Mail className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Contact / Helpdesk Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.contact_number || ''}
                onChange={(e) => onChange('contact_number', e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
              <Phone className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Official Website / Web Portal
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.website || ''}
                onChange={(e) => onChange('website', e.target.value)}
                placeholder="https://school.edu.pk"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
              <Globe className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Principal / Head of Institution
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.principal_name || ''}
                onChange={(e) => onChange('principal_name', e.target.value)}
                placeholder="e.g. Prof. Muhammad Tariq"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
              <UserCheck className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Physical Campus Address (Printed on Admission Reports & Letters)
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={settings.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="e.g. Plot 14-B, Sector 5-J, Korangi Industrial Area, Karachi, Pakistan"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary resize-none"
            />
            <MapPin className="w-3.5 h-3.5 text-ink-muted absolute right-3.5 top-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolContactAndPdfCard;

const SchoolInfoInput = ({
  label, value, onChange, placeholder, icon: Icon, required = false, mono = false
}) => (
  <div>
    <label className="block text-[11px] font-semibold text-ink-sub dark:text-ink-sub-dark mb-0.5 truncate">
      {label} {required && <span className="text-bad">*</span>}
    </label>
    <div className="relative">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-3 ${Icon ? 'pr-8' : 'pr-3'} py-1.5 rounded-lg text-xs bg-surface-secondary/40 dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary ${
          mono ? 'font-mono' : ''
        }`}
      />
      {Icon && <Icon className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-2 pointer-events-none" />}
    </div>
  </div>
);

export default SchoolInfoInput;

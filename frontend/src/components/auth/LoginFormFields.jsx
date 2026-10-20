import { Eye, EyeOff } from 'lucide-react';

const LoginFormFields = ({
  role,
  isStudent,
  identifier,
  setIdentifier,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  idError
}) => {
  const getPlaceholder = () => {
    if (isStudent) return 'GR Number (e.g. 183201) or phone';
    if (role === 'Teacher') return 'Email or Employee Code (e.g. EMP-1001)';
    return 'admin@school.edu or username';
  };

  return (
    <>
      <div>
        <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
          {isStudent ? 'GR Number / Mobile' : role === 'Teacher' ? 'Email / Employee Code' : 'Work Email / Username'}
        </label>
        <input
          type="text"
          required
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full px-3.5 py-2.5 rounded-xl border border-line dark:border-line-dark bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-sm sm:text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {idError && <p className="text-bad text-[10px] mt-1">{idError}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isStudent ? 'Default: Your GR Number' : 'Enter account password'}
            className="w-full px-3.5 py-2.5 rounded-xl border border-line dark:border-line-dark bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-sm sm:text-xs font-medium focus:outline-none focus:ring-2 pr-10 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-ink-muted hover:text-ink rounded-lg transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginFormFields;

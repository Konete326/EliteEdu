const LoginHeader = ({ isStudent, role }) => (
  <div className="flex flex-col items-center text-center mb-4 sm:mb-5">
    <img src="/logo.png" alt="Elite Edu" className="w-12 h-12 sm:w-14 sm:h-14 object-contain mb-2 drop-shadow-md" />
    <h1 className="text-lg sm:text-xl font-black text-ink dark:text-ink-dark tracking-tight">Elite Educational ERP</h1>
    <p className="text-[11px] sm:text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
      {isStudent ? 'Student & Parent Access Portal' : role === 'Teacher' ? 'Faculty & Staff Sign In' : 'Institutional Admin Sign In'}
    </p>
  </div>
);

export default LoginHeader;

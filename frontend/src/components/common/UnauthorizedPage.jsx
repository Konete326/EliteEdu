const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark text-ink dark:text-ink-dark p-6">
    <div className="p-6 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl text-center">
      <h2 className="text-xl font-bold text-bad">Access Denied</h2>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1">You do not have permission to view this page.</p>
    </div>
  </div>
);

export default UnauthorizedPage;

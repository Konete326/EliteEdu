const CertificatesFilterInputs = ({ filters = {}, onFilterChange }) => {
  return (
    <>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Recipient Type</label>
        <select
          value={filters.recipient_type || 'all'}
          onChange={(e) => onFilterChange('recipient_type', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All (Student & Staff)</option>
          <option value="Student">Student</option>
          <option value="Staff">Staff</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Certificate Type</label>
        <select
          value={filters.certificate_type || 'all'}
          onChange={(e) => onFilterChange('certificate_type', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All Certificates</option>
          <option value="School Leaving Certificate">School Leaving Certificate</option>
          <option value="Character Certificate">Character Certificate</option>
          <option value="Certificate of Appreciation">Certificate of Appreciation</option>
          <option value="Merit Certificate">Merit Certificate</option>
          <option value="Experience Certificate">Experience Certificate</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Search</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Cert #, Recipient Name..."
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs placeholder:text-ink-muted"
        />
      </div>
    </>
  );
};

export default CertificatesFilterInputs;

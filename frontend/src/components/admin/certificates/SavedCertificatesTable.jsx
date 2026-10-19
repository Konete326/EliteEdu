import React, { useState } from 'react';
import { Eye, Printer, Trash2, Search, Award, Camera } from 'lucide-react';
import CameraScannerModal from '../../common/scanner/CameraScannerModal';

const SavedCertificatesTable = ({
  certificates = [], total = 0, page = 1, pages = 1, search = '',
  recipientType = 'all', onSearchChange, onRecipientTypeChange, onPageChange,
  onPreview, onPrintRow, onDelete
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleCameraScan = (code) => {
    let clean = String(code || '').trim();
    if (clean.includes('/verify/certificate/')) {
      const parts = clean.split('/verify/certificate/');
      clean = parts[parts.length - 1].split('?')[0].trim();
    }
    onSearchChange(clean);
    return { success: true, recipient_name: clean };
  };

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark shadow-xs p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-line dark:border-line-dark">
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-primary" /> Saved & Issued Certificates
          </h3>
          <p className="text-xs text-slate-500">History of all officially issued certificates with unique verifiable serials.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text" value={search} onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search serial or recipient..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-line bg-transparent text-xs w-48 sm:w-60"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            title="Scan Certificate QR"
          >
            <Camera size={13} />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
          <select value={recipientType} onChange={(e) => onRecipientTypeChange(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold">
            <option value="all">All Types</option>
            <option value="Student">Students</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-secondary/70 dark:bg-white/[0.03] border-b border-line text-[11px] font-bold text-ink-muted uppercase">
            <tr>
              <th className="py-2.5 px-3">Serial</th>
              <th className="py-2.5 px-3">Template</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Recipient</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {certificates.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-xs text-ink-muted">No certificates generated yet.</td></tr>
            ) : (
              certificates.map((c) => (
                <tr key={c._id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{c.certificate_no}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800 dark:text-white block">{c.template_name}</span>
                    <span className="text-[10px] text-ink-muted capitalize">{c.orientation || 'landscape'} • {c.design_style?.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">{c.recipient_type}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold block text-slate-800 dark:text-white">{c.recipient_name}</span>
                    <span className="text-[10px] text-ink-muted">{c.class_or_designation}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-ink-muted">
                    {new Date(c.issue_date || c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onPreview(c)} className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer"><Eye size={13} /></button>
                      <button onClick={() => onPrintRow(c)} className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer"><Printer size={13} /></button>
                      <button onClick={() => onDelete(c._id)} className="p-1.5 rounded-lg border border-line hover:bg-bad/10 text-ink-muted hover:text-bad cursor-pointer"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-ink-muted">
          <span>Page {page} of {pages} ({total} certificates)</span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 rounded-lg border border-line disabled:opacity-40 cursor-pointer">Prev</button>
            <button disabled={page >= pages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 rounded-lg border border-line disabled:opacity-40 cursor-pointer">Next</button>
          </div>
        </div>
      )}

      <CameraScannerModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onScan={handleCameraScan} title="Certificate QR Scanner" subtitle="Align printed certificate QR code to find record" />
    </div>
  );
};

export default SavedCertificatesTable;

import React, { useState } from 'react';
import { Eye, Printer, Trash2, Search, Award, Camera, Download } from 'lucide-react';
import CameraScannerModal from '../../common/scanner/CameraScannerModal';
import ConfirmModal from '../../common/ConfirmModal';

const SavedCertificatesTable = ({
  certificates = [],
  total = 0,
  page = 1,
  pages = 1,
  search = '',
  recipientType = 'all',
  onSearchChange,
  onRecipientTypeChange,
  onPageChange,
  onPreview,
  onPrintRow,
  onDownloadRow,
  onDelete
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
    <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark shadow-xs p-2.5 sm:p-3 space-y-1.5 h-[210px] max-h-[220px] xl:h-full xl:max-h-none flex flex-col justify-between text-xs min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1.5 border-b border-line dark:border-line-dark shrink-0">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span>Saved & Issued Certificates</span>
            <span className="px-1.5 py-0.2 rounded-md bg-primary/10 text-primary text-[10px] font-mono">
              {total}
            </span>
          </h3>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            History of officially issued certificates with unique verifiable serials.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search serial or name..."
              className="pl-7 pr-2.5 py-1 rounded-lg border border-line bg-transparent text-xs w-36 sm:w-52"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
            title="Scan Certificate QR"
          >
            <Camera size={12} />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
          <select
            value={recipientType}
            onChange={(e) => onRecipientTypeChange(e.target.value)}
            className="px-2 py-1 rounded-lg border border-line bg-transparent text-xs font-semibold"
          >
            <option value="all">All Types</option>
            <option value="Student">Students</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto rounded-xl border border-line dark:border-line-dark relative custom-scrollbar min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-surface dark:bg-surface-dark border-b border-line text-[10px] font-bold text-ink-muted uppercase shadow-2xs">
            <tr>
              <th className="py-1 px-3">Serial</th>
              <th className="py-1 px-3">Template</th>
              <th className="py-1 px-3">Type</th>
              <th className="py-1 px-3">Recipient</th>
              <th className="py-1 px-3">Date</th>
              <th className="py-1 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {certificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-xs text-ink-muted">
                  No certificates generated yet.
                </td>
              </tr>
            ) : (
              certificates.map((c) => (
                <tr key={c._id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="py-1 px-3 font-mono font-bold text-primary">
                    {c.certificate_no}
                  </td>
                  <td className="py-1 px-3">
                    <span className="font-bold text-slate-800 dark:text-white block">
                      {c.template_name}
                    </span>
                    <span className="text-[10px] text-ink-muted capitalize">
                      {c.orientation || 'landscape'} • {c.design_style?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-1 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {c.recipient_type}
                    </span>
                  </td>
                  <td className="py-1 px-3">
                    <span className="font-bold block text-slate-800 dark:text-white">
                      {c.recipient_name}
                    </span>
                    <span className="text-[10px] text-ink-muted">{c.class_or_designation}</span>
                  </td>
                  <td className="py-1 px-3 font-mono text-ink-muted">
                    {new Date(c.issue_date || c.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-1 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onPreview(c)}
                        className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-primary transition-colors cursor-pointer"
                        title="Load into Studio"
                      >
                        <Eye size={13} />
                      </button>
                      {onDownloadRow && (
                        <button
                          type="button"
                          onClick={() => onDownloadRow(c)}
                          className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-primary transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <Download size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onPrintRow(c)}
                        className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-primary transition-colors cursor-pointer"
                        title="Print A4"
                      >
                        <Printer size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(c)}
                        className="p-1.5 rounded-lg border border-line hover:bg-bad/10 text-ink-muted hover:text-bad transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between pt-1 text-[11px] text-ink-muted shrink-0">
          <span>
            Page {page} of {pages} ({total} certificates)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="px-2.5 py-0.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer"
            >
              Prev
            </button>
            <button
              disabled={page >= pages}
              onClick={() => onPageChange(page + 1)}
              className="px-2.5 py-0.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScan={handleCameraScan}
        title="Certificate QR Scanner"
        subtitle="Align printed certificate QR code to find record"
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget._id);
            setDeleteTarget(null);
          }
        }}
        title="Delete Issued Certificate"
        message={`Are you sure you want to delete certificate #${deleteTarget?.certificate_no} issued to ${deleteTarget?.recipient_name}? This action cannot be reversed.`}
        confirmText="Delete Certificate"
        cancelText="Keep Record"
        confirmStyle="danger"
      />
    </div>
  );
};

export default SavedCertificatesTable;
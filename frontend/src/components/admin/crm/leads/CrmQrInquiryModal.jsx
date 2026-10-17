import React from 'react';
import { QrCode, X, Printer, ExternalLink } from 'lucide-react';

export default function CrmQrInquiryModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const inquiryUrl = `${window.location.origin}/admin/crm/inquiries/new?source=Walk-in`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(inquiryUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl p-6 text-center space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
              Walk-in Inquiry QR
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-text-muted hover:bg-hover">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-white rounded-2xl inline-block shadow-xs border border-line">
          <img src={qrSvgUrl} alt="Walk-in QR" className="w-48 h-48 mx-auto" />
        </div>

        <p className="text-xs text-text-secondary">
          Display this QR Code at the school reception desk. Parents can scan directly with mobile cameras to submit inquiry details.
        </p>

        <div className="flex justify-center gap-2 pt-2 border-t border-line dark:border-line-dark text-xs font-bold">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-line hover:bg-hover cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print QR Stand
          </button>
          <a
            href={inquiryUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Form
          </a>
        </div>
      </div>
    </div>
  );
}

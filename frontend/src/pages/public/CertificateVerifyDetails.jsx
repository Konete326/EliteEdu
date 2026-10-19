import React from 'react';

const CertificateVerifyDetails = ({ cert = {} }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-xs space-y-2 border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/50 pb-1.5">
        <span className="text-slate-500">Issued To:</span>
        <strong className="text-slate-900 dark:text-white">{cert.recipient_name}</strong>
      </div>
      <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/50 pb-1.5">
        <span className="text-slate-500">Father / Guardian:</span>
        <span>{cert.father_name || '—'}</span>
      </div>
      <div className="flex justify-between border-b border-slate-200 dark:border-slate-700/50 pb-1.5">
        <span className="text-slate-500">Class / Designation:</span>
        <span>{cert.class_or_designation}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Issue Date:</span>
        <span className="font-mono">{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
      </div>
    </div>
  );
};

export default CertificateVerifyDetails;

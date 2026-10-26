import React from 'react';
import { renderSvgBarcode, renderSvgQrCode } from '../../../utils/idCardCodeGenerator';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const BankChallanCopyItem = ({ copyTitle, invoice, bankSettings, schoolName = 'ELITE EDUCATION SYSTEM' }) => {
  const student = invoice?.student_id || {};
  const grade = invoice?.grade_id || {};
  const heads = Array.isArray(invoice?.fee_heads) ? invoice.fee_heads : [];
  const lateFine = Number(invoice?.late_fine || 200);
  const netWithin = Number(invoice?.net_payable || 0);
  const netAfter = netWithin + lateFine;
  const issueDateStr = invoice?.issue_date ? new Date(invoice.issue_date).toLocaleDateString('en-GB') : '—';
  const dueDateStr = invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString('en-GB') : '—';

  return (
    <div className="flex-1 bg-white text-slate-900 border border-slate-300 p-2 text-[9px] flex flex-col justify-between h-full relative overflow-hidden">
      <div className="space-y-1">
        <div className="text-center border-b border-slate-300 pb-1">
          <h2 className="font-black text-[11px] uppercase tracking-wider text-slate-950 leading-tight">{schoolName}</h2>
          <p className="text-[8px] font-bold text-slate-600">{bankSettings?.bank_name || 'Habib Bank Limited (HBL)'}</p>
          <div className="inline-block bg-slate-900 text-white font-black text-[8px] px-2 py-0.5 rounded-sm uppercase tracking-wider mt-0.5">
            {copyTitle}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[8px] bg-slate-50 p-1 border border-slate-200 rounded">
          <div><span className="font-bold">A/C Title:</span> {bankSettings?.account_title || 'Elite Edu'}</div>
          <div><span className="font-bold">A/C No:</span> {bankSettings?.account_number || '1234-567890'}</div>
          <div className="col-span-2"><span className="font-bold">IBAN:</span> {bankSettings?.iban || 'PK36HABB0000123456789012'}</div>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8.5px] border-b border-slate-200 pb-1">
          <div><span className="font-bold">Challan #:</span> <span className="font-mono font-black">{invoice?.challan_no}</span></div>
          <div><span className="font-bold">Month:</span> <span className="font-bold">{invoice?.billing_month}</span></div>
          <div><span className="font-bold">Issue Date:</span> {issueDateStr}</div>
          <div><span className="font-bold text-red-600">Due Date:</span> <span className="font-bold text-red-600">{dueDateStr}</span></div>
          <div className="col-span-2"><span className="font-bold">Student:</span> <span className="font-bold uppercase">{student?.name || '—'}</span> (GR: {student?.gr_number || '—'})</div>
          <div><span className="font-bold">Father:</span> {student?.father_name || '—'}</div>
          <div><span className="font-bold">Class:</span> {grade?.name || '—'} {invoice?.section ? `(${invoice.section})` : ''}</div>
        </div>

        <table className="w-full text-left text-[8px] border-collapse">
          <thead>
            <tr className="border-b border-slate-300 font-bold bg-slate-100">
              <th className="py-0.5 px-1">Particulars</th>
              <th className="py-0.5 px-1 text-right">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {heads.map((h, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="py-0.5 px-1">{h.title}</td>
                <td className="py-0.5 px-1 text-right font-mono">{Number(h.amount).toLocaleString()}</td>
              </tr>
            ))}
            {Number(invoice?.arrears_amount) > 0 && (
              <tr className="border-b border-slate-200 text-red-700 font-bold">
                <td className="py-0.5 px-1">+ Previous Arrears</td>
                <td className="py-0.5 px-1 text-right font-mono">{Number(invoice.arrears_amount).toLocaleString()}</td>
              </tr>
            )}
            {Number(invoice?.discount_amount) > 0 && (
              <tr className="border-b border-slate-200 text-emerald-700 font-bold">
                <td className="py-0.5 px-1">- Concession / Discount</td>
                <td className="py-0.5 px-1 text-right font-mono">-{Number(invoice.discount_amount).toLocaleString()}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-black border-t border-slate-400">
              <td className="py-1 px-1">Payable Within Due Date:</td>
              <td className="py-1 px-1 text-right font-mono text-[9px]">PKR {netWithin.toLocaleString()}</td>
            </tr>
            <tr className="bg-red-50 text-red-900 font-bold border-t border-slate-300">
              <td className="py-0.5 px-1">Payable After Due Date (+{lateFine}):</td>
              <td className="py-0.5 px-1 text-right font-mono text-[9px]">PKR {netAfter.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="pt-1 border-t border-slate-300 space-y-1">
        <div className="flex items-center justify-between px-1">
          <div className="w-24 overflow-hidden">{renderSvgBarcode(invoice?.challan_no || 'CH-000', 95, 20)}</div>
          <div className="w-8 h-8 flex items-center justify-center">{renderSvgQrCode(invoice?.challan_no || 'CH-000', 32)}</div>
        </div>
        <OfficialSignatureStampBlock compact={true} signatureTitle="Bank Officer / Teller" stampTitle="Institute Stamp" />
        <div className="text-[7px] text-slate-400 text-right font-mono select-none">Powered by EliteEdu</div>
      </div>
    </div>
  );
};

export default BankChallanCopyItem;

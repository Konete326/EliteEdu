import { DollarSign, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const StudentFeeInvoicesTab = ({ invoices = [] }) => {
  let totalBilled = 0;
  let totalPaid = 0;

  invoices.forEach((inv) => {
    totalBilled += inv.net_amount || inv.total_amount || 0;
    totalPaid += inv.paid_amount || 0;
  });
  const totalDues = Math.max(0, totalBilled - totalPaid);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Total Billed Fees</span>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">PKR {totalBilled.toLocaleString()}</h4>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <span className="text-xs text-emerald-600 font-medium">Total Paid Amount</span>
          <h4 className="text-lg font-bold text-emerald-600 mt-1">PKR {totalPaid.toLocaleString()}</h4>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <span className="text-xs text-rose-600 font-medium">Outstanding Balance</span>
          <h4 className="text-lg font-bold text-rose-600 mt-1">PKR {totalDues.toLocaleString()}</h4>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-3">Invoice / Challan #</th>
              <th className="p-3">Billing Month</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {invoices.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No fee invoices recorded.</td></tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                  <td className="p-3 font-mono font-bold text-blue-600">{inv.invoice_number || inv.challan_number || '-'}</td>
                  <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{inv.billing_month || 'Monthly'}</td>
                  <td className="p-3 text-gray-500">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="p-3 font-bold text-gray-900 dark:text-gray-100">PKR {(inv.net_amount || inv.total_amount || 0).toLocaleString()}</td>
                  <td className="p-3 font-medium text-emerald-600">PKR {(inv.paid_amount || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFeeInvoicesTab;

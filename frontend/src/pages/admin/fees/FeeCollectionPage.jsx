import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import FeeCollectionKpiCards from '../../../components/admin/fees/FeeCollectionKpiCards';
import FeeCollectionActionBar from '../../../components/admin/fees/FeeCollectionActionBar';
import InvoicesTable from '../../../components/admin/fees/InvoicesTable';
import PosCollectionDock from '../../../components/admin/fees/PosCollectionDock';
import FeeCollectionModals from '../../../components/admin/fees/FeeCollectionModals';

const FeeCollectionPage = () => {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [grades, setGrades] = useState([]);
  const [bankSettings, setBankSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printInvoicesList, setPrintInvoicesList] = useState([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ search, billing_month: monthFilter });
      if (gradeFilter) params.append('grade_id', gradeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const [invRes, grdRes, setRes] = await Promise.all([
        api.get(`/fees/invoices?${params.toString()}`).catch(() => ({ data: { invoices: [] } })),
        api.get('/grades').catch(() => ({ data: { data: [] } })),
        api.get('/fees/challan-settings').catch(() => ({ data: { settings: null } }))
      ]);

      if (invRes.data?.invoices) setInvoices(invRes.data.invoices);
      if (grdRes.data?.data) setGrades(grdRes.data.data);
      if (setRes.data?.settings) setBankSettings(setRes.data.settings);
    } catch {
      showToast('Error syncing fee data', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, monthFilter, gradeFilter, statusFilter, showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleBulkPrint = () => {
    const list = selectedIds.length > 0 ? invoices.filter((i) => selectedIds.includes(i._id)) : invoices;
    if (list.length === 0) {
      showToast('No invoices available for printing', 'error');
      return;
    }
    setPrintInvoicesList(list);
    setIsPrintModalOpen(true);
  };

  const handlePaymentSuccess = (payment) => {
    showToast('Payment successfully collected', 'success');
    setActiveReceipt(payment);
    setIsReceiptOpen(true);
    setActiveInvoice(null);
    loadData();
  };

  const totalCollected = invoices.reduce((acc, i) => acc + Number(i.paid_amount || 0), 0);
  const totalNet = invoices.reduce((acc, i) => acc + Number(i.net_payable || 0), 0);
  const totalBalance = invoices.reduce((acc, i) => acc + Number(i.balance_due || 0), 0);
  const kpis = {
    today_collected: totalCollected,
    month_collected: totalCollected,
    total_pending: totalBalance,
    projected_revenue: totalNet,
    paid_count: invoices.filter((i) => i.status === 'Paid').length,
    total_invoices: invoices.length,
    defaulters_count: invoices.filter((i) => Number(i.balance_due) > 0).length,
    recovery_rate: totalNet > 0 ? Math.round((totalCollected / totalNet) * 100) : 0
  };

  return (
    <div className="space-y-4">
      <FeeCollectionActionBar
        onGenerateClick={() => setIsGenerateOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onDueDateClick={() => setIsDueDateOpen(true)}
        onPrintClick={handleBulkPrint}
        search={search} onSearchChange={setSearch}
        gradeFilter={gradeFilter} onGradeChange={setGradeFilter}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        monthFilter={monthFilter} onMonthChange={setMonthFilter}
        grades={grades} onRefresh={loadData}
      />
      <FeeCollectionKpiCards kpis={kpis} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7">
          <InvoicesTable
            invoices={invoices} selectedIds={selectedIds}
            onToggleSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
            onSelectAll={(e) => setSelectedIds(e.target.checked ? invoices.map((i) => i._id) : [])}
            onSelectInvoice={(inv) => setActiveInvoice(inv)}
            onPrintSingle={(inv) => { setPrintInvoicesList([inv]); setIsPrintModalOpen(true); }}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-5">
          <PosCollectionDock selectedInvoice={activeInvoice} onCollectionSuccess={handlePaymentSuccess} onClearSelection={() => setActiveInvoice(null)} />
        </div>
      </div>
      <FeeCollectionModals
        isGenerateOpen={isGenerateOpen} setIsGenerateOpen={setIsGenerateOpen} grades={grades} onGenerateSuccess={() => { showToast('Challans generated', 'success'); loadData(); }}
        isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} onSettingsSuccess={(st) => { setBankSettings(st); showToast('Bank details saved', 'success'); }}
        isDueDateOpen={isDueDateOpen} setIsDueDateOpen={setIsDueDateOpen} selectedIds={selectedIds} onDueDateSuccess={() => { showToast('Due dates updated', 'success'); loadData(); }}
        isPrintModalOpen={isPrintModalOpen} setIsPrintModalOpen={setIsPrintModalOpen} printInvoicesList={printInvoicesList} bankSettings={bankSettings}
        isReceiptOpen={isReceiptOpen} setIsReceiptOpen={setIsReceiptOpen} activeReceipt={activeReceipt}
      />
    </div>
  );
};

export default FeeCollectionPage;

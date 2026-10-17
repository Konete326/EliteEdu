import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DollarSign, FileText, AlertTriangle, Landmark, RotateCcw } from 'lucide-react';
import api from '../../../services/api';
import FeeSummaryCards from '../../../components/admin/fees/FeeSummaryCards';
import FeeCollectionCard from '../../../components/admin/fees/FeeCollectionCard';
import FeeHistoryTable from '../../../components/admin/fees/FeeHistoryTable';
import FeeDefaultersTable from '../../../components/admin/fees/FeeDefaultersTable';
import FeeStructureCard from '../../../components/admin/fees/FeeStructureCard';
import FeeReceiptModal from '../../../components/admin/fees/FeeReceiptModal';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useToast } from '../../../context/ToastContext';

const FeeManagementPage = ({ initialTab = 'collection' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const getTabFromPath = () => {
    if (location.pathname.includes('/fees/structure')) return 'structure';
    if (location.pathname.includes('/fees/defaulters')) return 'defaulters';
    if (location.pathname.includes('/fees/reports')) return 'reports';
    if (location.pathname.includes('/fees/concession')) return 'reports';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState('');

  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [quickStudent, setQuickStudent] = useState(null);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, stdRes, hisRes] = await Promise.all([
        api.get('/fees/summary').catch(() => ({ data: { summary: null } })),
        api.get('/fees/students').catch(() => ({ data: { students: [] } })),
        api.get(`/fees/history?search=${encodeURIComponent(searchHistory)}`).catch(() => ({ data: { payments: [] } }))
      ]);

      if (sumRes.data?.summary) setSummary(sumRes.data.summary);
      if (stdRes.data?.students) setStudents(stdRes.data.students);
      if (hisRes.data?.payments) setPayments(hisRes.data.payments);
    } catch {
      showToast('Error syncing fee ledger records', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchHistory, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`/admin/fees/${tabKey}`);
  };

  const handlePaymentSuccess = (savedPayment) => {
    showToast('Payment recorded successfully', 'success');
    setActiveReceipt(savedPayment);
    setIsReceiptOpen(true);
    setQuickStudent(null);
    loadData();
  };

  const handleQuickCollect = (st) => {
    setQuickStudent(st);
    setActiveTab('collection');
    navigate('/admin/fees/collection');
  };

  const handleDeleteConfirm = async () => {
    if (!paymentToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/fees/${paymentToDelete._id}`);
      showToast('Fee transaction successfully voided', 'success');
      setPaymentToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to void transaction', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark tracking-tight">
            Fee Management & Accounts Studio
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Student tuition collection, challan issuance, defaulters ledger, and financial reporting
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-xs font-semibold hover:border-primary transition-all text-ink dark:text-ink-dark"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Records</span>
        </button>
      </div>

      <FeeSummaryCards summary={summary} />

      <div className="flex items-center gap-2 border-b border-line dark:border-line-dark overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => handleTabChange('collection')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'collection'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-line dark:hover:text-ink-dark'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Fee Collection</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('defaulters')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'defaulters'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-line dark:hover:text-ink-dark'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Defaulters List</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('structure')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'structure'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-line dark:hover:text-ink-dark'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Fee Structure</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('reports')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-line dark:hover:text-ink-dark'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Transaction History & Reports</span>
        </button>
      </div>

      {activeTab === 'collection' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-6 space-y-6">
            <FeeCollectionCard
              onPaymentSuccess={handlePaymentSuccess}
              preselectedStudent={quickStudent}
            />
          </div>
          <div className="xl:col-span-6 space-y-6">
            <FeeHistoryTable
              payments={payments.slice(0, 8)}
              loading={loading}
              onViewReceipt={(p) => { setActiveReceipt(p); setIsReceiptOpen(true); }}
              onDeletePayment={(p) => setPaymentToDelete(p)}
              search={searchHistory}
              onSearchChange={setSearchHistory}
            />
          </div>
        </div>
      )}

      {activeTab === 'defaulters' && (
        <FeeDefaultersTable
          students={students}
          loading={loading}
          onQuickCollect={handleQuickCollect}
          feeMonth={summary?.fee_month || 'Current Month'}
        />
      )}

      {activeTab === 'structure' && (
        <FeeStructureCard students={students} />
      )}

      {activeTab === 'reports' && (
        <FeeHistoryTable
          payments={payments}
          loading={loading}
          onViewReceipt={(p) => { setActiveReceipt(p); setIsReceiptOpen(true); }}
          onDeletePayment={(p) => setPaymentToDelete(p)}
          search={searchHistory}
          onSearchChange={setSearchHistory}
        />
      )}

      <FeeReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        payment={activeReceipt}
      />

      <ConfirmModal
        isOpen={!!paymentToDelete}
        onClose={() => !deleteLoading && setPaymentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Void Fee Transaction"
        message={`Are you sure you want to void receipt #${paymentToDelete?.receipt_number}? This reversal will be recorded in the audit log.`}
        confirmText={deleteLoading ? 'Voiding...' : 'Yes, Void'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default FeeManagementPage;

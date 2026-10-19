import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import AccountsHeader from '../../components/admin/accounts/AccountsHeader';
import AccountHeadForm from '../../components/admin/accounts/AccountHeadForm';
import AccountHeadsList from '../../components/admin/accounts/AccountHeadsList';
import IncomeVoucherForm from '../../components/admin/accounts/IncomeVoucherForm';
import IncomeRegisterTable from '../../components/admin/accounts/IncomeRegisterTable';
import ExpenseVoucherForm from '../../components/admin/accounts/ExpenseVoucherForm';
import ExpenseRegisterTable from '../../components/admin/accounts/ExpenseRegisterTable';
import VouchersTable from '../../components/admin/accounts/VouchersTable';
import FinancialStatementTab from '../../components/admin/accounts/FinancialStatementTab';
import PrintableVoucherModal from '../../components/admin/accounts/PrintableVoucherModal';
import PrintableFinancialStatementModal from '../../components/admin/accounts/PrintableFinancialStatementModal';
import api from '../../services/api';

const AccountsSuitePage = () => {
  const location = useLocation();
  const getTabFromPath = (path) => {
    if (path.includes('/income')) return 'income';
    if (path.includes('/expenses')) return 'expenses';
    if (path.includes('/transactions')) return 'transactions';
    if (path.includes('/balance-sheet')) return 'statements';
    return 'chart';
  };
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));
  const [heads, setHeads] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [statementData, setStatementData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingHead, setEditingHead] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [printVoucher, setPrintVoucher] = useState(null);
  const [showStatementPrint, setShowStatementPrint] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [headsRes, txRes, stmtRes] = await Promise.all([
        api.get('/accounts/heads'),
        api.get('/accounts/transactions'),
        api.get('/accounts/statements')
      ]);
      setHeads(headsRes.data?.data || []);
      setTransactions(txRes.data?.data || []);
      setStatementData(stmtRes.data?.data || {});
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeleteHead = async (id) => {
    try { await api.delete(`/accounts/heads/${id}`); loadData(); } catch {}
  };
  const handleDeleteTx = async (id) => {
    try { await api.delete(`/accounts/transactions/${id}`); loadData(); } catch {}
  };
  const handleStatusChange = async (id, status) => {
    try { await api.patch(`/accounts/transactions/${id}/status`, { approval_status: status }); loadData(); } catch {}
  };

  const summary = {
    totalRevenue: statementData.incomeStatement?.totalRevenue || 0,
    totalExpenses: statementData.incomeStatement?.totalExpenses || 0,
    netProfit: statementData.incomeStatement?.netProfit || 0
  };

  return (
    <div className="w-full space-y-6">
      <AccountsHeader activeTab={activeTab} onTabChange={setActiveTab} summary={summary} />

      {activeTab === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <AccountHeadForm onSaved={loadData} editingHead={editingHead} onCancelEdit={() => setEditingHead(null)} />
          </div>
          <div className="lg:col-span-2">
            <AccountHeadsList heads={heads} onEdit={setEditingHead} onDelete={handleDeleteHead} loading={loading} />
          </div>
        </div>
      )}

      {activeTab === 'income' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <IncomeVoucherForm heads={heads} onSaved={loadData} editingTx={editingTx} onCancel={() => setEditingTx(null)} />
          </div>
          <div className="lg:col-span-2">
            <IncomeRegisterTable transactions={transactions} onEdit={setEditingTx} onDelete={handleDeleteTx} onPrint={setPrintVoucher} loading={loading} />
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExpenseVoucherForm heads={heads} onSaved={loadData} editingTx={editingTx} onCancel={() => setEditingTx(null)} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseRegisterTable transactions={transactions} onEdit={setEditingTx} onDelete={handleDeleteTx} onPrint={setPrintVoucher} loading={loading} />
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <VouchersTable transactions={transactions} onStatusChange={handleStatusChange} onPrint={setPrintVoucher} onDelete={handleDeleteTx} loading={loading} />
      )}

      {activeTab === 'statements' && (
        <FinancialStatementTab data={statementData} onPrint={() => setShowStatementPrint(false) || setShowStatementPrint(true)} loading={loading} />
      )}

      <PrintableVoucherModal voucher={printVoucher} isOpen={Boolean(printVoucher)} onClose={() => setPrintVoucher(null)} />
      <PrintableFinancialStatementModal data={statementData} isOpen={showStatementPrint} onClose={() => setShowStatementPrint(false)} />
    </div>
  );
};

export default AccountsSuitePage;

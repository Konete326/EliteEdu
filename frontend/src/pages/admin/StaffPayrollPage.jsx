import { useState, useEffect, useCallback } from 'react';
import PayrollHeader from '../../components/admin/payroll/PayrollHeader';
import MonthlyPayrollTab from '../../components/admin/payroll/MonthlyPayrollTab';
import StaffLoansTab from '../../components/admin/payroll/StaffLoansTab';
import SecurityDepositsTab from '../../components/admin/payroll/SecurityDepositsTab';
import EditSalarySlipModal from '../../components/admin/payroll/EditSalarySlipModal';
import PaySalarySlipModal from '../../components/admin/payroll/PaySalarySlipModal';
import PrintablePayslipModal from '../../components/admin/payroll/PrintablePayslipModal';
import NewLoanModal from '../../components/admin/payroll/NewLoanModal';
import api from '../../services/api';

const StaffPayrollPage = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [slips, setSlips] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [editingSlip, setEditingSlip] = useState(null);
  const [payingSlip, setPayingSlip] = useState(null);
  const [printSlip, setPrintSlip] = useState(null);
  const [loanModalType, setLoanModalType] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [slipsRes, loansRes] = await Promise.all([
        api.get('/payroll/slips', { params: { salary_month: currentMonth } }),
        api.get('/payroll/loans')
      ]);
      setSlips(slipsRes.data?.data || []);
      setLoans(loansRes.data?.data || []);
    } catch {}
    finally { setLoading(false); }
  }, [currentMonth]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/payroll/generate-month', { salary_month: currentMonth });
      loadData();
    } catch {}
    finally { setGenerating(false); }
  };

  const handleToggleHold = async (id, month) => {
    try {
      await api.patch(`/payroll/loans/${id}/hold`, { month });
      loadData();
    } catch {}
  };

  const totalGross = slips.reduce((acc, s) => acc + (Number(s.basic_salary || 0) + Number(s.total_allowances || 0)), 0);
  const totalPaid = slips.filter((s) => s.status === 'Paid').reduce((acc, s) => acc + Number(s.paid_amount || s.net_payable || 0), 0);
  const totalPending = slips.filter((s) => s.status === 'Pending').reduce((acc, s) => acc + Number(s.net_payable || 0), 0);

  return (
    <div className="w-full space-y-6">
      <PayrollHeader activeTab={activeTab} onTabChange={setActiveTab} stats={{ totalGross, totalPaid, totalPending }} />

      {activeTab === 'monthly' && (
        <MonthlyPayrollTab
          slips={slips}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onGenerate={handleGenerate}
          onEdit={setEditingSlip}
          onPay={setPayingSlip}
          onPrint={setPrintSlip}
          loading={loading}
          generating={generating}
        />
      )}

      {activeTab === 'loans' && (
        <StaffLoansTab
          loans={loans}
          onOpenNewLoan={(type) => setLoanModalType(type)}
          onToggleHold={handleToggleHold}
          currentMonth={currentMonth}
          loading={loading}
        />
      )}

      {activeTab === 'deposits' && (
        <SecurityDepositsTab
          deposits={loans}
          onOpenNewDeposit={(type) => setLoanModalType(type)}
          onToggleHold={handleToggleHold}
          currentMonth={currentMonth}
          loading={loading}
        />
      )}

      <EditSalarySlipModal slip={editingSlip} isOpen={Boolean(editingSlip)} onClose={() => setEditingSlip(null)} onUpdated={loadData} />
      <PaySalarySlipModal slip={payingSlip} isOpen={Boolean(payingSlip)} onClose={() => setPayingSlip(null)} onPaid={loadData} />
      <PrintablePayslipModal slip={printSlip} isOpen={Boolean(printSlip)} onClose={() => setPrintSlip(null)} />
      <NewLoanModal isOpen={Boolean(loanModalType)} defaultType={loanModalType || 'Loan'} onClose={() => setLoanModalType(null)} onCreated={loadData} />
    </div>
  );
};

export default StaffPayrollPage;

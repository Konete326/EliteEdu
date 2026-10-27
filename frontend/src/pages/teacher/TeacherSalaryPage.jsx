import { useState, useEffect } from 'react';
import { DollarSign, Landmark, ArrowLeft, ShieldAlert, FileSpreadsheet, Receipt, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';
import api from '../../services/api';

const TeacherSalaryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schoolType, setSchoolType] = useState(() => user?.school_type || user?.school_id?.school_type || null);
  const [loading, setLoading] = useState(!schoolType);

  useEffect(() => {
    if (!schoolType) {
      api.get('/teacher-portal/me')
        .then((res) => {
          setSchoolType(res.data?.school_type || 'Private');
        })
        .catch(() => {
          setSchoolType('Private');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [schoolType]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-muted">Verifying institutional configuration...</p>
      </div>
    );
  }

  if (schoolType === 'Government') {
    return (
      <div className="w-full space-y-6 animate-in fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark tracking-tight">
              Institutional Payroll Notice
            </h1>
            <p className="text-xs text-ink-muted">
              Government School Faculty Compensation Framework
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/teacher')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-bold text-ink dark:text-ink-dark hover:border-primary transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft size={14} />
            <span>Go to Dashboard</span>
          </button>
        </div>

        <div className="rounded-3xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-6 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shadow-inner">
            <Landmark className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <ShieldAlert size={14} />
              <span>Government Sector Policy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-ink dark:text-ink-dark tracking-tight pt-1">
              This feature is not available for Government Schools
            </h2>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Government employee payroll, basic pay scales (BPS), and allowances are administered and disbursed directly through the Accountant General (AG) Office and School Education &amp; Literacy Department (SE&amp;LD) systems.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-secondary/50 dark:bg-white/5 border border-line/60 dark:border-line-dark/60 max-w-lg text-left space-y-1.5">
            <h4 className="text-xs font-bold text-ink dark:text-ink-dark flex items-center gap-2">
              <Landmark size={14} className="text-amber-600" />
              Direct Government Payroll Disbursement
            </h4>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Teachers in government institutions receive monthly payslips via PIFRA / AG PR portal and direct treasury transfers. In-app payroll processing is not applicable for this institution.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GlobalComingSoon
      title="Faculty Salary & Compensation Studio"
      subtitle="Monthly Payslips, Allowances, Deductions & Loan Tracking"
      description="Faculty digital payroll and compensation self-service is currently being prepared for Milestone 2. Automated payslip generation, salary breakdown, deduction slips, and advance salary tracking will be available soon."
      icon={DollarSign}
      badge="Coming Soon"
      backUrl="/teacher"
      features={[
        {
          title: 'Monthly Payslips',
          desc: 'Downloadable digital payslips with detailed earnings, basic salary, and net compensation.',
          icon: Receipt
        },
        {
          title: 'Allowances & Perks',
          desc: 'Itemized tracking for medical, conveyance, academic, and house rent allowances.',
          icon: Wallet
        },
        {
          title: 'Deductions & Tax',
          desc: 'Clear transparency over tax withholding, provident fund, and unpaid leave adjustments.',
          icon: FileSpreadsheet
        },
        {
          title: 'Advances & Loans',
          desc: 'Track active salary advances, monthly installment repayments, and outstanding balances.',
          icon: Landmark
        }
      ]}
    />
  );
};

export default TeacherSalaryPage;

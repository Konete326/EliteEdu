import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, GraduationCap, ShieldCheck, Banknote, Search } from 'lucide-react';
import api from '../../services/api';
import ReportKpiCards from '../../components/admin/reports/ReportKpiCards';
import ReportExportToolbar from '../../components/admin/reports/ReportExportToolbar';
import InstitutionalReportHeader from '../../components/admin/reports/InstitutionalReportHeader';
import InstitutionalReportFooter from '../../components/admin/reports/InstitutionalReportFooter';
import StaffInfoTable from '../../components/admin/reports/StaffInfoTable';
import { DEFAULT_STAFF_REPORT_COLS } from '../../components/admin/reports/staffReportCols';

const StaffInfoReportPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ data: [], kpis: {}, header: {} });
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [columns, setColumns] = useState(DEFAULT_STAFF_REPORT_COLS);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/reports/staff-info?role=${role}&status=${status}&search=${encodeURIComponent(search)}`);
      setData(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [role, status]);

  const toggleColumn = (colId) => {
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, visible: !c.visible } : c));
  };

  const kpiItems = [
    { title: 'Total Staff', value: data.kpis?.totalStaff ?? 0, icon: Users, bg: 'bg-primary/10', color: 'text-primary' },
    { title: 'Active Faculty', value: data.kpis?.activeTeachers ?? 0, icon: GraduationCap, bg: 'bg-emerald-500/10', color: 'text-emerald-600' },
    { title: 'Admin & Support', value: data.kpis?.supportAndAdminStaff ?? 0, icon: ShieldCheck, bg: 'bg-indigo-500/10', color: 'text-indigo-600' },
    { title: 'Est. Monthly Payroll', value: `PKR ${(data.kpis?.totalMonthlyPayroll || 0).toLocaleString()}`, icon: Banknote, bg: 'bg-amber-500/10', color: 'text-amber-600' }
  ];

  const rows = data.data || [];
  const counters = {
    activeCount: rows.filter((r) => String(r.status).toLowerCase() === 'active').length,
    registeredCount: rows.length,
    inactiveCount: rows.filter((r) => String(r.status).toLowerCase() === 'inactive').length,
    suspendedCount: rows.filter((r) => String(r.status).toLowerCase() === 'suspended').length,
    leftCount: rows.filter((r) => ['left', 'resigned', 'terminated'].includes(String(r.status).toLowerCase())).length
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/reports')} className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-secondary cursor-pointer">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Staff & HR Directory Report</h1>
            <p className="text-xs text-slate-500">Institutional faculty, admin roster, and attendance records.</p>
          </div>
        </div>
      </div>

      <div className="print:hidden space-y-3">
        <ReportKpiCards items={kpiItems} />
        <div className="flex flex-wrap items-center gap-3 bg-surface p-3 rounded-2xl border border-line shadow-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadData()}
              placeholder="Search by name, emp ID, CNIC or phone..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-line bg-transparent text-xs"
            />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold">
            <option value="all">All Roles</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold">
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
          <button onClick={loadData} className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-surface-secondary hover:bg-line text-ink cursor-pointer">Filter</button>
        </div>
        <ReportExportToolbar columns={columns} rows={rows} filename="staff-hr-directory" onToggleColumn={toggleColumn} searchTerm={search} onSearchChange={setSearch} />
      </div>

      <div className="hidden print:block">
        <InstitutionalReportHeader header={data.header || {}} reportTitle="STAFF & HR MASTER DIRECTORY" subtitle="Verified Faculty, Support Staff, and Institutional Personnel" />
      </div>

      <StaffInfoTable rows={rows} columns={columns} loading={loading} />

      <InstitutionalReportFooter counters={counters} customNote="Official HR dossier generated automatically from EliteEdu Staff Database." />
    </div>
  );
};

export default StaffInfoReportPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Search } from 'lucide-react';
import api from '../../services/api';
import PageLoader from '../../components/common/PageLoader';

const StudentAdmissionReportPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ rows: [], stats: {}, header: {} });
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/reports/student-admission-info?grade_id=${selectedGrade}&search=${search}`);
      setData(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/api/grades').then((r) => setGrades(r.data.grades || r.data || [])).catch(() => {});
  }, []);

  useEffect(() => { loadData(); }, [selectedGrade]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/reports')} className="p-2 rounded-xl border border-line bg-surface dark:bg-surface-dark hover:bg-surface-secondary cursor-pointer">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Student Admission Directory</h1>
            <p className="text-xs text-slate-500">Official student demographic, admission, and registry report.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer">
            <Printer size={14} /> Print Sheet
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 print:hidden bg-surface dark:bg-surface-dark p-3 rounded-2xl border border-line dark:border-line-dark shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-2.5 text-ink-muted" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadData()}
            placeholder="Search by GR#, Student or Father name..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-line bg-transparent text-xs"
          />
        </div>
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold">
          <option value="all">All Classes</option>
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
        <button onClick={loadData} className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-surface-secondary hover:bg-line text-ink cursor-pointer">Filter</button>
      </div>

      <div className="hidden print:block text-center pb-2 border-b border-line mb-3">
        <h2 className="text-lg font-black uppercase">{data.header?.school_name || 'INSTITUTION'}</h2>
        <p className="text-xs font-bold text-slate-600">{data.header?.campus_name} {data.header?.address ? `— ${data.header.address}` : ''}</p>
        <p className="text-[10px] uppercase font-bold text-primary mt-0.5">Student Admission & Enrollment Master Sheet</p>
      </div>

      {loading ? <PageLoader text="Compiling student admission records..." /> : (
        <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-secondary/70 dark:bg-white/[0.03] border-b border-line dark:border-line-dark text-[11px] font-bold text-ink-muted uppercase">
              <tr>
                <th className="py-2.5 px-3">SR#</th>
                <th className="py-2.5 px-3">GR#</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Father Name</th>
                <th className="py-2.5 px-3">Class (Sec)</th>
                <th className="py-2.5 px-3">DOB (Age)</th>
                <th className="py-2.5 px-3">Gender</th>
                <th className="py-2.5 px-3">Admission Date</th>
                <th className="py-2.5 px-3">Discount</th>
                <th className="py-2.5 px-3">B-Form / CNIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark">
              {data.rows?.length === 0 ? (
                <tr><td colSpan={10} className="py-8 text-center text-xs text-ink-muted">No students matching query criteria.</td></tr>
              ) : (
                data.rows?.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-2 px-3 font-mono">{r.sr}</td>
                    <td className="py-2 px-3 font-bold text-primary">{r.gr_number}</td>
                    <td className="py-2 px-3 font-bold text-slate-800 dark:text-white">{r.student_name}</td>
                    <td className="py-2 px-3">{r.father_name}</td>
                    <td className="py-2 px-3 font-semibold">{r.class_name} ({r.section})</td>
                    <td className="py-2 px-3">{r.dob} {r.age ? `(${r.age}y)` : ''}</td>
                    <td className="py-2 px-3">{r.gender}</td>
                    <td className="py-2 px-3 font-mono text-[11px]">{r.admission_date}</td>
                    <td className="py-2 px-3 font-semibold">{r.discount_in_fee > 0 ? `Rs. ${r.discount_in_fee}` : '—'}</td>
                    <td className="py-2 px-3 font-mono text-[11px]">{r.b_form}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentAdmissionReportPage;

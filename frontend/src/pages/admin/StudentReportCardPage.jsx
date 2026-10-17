import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Printer, Award, Search, User } from 'lucide-react';
import api from '../../services/api';
import PageLoader from '../../components/common/PageLoader';
import OfficialSignatureStampBlock from '../../components/common/OfficialSignatureStampBlock';

const StudentReportCardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentIdParam = searchParams.get('studentId');
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(studentIdParam || '');
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/students?limit=200').then((r) => {
      const list = r.data.students || [];
      setStudents(list);
      if (!selectedStudentId && list.length > 0) setSelectedStudentId(list[0]._id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      setLoading(true);
      api.get(`/api/reports/student-report-card/${selectedStudentId}`).then((r) => {
        setCardData(r.data);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [selectedStudentId]);

  const student = cardData?.student || {};
  const examResults = cardData?.exam_results || [];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/reports')} className="p-2 rounded-xl border border-line bg-surface dark:bg-surface-dark hover:bg-surface-secondary cursor-pointer">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Student Terminal Report Card</h1>
            <p className="text-xs text-slate-500">Comprehensive terminal examination progress and performance dossier.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="px-3 py-2 rounded-xl border border-line bg-surface text-xs font-semibold max-w-[220px]">
            {students.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.gr_number || 'No GR'})</option>)}
          </select>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer">
            <Printer size={14} /> Print Card
          </button>
        </div>
      </div>

      {loading ? <PageLoader text="Compiling terminal progress report card..." /> : !cardData ? (
        <div className="p-8 text-center text-xs text-ink-muted">Select a student to load report card.</div>
      ) : (
        <div className="bg-surface dark:bg-surface-dark border-2 border-line dark:border-line-dark rounded-2xl p-6 shadow-sm space-y-5 print:border-black print:p-4">
          <div className="text-center border-b-2 border-line pb-3">
            <h2 className="text-lg font-black uppercase text-slate-900 dark:text-white">{cardData.header?.school_name}</h2>
            <p className="text-xs font-bold text-slate-600">{cardData.header?.campus_name} {cardData.header?.address ? `— ${cardData.header.address}` : ''}</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-wider">
              Student Terminal Progress Dossier
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-secondary/40 p-3 rounded-xl text-xs">
            <div><span className="text-ink-muted block text-[10px] uppercase font-bold">Student Name:</span><strong className="text-slate-800 dark:text-white">{student.name}</strong></div>
            <div><span className="text-ink-muted block text-[10px] uppercase font-bold">Father Name:</span><strong>{student.father_name}</strong></div>
            <div><span className="text-ink-muted block text-[10px] uppercase font-bold">Class / Section:</span><strong>{student.current_grade?.name || 'Class'} ({student.current_section || 'A'})</strong></div>
            <div><span className="text-ink-muted block text-[10px] uppercase font-bold">GR Number:</span><strong className="text-primary font-mono">{student.gr_number || '—'}</strong></div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-secondary/80 text-[10px] font-bold text-ink-muted uppercase border-b border-line">
                <tr>
                  <th className="py-2 px-3">Assessment Title</th>
                  <th className="py-2 px-3">Subject</th>
                  <th className="py-2 px-3 text-right">Max</th>
                  <th className="py-2 px-3 text-right">Obtained</th>
                  <th className="py-2 px-3 text-right">%</th>
                  <th className="py-2 px-3 text-center">Grade</th>
                  <th className="py-2 px-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {examResults.length === 0 ? (
                  <tr><td colSpan={7} className="py-6 text-center text-xs text-ink-muted">No examination marks recorded for this student.</td></tr>
                ) : (
                  examResults.map((er) => (
                    <tr key={er.id} className="hover:bg-surface-secondary/30">
                      <td className="py-2 px-3 font-semibold">{er.exam_title}</td>
                      <td className="py-2 px-3 font-bold">{er.subject_name}</td>
                      <td className="py-2 px-3 text-right font-mono">{er.max_marks}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">{er.obtained_marks}</td>
                      <td className="py-2 px-3 text-right font-mono">{er.percentage}%</td>
                      <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded font-black text-white text-[10px]" style={{ backgroundColor: er.status_color || '#0d9488' }}>{er.grade}</span></td>
                      <td className="py-2 px-3 text-[11px] text-ink-muted truncate max-w-[150px]">{er.teacher_remarks || 'Satisfactory'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <OfficialSignatureStampBlock />
        </div>
      )}
    </div>
  );
};

export default StudentReportCardPage;

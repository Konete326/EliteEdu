import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import axios from '../../api/axios';
import DatesheetInfoCard from '../../components/admin/examsuite/datesheets/DatesheetInfoCard';
import DatesheetScheduleTable from '../../components/admin/examsuite/datesheets/DatesheetScheduleTable';
import UploadPDFModal from '../../components/admin/examsuite/datesheets/UploadPDFModal';
import PasteGridModal from '../../components/admin/examsuite/datesheets/PasteGridModal';

const NewDatesheetPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState({
    academic_session: '2026-2027', status: 'Draft', grade_id: '', section: '',
    exam_category_id: '', start_date: '', end_date: '', instructions: ''
  });
  const [papers, setPapers] = useState([
    { exam_date: '', day_name: '', subject_id: '', examiner_id: '', invigilator_id: '', start_time: '09:00 AM', end_time: '12:00 PM', total_marks: 100, syllabus: '' }
  ]);
  const [grades, setGrades] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get('/api/grades'),
      axios.get('/api/exam-suite/categories'),
      axios.get('/api/subjects'),
      axios.get('/api/teachers')
    ]).then(([gRes, cRes, sRes, tRes]) => {
      setGrades(gRes.data.grades || gRes.data || []);
      setCategories(cRes.data.categories || []);
      setSubjects(sRes.data.subjects || sRes.data || []);
      setTeachers(tRes.data.teachers || tRes.data || []);
    }).catch(() => {});

    if (editId) {
      axios.get(`/api/exam-suite/datesheets/${editId}`).then(res => {
        const d = res.data.datesheet;
        if (d) {
          setForm({
            academic_session: d.academic_session, status: d.status, grade_id: d.grade_id?._id || d.grade_id,
            section: d.section, exam_category_id: d.exam_category_id?._id || d.exam_category_id,
            start_date: d.start_date ? d.start_date.split('T')[0] : '', end_date: d.end_date ? d.end_date.split('T')[0] : '',
            instructions: d.instructions
          });
          if (d.papers?.length > 0) setPapers(d.papers.map(p => ({ ...p, exam_date: p.exam_date ? p.exam_date.split('T')[0] : '' })));
        }
      }).catch(() => {});
    }
  }, [editId]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const payload = { ...form, papers };
      if (editId) await axios.put(`/api/exam-suite/datesheets/${editId}`, payload);
      else await axios.post('/api/exam-suite/datesheets', payload);
      navigate('/admin/exam-management/schedule');
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/exam-management/schedule')} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{editId ? 'Edit Datesheet' : 'New Datesheet'}</h1>
            <p className="text-xs text-slate-500">Set the class details, then add one row per exam paper.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button onClick={() => navigate('/admin/exam-management/schedule')} className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={saving} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
            <Save size={16} /> {saving ? 'Saving...' : 'Create Datesheet'}
          </button>
        </div>
      </div>

      <DatesheetInfoCard form={form} onChange={(k, v) => setForm(prev => ({ ...prev, [k]: v }))} grades={grades} categories={categories} />
      <DatesheetScheduleTable
        papers={papers} subjects={subjects} teachers={teachers}
        onAddRow={() => setPapers(prev => [...prev, { exam_date: '', day_name: '', subject_id: '', examiner_id: '', invigilator_id: '', start_time: '09:00 AM', end_time: '12:00 PM', total_marks: 100, syllabus: '' }])}
        onUpdateRow={(idx, fields) => setPapers(prev => prev.map((p, i) => i === idx ? { ...p, ...fields } : p))}
        onRemoveRow={(idx) => setPapers(prev => prev.filter((_, i) => i !== idx))}
        onOpenPDFModal={() => setPdfModalOpen(true)}
        onOpenPasteModal={() => setPasteModalOpen(true)}
      />

      <UploadPDFModal isOpen={pdfModalOpen} onClose={() => setPdfModalOpen(false)} onUploadComplete={(name) => setForm(prev => ({ ...prev, instructions: `${prev.instructions ? prev.instructions + '\n' : ''}Attached PDF: ${name}` }))} />
      <PasteGridModal isOpen={pasteModalOpen} onClose={() => setPasteModalOpen(false)} onApplyRows={(rows) => setPapers(prev => [...prev, ...rows])} />
    </div>
  );
};

export default NewDatesheetPage;

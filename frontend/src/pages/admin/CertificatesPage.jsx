import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Award } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import CertificateFormCard from '../../components/admin/certificates/CertificateFormCard';
import CertificatePreviewCanvas from '../../components/admin/certificates/CertificatePreviewCanvas';
import SavedCertificatesTable from '../../components/admin/certificates/SavedCertificatesTable';
import CertificateTemplatesManager from '../../components/admin/certificates/CertificateTemplatesManager';

const CertificatesPage = ({ defaultTab = 'generate' }) => {
  const [searchParams] = useSearchParams();
  const initialStudentId = searchParams.get('studentId') || '';
  const initialStaffId = searchParams.get('staffId') || '';
  const { user } = useAuth();
  const { activeCampus } = useCampus();
  const [tab, setTab] = useState(searchParams.get('tab') || defaultTab);
  const [templates, setTemplates] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [issuedData, setIssuedData] = useState({ certificates: [], total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    template_id: '', recipient_type: initialStaffId ? 'Staff' : 'Student',
    recipient_id: initialStudentId || initialStaffId || '',
    design_style: 'royal_gold', custom_text: 'outstanding performance',
    issue_date: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    try {
      const [tRes, sRes, fRes] = await Promise.all([api.get('/api/certificates/templates'), api.get('/api/students?limit=250'), api.get('/api/teachers?limit=250')]);
      const tmps = tRes.data.templates || [];
      setTemplates(tmps);
      setStudents(sRes.data.students || []);
      setTeachers(fRes.data.teachers || []);
      if (tmps.length > 0 && !form.template_id) setForm((p) => ({ ...p, template_id: tmps[0]._id, design_style: tmps[0].design_style || 'royal_gold' }));
    } catch {}
  };

  const loadIssued = async () => {
    try {
      const res = await api.get(`/api/certificates/issued?page=${page}&search=${search}&recipient_type=${recipientFilter}`);
      setIssuedData(res.data);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadIssued(); }, [page, search, recipientFilter]);

  const activeTemplate = templates.find((t) => t._id === form.template_id) || templates[0] || {};
  const activeRecipient = form.recipient_type === 'Student' ? students.find((s) => s._id === form.recipient_id) || {} : teachers.find((t) => t._id === form.recipient_id) || {};

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await api.post('/api/certificates/generate', form);
      loadIssued();
    } catch {} finally {
      setGenerating(false);
    }
  };

  const prereqs = [
    { name: 'Templates', count: templates.length, addPath: '/admin/certificates/templates', label: 'Add Template' },
    { name: 'Students', count: students.length, addPath: '/admin/students/new', label: 'Add Student' }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> Certificate Generator & Studio
          </h1>
          <p className="text-xs text-slate-500">Design, issue, and print verifiable student and staff institutional credentials.</p>
        </div>
        <div className="flex rounded-xl border border-line p-0.5 bg-surface-secondary/40 text-xs font-bold">
          <button onClick={() => setTab('generate')} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${tab === 'generate' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted'}`}>Generate Certificate</button>
          <button onClick={() => setTab('templates')} className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${tab === 'templates' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted'}`}>Certificate Templates</button>
        </div>
      </div>

      {tab === 'templates' ? (
        <CertificateTemplatesManager templates={templates} onRefresh={loadData} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-5 print:hidden">
              <CertificateFormCard templates={templates} students={students} teachers={teachers} form={form} onChange={(f, v) => setForm((p) => ({ ...p, [f]: v }))} onGenerate={handleGenerate} onPrint={() => window.print()} generating={generating} prereqs={prereqs} onRefreshPrereqs={loadData} />
            </div>
            <div className="xl:col-span-7 flex justify-center">
              <CertificatePreviewCanvas template={activeTemplate} style={form.design_style} accentColor={activeTemplate.accent_color} school={{ name: user?.school_name, slogan: user?.school_slogan, logo_url: user?.school_logo }} campus={activeCampus || {}} recipient={activeRecipient} recipientType={form.recipient_type} customText={form.custom_text} issueDate={form.issue_date} />
            </div>
          </div>
          <div className="print:hidden">
            <SavedCertificatesTable certificates={issuedData.certificates} total={issuedData.total} page={page} pages={issuedData.pages} search={search} recipientType={recipientFilter} onSearchChange={setSearch} onRecipientTypeChange={setRecipientFilter} onPageChange={setPage} onPreview={(c) => setForm({ template_id: c.template_id, recipient_type: c.recipient_type, recipient_id: c.student_id?._id || c.staff_id?._id || '', design_style: c.design_style, custom_text: c.custom_text, issue_date: c.issue_date?.split('T')[0] })} onPrintRow={() => window.print()} onDelete={async (id) => { await api.delete(`/api/certificates/issued/${id}`); loadIssued(); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;

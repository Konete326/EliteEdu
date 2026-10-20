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
import { resolvePlaceholders } from '../../utils/certificatePlaceholderResolver';

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
  const [schoolData, setSchoolData] = useState({});
  const [form, setForm] = useState({
    template_id: '',
    recipient_type: initialStaffId ? 'Staff' : 'Student',
    recipient_id: initialStudentId || initialStaffId || '',
    design_style: 'academic_gold_hatch',
    orientation: 'landscape',
    custom_heading: '',
    custom_body: '',
    custom_text: 'outstanding performance',
    issue_date: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    try {
      const [tRes, sRes, fRes, scRes] = await Promise.all([
        api.get('/certificates/templates'),
        api.get('/students?limit=250'),
        api.get('/teachers?limit=250'),
        api.get('/schools/general-settings').catch(() => ({ data: {} }))
      ]);
      const tmps = tRes.data.templates || [];
      setTemplates(tmps);
      setStudents(sRes.data.students || []);
      setTeachers(fRes.data.teachers || []);
      if (scRes.data?.school) setSchoolData(scRes.data.school);
      if (tmps.length > 0 && !form.template_id) {
        setForm((p) => ({
          ...p,
          template_id: tmps[0]._id,
          design_style: tmps[0].design_style || 'academic_gold_hatch',
          orientation: 'landscape',
          custom_heading: tmps[0].heading || ''
        }));
      }
    } catch {}
  };

  const loadIssued = async () => {
    try {
      const res = await api.get(`/certificates/issued?page=${page}&search=${search}&recipient_type=${recipientFilter}`);
      setIssuedData(res.data);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadIssued(); }, [page, search, recipientFilter]);

  const activeTemplate = templates.find((t) => t._id === form.template_id) || templates[0] || {};
  const activeRecipient = form.recipient_type === 'Student'
    ? students.find((s) => s._id === form.recipient_id) || {}
    : teachers.find((t) => t._id === form.recipient_id) || {};

  const resolvedTemplateBody = resolvePlaceholders(
    activeTemplate.body_template,
    activeRecipient,
    form.recipient_type,
    form.custom_text,
    schoolData.name || user?.school_name
  );

  const effectiveHeading = form.custom_heading !== undefined && form.custom_heading !== ''
    ? form.custom_heading
    : (activeTemplate.heading || '');

  const effectiveBody = form.custom_body !== undefined && form.custom_body !== ''
    ? form.custom_body
    : resolvedTemplateBody;

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await api.post('/certificates/generate', {
        ...form,
        custom_heading: effectiveHeading,
        custom_body: effectiveBody
      });
      loadIssued();
    } catch {} finally { setGenerating(false); }
  };

  const prereqs = [
    { name: 'Templates', count: templates.length, addPath: '/admin/certificates/templates', label: 'Add Template' },
    { name: 'Students', count: students.length, addPath: '/admin/students/new', label: 'Add Student' }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> {tab === 'templates' ? 'Certificate Templates Studio' : 'Certificate Generator Studio'}
          </h1>
          <p className="text-xs font-semibold text-ink-muted">
            {tab === 'templates' ? 'Manage institutional templates, award wording, and placeholder tags' : 'Design, issue, and print verifiable student and staff institutional credentials'}
          </p>
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
              <CertificateFormCard
                templates={templates}
                students={students}
                teachers={teachers}
                form={{
                  ...form,
                  custom_heading: effectiveHeading,
                  custom_body: effectiveBody
                }}
                onChange={(f, v) => setForm((p) => ({ ...p, [f]: v }))}
                onGenerate={handleGenerate}
                onPrint={() => window.print()}
                generating={generating}
                prereqs={prereqs}
                onRefreshPrereqs={loadData}
              />
            </div>
            <div className="xl:col-span-7 flex justify-center">
              <CertificatePreviewCanvas
                template={activeTemplate}
                style={form.design_style}
                orientation={form.orientation || 'landscape'}
                accentColor={activeTemplate.accent_color}
                school={{ name: schoolData.name || user?.school_name || activeCampus?.name || 'Elite Educational System', slogan: schoolData.slogan || user?.school_slogan, logo_url: schoolData.logo_url || user?.school_logo || activeCampus?.logo, address: schoolData.address || activeCampus?.address }}
                campus={activeCampus || {}}
                recipient={activeRecipient}
                recipientType={form.recipient_type}
                customText={form.custom_text}
                customHeading={effectiveHeading}
                customBody={effectiveBody}
                resolvedBody={resolvedTemplateBody}
                issueDate={form.issue_date}
              />
            </div>
          </div>
          <div className="print:hidden">
            <SavedCertificatesTable
              certificates={issuedData.certificates}
              total={issuedData.total}
              page={page}
              pages={issuedData.pages}
              search={search}
              recipientType={recipientFilter}
              onSearchChange={setSearch}
              onRecipientTypeChange={setRecipientFilter}
              onPageChange={setPage}
              onPreview={(c) => setForm({
                template_id: c.template_id,
                recipient_type: c.recipient_type,
                recipient_id: c.student_id?._id || c.staff_id?._id || '',
                design_style: c.design_style,
                orientation: c.orientation || 'landscape',
                custom_heading: c.heading || '',
                custom_body: c.resolved_body || '',
                custom_text: c.custom_text,
                issue_date: c.issue_date?.split('T')[0]
              })}
              onPrintRow={() => window.print()}
              onDelete={async (id) => { await api.delete(`/certificates/issued/${id}`); loadIssued(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;

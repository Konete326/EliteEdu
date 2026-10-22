import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Award, Layers, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import CertificateFormCard from '../../components/admin/certificates/CertificateFormCard';
import CertificatePreviewCanvas from '../../components/admin/certificates/CertificatePreviewCanvas';
import SavedCertificatesTable from '../../components/admin/certificates/SavedCertificatesTable';
import CertificateTemplatesManager from '../../components/admin/certificates/CertificateTemplatesManager';
import { resolvePlaceholders } from '../../utils/certificatePlaceholderResolver';
import { exportCertificatePdf } from '../../utils/pdf/certificatePdfExporter';

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
  const [downloading, setDownloading] = useState(false);
  const [schoolData, setSchoolData] = useState({});

  const defaultSlogan = activeCampus?.motto || schoolData.slogan || user?.school_slogan || 'Excellence in Education';

  const [form, setForm] = useState({
    template_id: '',
    recipient_type: initialStaffId ? 'Staff' : 'Student',
    recipient_id: initialStudentId || initialStaffId || '',
    design_style: 'academic_gold_hatch',
    orientation: 'landscape',
    custom_heading: '',
    sub_heading: '',
    custom_slogan: '',
    custom_body: '',
    custom_text: 'outstanding performance',
    issue_date: new Date().toISOString().split('T')[0],
    signatory_title_1: 'Teacher In-Charge',
    signatory_title_2: 'Principal / Headmaster',
    show_stamp: true,
    show_qr: true
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
          orientation: tmps[0].orientation || 'landscape',
          custom_heading: tmps[0].heading || '',
          sub_heading: tmps[0].sub_heading || 'THIS CERTIFICATE IS PRESENTED TO',
          custom_body: tmps[0].body_template || ''
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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadIssued();
  }, [page, search, recipientFilter]);

  const activeTemplate = templates.find((t) => t._id === form.template_id) || templates[0] || {};
  const activeRecipient = form.recipient_type === 'Student'
    ? students.find((s) => s._id === form.recipient_id) || {}
    : teachers.find((t) => t._id === form.recipient_id) || {};

  const effectiveSlogan = form.custom_slogan !== undefined && form.custom_slogan !== ''
    ? form.custom_slogan
    : defaultSlogan;

  const resolvedTemplateBody = resolvePlaceholders(
    activeTemplate.body_template,
    activeRecipient,
    form.recipient_type,
    form.custom_text,
    schoolData.name || user?.school_name,
    effectiveSlogan,
    activeCampus?.name
  );

  const effectiveHeading = form.custom_heading !== undefined && form.custom_heading !== ''
    ? form.custom_heading
    : (activeTemplate.heading || 'CERTIFICATE OF MERIT');

  const effectiveSubHeading = form.sub_heading !== undefined && form.sub_heading !== ''
    ? form.sub_heading
    : (activeTemplate.sub_heading || 'THIS IS TO CERTIFY THAT');

  const effectiveBody = form.custom_body !== undefined && form.custom_body !== ''
    ? form.custom_body
    : resolvedTemplateBody;

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await api.post('/certificates/generate', {
        ...form,
        custom_heading: effectiveHeading,
        sub_heading: effectiveSubHeading,
        custom_slogan: effectiveSlogan,
        custom_body: effectiveBody
      });
      loadIssued();
    } catch {} finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await exportCertificatePdf({
        certificateNo: 'DRAFT-PREVIEW',
        heading: effectiveHeading,
        subHeading: effectiveSubHeading,
        schoolName: schoolData.name || user?.school_name || activeCampus?.name || 'Elite Educational System',
        slogan: effectiveSlogan,
        campusName: activeCampus?.name || '',
        recipientName: activeRecipient?.name || 'Recipient Name',
        fatherName: activeRecipient?.father_name || '',
        identifierCode: activeRecipient?.gr_number || activeRecipient?.employee_code || '',
        classOrDesignation: form.recipient_type === 'Student'
          ? `${activeRecipient?.current_grade?.name || 'Class'} (${activeRecipient?.current_section || 'A'})`
          : (activeRecipient?.designation || 'Staff'),
        bodyText: effectiveBody,
        issueDate: form.issue_date,
        orientation: form.orientation || 'landscape',
        designStyle: form.design_style,
        accentColor: activeTemplate.accent_color || '#b59449',
        signatoryTitle1: form.signatory_title_1 || 'Teacher In-Charge',
        signatoryTitle2: form.signatory_title_2 || 'Principal / Headmaster',
        principalSignatureUrl: schoolData.principal_signature_url || '',
        showStamp: form.show_stamp !== false,
        showQr: form.show_qr !== false,
        verifyUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/certificate/PREVIEW`
      });
    } catch {} finally {
      setDownloading(false);
    }
  };

  const handleDownloadRow = async (c) => {
    await exportCertificatePdf({
      certificateNo: c.certificate_no,
      heading: c.heading || c.template_name,
      subHeading: c.sub_heading || 'THIS IS TO CERTIFY THAT',
      schoolName: schoolData.name || user?.school_name || activeCampus?.name || 'Elite Educational System',
      slogan: c.custom_slogan || defaultSlogan,
      campusName: c.campus_id?.name || activeCampus?.name || '',
      recipientName: c.recipient_name,
      fatherName: c.father_name || '',
      identifierCode: c.identifier_code || '',
      classOrDesignation: c.class_or_designation || '',
      bodyText: c.resolved_body,
      issueDate: c.issue_date ? c.issue_date.split('T')[0] : new Date().toISOString().split('T')[0],
      orientation: c.orientation || 'landscape',
      designStyle: c.design_style,
      accentColor: c.accent_color || '#b59449',
      signatoryTitle1: c.signatory_title_1 || 'Teacher In-Charge',
      signatoryTitle2: c.signatory_title_2 || 'Principal / Headmaster',
      principalSignatureUrl: schoolData.principal_signature_url || '',
      showStamp: c.show_stamp !== false,
      showQr: c.show_qr !== false,
      verifyUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/certificate/${c.certificate_no}`
    });
  };

  const prereqs = [
    { name: 'Templates', count: templates.length, addPath: '/admin/certificates?tab=templates', label: 'Add Template' },
    { name: 'Students', count: students.length, addPath: '/admin/students/new', label: 'Add Student' }
  ];

  return (
    <div className="w-full flex flex-col gap-2.5 xl:h-[calc(100vh-80px)] xl:max-h-[calc(100vh-80px)] xl:overflow-hidden">
      <div className="px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs flex items-center justify-between gap-3 shrink-0 print:hidden">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <span>{tab === 'templates' ? 'Certificate Templates Studio' : 'Certificate Generator Studio'}</span>
          </h1>
          <p className="text-[11px] font-semibold text-ink-muted hidden sm:block">
            {tab === 'templates'
              ? 'Manage institutional templates, award wording, and placeholder tags'
              : 'Design, issue, and print verifiable student and staff institutional credentials'}
          </p>
        </div>
        <div className="flex rounded-xl border border-line p-0.5 bg-surface-secondary/40 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setTab('generate')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              tab === 'generate' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Generate Certificate
          </button>
          <button
            type="button"
            onClick={() => setTab('templates')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              tab === 'templates' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            Certificate Templates
          </button>
        </div>
      </div>

      {tab === 'templates' ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <CertificateTemplatesManager templates={templates} onRefresh={loadData} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2.5 min-h-0">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-2.5 items-stretch xl:h-[490px] xl:max-h-[490px] shrink-0">
            <div className="xl:col-span-5 h-full min-h-0 print:hidden">
              <CertificateFormCard
                templates={templates}
                students={students}
                teachers={teachers}
                form={{
                  ...form,
                  custom_heading: effectiveHeading,
                  sub_heading: effectiveSubHeading,
                  custom_slogan: effectiveSlogan,
                  custom_body: effectiveBody
                }}
                defaultSlogan={defaultSlogan}
                onChange={(f, v) => setForm((p) => ({ ...p, [f]: v }))}
                onGenerate={handleGenerate}
                onPrint={() => window.print()}
                onDownloadPdf={handleDownloadPdf}
                generating={generating}
                downloading={downloading}
                prereqs={prereqs}
                onRefreshPrereqs={loadData}
              />
            </div>

            <div className="xl:col-span-7 h-full min-h-0 flex justify-center">
              <CertificatePreviewCanvas
                certificateNo="CERT-2026-0001"
                template={activeTemplate}
                style={form.design_style}
                orientation={form.orientation || 'landscape'}
                accentColor={activeTemplate.accent_color}
                school={{
                  name: schoolData.name || user?.school_name || activeCampus?.name || 'Elite Educational System',
                  slogan: effectiveSlogan,
                  logo_url: schoolData.logo_url || user?.school_logo || activeCampus?.logo,
                  principal_signature_url: schoolData.principal_signature_url || '',
                  address: schoolData.address || activeCampus?.address
                }}
                campus={activeCampus || {}}
                recipient={activeRecipient}
                recipientType={form.recipient_type}
                customText={form.custom_text}
                customHeading={effectiveHeading}
                subHeading={effectiveSubHeading}
                customSlogan={effectiveSlogan}
                customBody={effectiveBody}
                resolvedBody={resolvedTemplateBody}
                issueDate={form.issue_date}
                signatoryTitle1={form.signatory_title_1 || 'Teacher In-Charge'}
                signatoryTitle2={form.signatory_title_2 || 'Principal / Headmaster'}
                showStamp={form.show_stamp !== false}
                showQr={form.show_qr !== false}
                onPrint={() => window.print()}
                onDownloadPdf={handleDownloadPdf}
              />
            </div>
          </div>

          <div className="xl:h-[205px] xl:max-h-[210px] shrink-0 print:hidden min-h-0">
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
              onPreview={(c) => {
                setForm({
                  template_id: c.template_id,
                  recipient_type: c.recipient_type,
                  recipient_id: c.student_id?._id || c.staff_id?._id || '',
                  design_style: c.design_style,
                  orientation: c.orientation || 'landscape',
                  custom_heading: c.heading || '',
                  sub_heading: c.sub_heading || '',
                  custom_slogan: c.custom_slogan || defaultSlogan,
                  custom_body: c.resolved_body || '',
                  custom_text: c.custom_text,
                  issue_date: c.issue_date?.split('T')[0] || new Date().toISOString().split('T')[0],
                  signatory_title_1: c.signatory_title_1 || 'Teacher In-Charge',
                  signatory_title_2: c.signatory_title_2 || 'Principal / Headmaster',
                  show_stamp: c.show_stamp !== false,
                  show_qr: c.show_qr !== false
                });
              }}
              onPrintRow={() => window.print()}
              onDownloadRow={handleDownloadRow}
              onDelete={async (id) => {
                await api.delete(`/certificates/issued/${id}`);
                loadIssued();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
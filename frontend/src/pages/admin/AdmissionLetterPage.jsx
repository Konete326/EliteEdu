import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, LayoutGrid, FileText, Users, Sparkles } from 'lucide-react';
import AdmissionLetterDocument from '../../components/admin/students/admission/AdmissionLetterDocument';
import AdmissionStudentDrawer from '../../components/admin/students/admission/AdmissionStudentDrawer';
import AdmissionTemplateModal from '../../components/admin/students/admission/AdmissionTemplateModal';
import AdmissionTemplateCard from '../../components/admin/students/admission/AdmissionTemplateCard';
import AdmissionQuickEditModal from '../../components/admin/students/admission/AdmissionQuickEditModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import api from '../../services/api';
import { emitToastSuccess, emitToastError } from '../../utils/toastEvents';

const studentsPageCache = new Map();

const AdmissionLetterPage = () => {
  const [searchParams] = useSearchParams();
  const urlStudentId = searchParams.get('studentId');

  const [activeTab, setActiveTab] = useState('letter');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const selectedStudentRef = useRef(null);
  selectedStudentRef.current = selectedStudent;

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deletingTemplate, setDeletingTemplate] = useState(false);

  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStudentDrawerOpen, setIsStudentDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await api.get('/admission-letter-templates');
      if (res.data?.templates) {
        setTemplates(res.data.templates);
        if (!selectedTemplate) {
          const def = res.data.templates.find((t) => t.is_default) || res.data.templates[0];
          setSelectedTemplate(def || null);
        }
      }
    } catch {
      emitToastError('Failed to load admission letter templates');
    }
  }, [selectedTemplate]);

  useEffect(() => {
    fetchTemplates();
    Promise.all([api.get('/campuses'), api.get('/grades')])
      .then(([cRes, gRes]) => {
        if (cRes.data?.campuses) setCampuses(cRes.data.campuses);
        if (gRes.data?.grades) setGrades(gRes.data.grades);
      })
      .catch(() => {});
  }, [fetchTemplates]);

  const loadStudentDetails = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/students/${id}`);
      if (res.data?.student) setSelectedStudent(res.data.student);
    } catch {}
  }, []);

  useEffect(() => {
    if (urlStudentId) loadStudentDetails(urlStudentId);
  }, [urlStudentId, loadStudentDetails]);

  useEffect(() => {
    let active = true;
    const cacheKey = `${currentPage}_${debouncedSearch}_${selectedCampus}_${selectedGrade}`;

    if (studentsPageCache.has(cacheKey)) {
      const cached = studentsPageCache.get(cacheKey);
      setStudents(cached.students);
      setTotalPages(cached.totalPages);
      if (!selectedStudentRef.current && !urlStudentId && cached.students.length > 0) {
        loadStudentDetails(cached.students[0]._id);
      }
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      limit: 12,
      search: debouncedSearch,
      campus_id: selectedCampus,
      grade_id: selectedGrade,
      minimal: 'true'
    });

    api
      .get(`/students?${params.toString()}`)
      .then((res) => {
        if (!active) return;
        const list = res.data?.students || [];
        const pages = res.data?.totalPages || 1;
        studentsPageCache.set(cacheKey, { students: list, totalPages: pages });
        setStudents(list);
        setTotalPages(pages);
        if (!selectedStudentRef.current && !urlStudentId && list.length > 0) {
          loadStudentDetails(list[0]._id);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentPage, debouncedSearch, selectedCampus, selectedGrade, urlStudentId, loadStudentDetails]);

  const handleSelectStudent = (student) => {
    if (!student?._id) return;
    setSelectedStudent(student);
    loadStudentDetails(student._id);
  };

  const handleSaveTemplate = (saved) => {
    setTemplates((prev) => {
      const exists = prev.some((t) => t._id === saved._id);
      if (exists) {
        return prev.map((t) => (t._id === saved._id ? saved : saved.is_default ? { ...t, is_default: false } : t));
      }
      return [saved, ...prev.map((t) => (saved.is_default ? { ...t, is_default: false } : t))];
    });
    setSelectedTemplate(saved);
    emitToastSuccess(`Policy template "${saved.title}" saved successfully`);
  };

  const handleDuplicateTemplate = async (source) => {
    try {
      const payload = {
        ...source,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        title: `${source.title} (Copy)`,
        is_default: false
      };
      const res = await api.post('/admission-letter-templates', payload);
      if (res.data?.template) {
        handleSaveTemplate(res.data.template);
      }
    } catch (err) {
      emitToastError(err.response?.data?.message || 'Failed to duplicate template');
    }
  };

  const handleDeleteTemplateConfirm = async () => {
    if (!templateToDelete) return;
    try {
      setDeletingTemplate(true);
      await api.delete(`/admission-letter-templates/${templateToDelete._id}`);
      setTemplates((prev) => prev.filter((t) => t._id !== templateToDelete._id));
      if (selectedTemplate?._id === templateToDelete._id) {
        const remaining = templates.filter((t) => t._id !== templateToDelete._id);
        setSelectedTemplate(remaining[0] || null);
      }
      emitToastSuccess('Template deleted successfully');
      setTemplateToDelete(null);
    } catch (err) {
      emitToastError(err.response?.data?.message || 'Failed to delete template');
    } finally {
      setDeletingTemplate(false);
    }
  };

  return (
    <div className="w-full space-y-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-surface/90 dark:bg-[#0c0c0f]/90 border border-line dark:border-white/10 backdrop-blur-md shadow-xs print:hidden">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-ink dark:text-white tracking-tight">
            Admission Letters &amp; Policies
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Generate formal student offer letters, customize school clauses, and manage templates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-line dark:border-white/10 p-0.5 bg-surface-secondary/40">
            <button
              type="button"
              onClick={() => setActiveTab('letter')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'letter'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Admission Letter</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Letter Templates ({templates.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingTemplate(null);
              setIsTemplateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm shadow-primary/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Template</span>
          </button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-surface-secondary/30 dark:bg-white/5 border border-line dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-ink dark:text-white">Admission Letter Policy Templates</p>
                <p className="text-[11px] text-ink-muted">
                  Create tailored templates for Pre-Primary, Secondary, Scholarships, or Boarding admissions.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-primary">
              {templates.length} Saved {templates.length === 1 ? 'Template' : 'Templates'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <AdmissionTemplateCard
                key={tpl._id}
                template={tpl}
                isSelected={selectedTemplate?._id === tpl._id}
                onSelect={(chosen) => {
                  setSelectedTemplate(chosen);
                  setActiveTab('letter');
                }}
                onEdit={(target) => {
                  setEditingTemplate(target);
                  setIsTemplateModalOpen(true);
                }}
                onDuplicate={handleDuplicateTemplate}
                onDelete={(target) => setTemplateToDelete(target)}
                canDelete={templates.length > 1}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <AdmissionLetterDocument
            student={selectedStudent}
            template={selectedTemplate}
            templates={templates}
            onSelectTemplate={setSelectedTemplate}
            onEditTemplate={(tpl) => {
              setEditingTemplate(tpl);
              setIsTemplateModalOpen(true);
            }}
            onQuickEditClick={() => setIsEditOpen(true)}
            onOpenStudentDrawer={() => setIsStudentDrawerOpen(true)}
          />
        </div>
      )}

      <AdmissionStudentDrawer
        isOpen={isStudentDrawerOpen}
        onClose={() => setIsStudentDrawerOpen(false)}
        students={students}
        selectedStudent={selectedStudent}
        onSelectStudent={handleSelectStudent}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={(c) => {
          setSelectedCampus(c);
          setCurrentPage(1);
        }}
        grades={grades}
        selectedGrade={selectedGrade}
        onGradeChange={(g) => {
          setSelectedGrade(g);
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />

      <AdmissionTemplateModal
        isOpen={isTemplateModalOpen}
        template={editingTemplate}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setEditingTemplate(null);
        }}
        onSaved={handleSaveTemplate}
      />

      <AdmissionQuickEditModal
        isOpen={isEditOpen}
        student={selectedStudent}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => setSelectedStudent(updated)}
      />

      <ConfirmModal
        isOpen={Boolean(templateToDelete)}
        onClose={() => !deletingTemplate && setTemplateToDelete(null)}
        onConfirm={handleDeleteTemplateConfirm}
        title="Delete Admission Policy Template"
        message={`Are you sure you want to delete template "${templateToDelete?.title}"? This action cannot be undone.`}
        confirmText={deletingTemplate ? 'Deleting...' : 'Delete Template'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default AdmissionLetterPage;

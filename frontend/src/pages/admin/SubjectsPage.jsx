import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Sparkles, Plus, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import SubjectTopBar from '../../components/admin/subjects/SubjectTopBar';
import SubjectTable from '../../components/admin/subjects/SubjectTable';
import SubjectPagination from '../../components/admin/subjects/SubjectPagination';
import SubjectModal from '../../components/admin/subjects/SubjectModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', subject: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchCampuses = async () => {
    try {
      const res = await api.get('/campuses');
      setCampuses(res.data.campuses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 50,
        campus_id: selectedCampus,
        search: searchQuery
      };
      const res = await api.get('/subjects', { params });
      setSubjects(res.data.subjects || []);
      setTotalItems(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      setCurrentPage(res.data.page || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, [selectedCampus, searchQuery]);

  useEffect(() => {
    fetchCampuses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubjects(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchSubjects]);

  const handleToggle = async (id, field) => {
    const target = subjects.find((s) => s._id === id);
    if (!target) return;

    const previousValue = target[field];
    const optimisticValue = field === 'status' ? (previousValue === 'Active' ? 'Inactive' : 'Active') : !previousValue;

    setSubjects((prev) =>
      prev.map((s) => (s._id === id ? { ...s, [field]: optimisticValue } : s))
    );

    try {
      setToggleLoadingId(id);
      await api.patch(`/subjects/${id}/toggle`, { field });
    } catch (err) {
      setSubjects((prev) =>
        prev.map((s) => (s._id === id ? { ...s, [field]: previousValue } : s))
      );
      setError(err.response?.data?.message || 'Failed to toggle subject property');
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleAutoLoad = async () => {
    try {
      setIsSeeding(true);
      setError('');
      const payload = { campus_id: selectedCampus !== 'all' ? selectedCampus : null };
      await api.post('/subjects/seed-defaults', payload);
      await fetchSubjects(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to auto-seed standard subjects');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      if (modalState.mode === 'edit' && modalState.subject?._id) {
        await api.put(`/subjects/${modalState.subject._id}`, formData);
      } else {
        await api.post('/subjects', formData);
      }
      setModalState({ isOpen: false, mode: 'add', subject: null });
      await fetchSubjects(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete?._id) return;
    try {
      setDeleteLoading(true);
      setError('');
      await api.delete(`/subjects/${subjectToDelete._id}`);
      setSubjectToDelete(null);
      await fetchSubjects(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subject');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <SubjectTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={(val) => {
          setSelectedCampus(val);
          setCurrentPage(1);
        }}
        onAutoLoad={handleAutoLoad}
        onAddClick={() => setModalState({ isOpen: true, mode: 'add', subject: null })}
        isSeeding={isSeeding}
      />

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <PageLoader text="Loading subjects..." />
        ) : subjects.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">No subjects found</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">
                {searchQuery
                  ? `No subjects matched "${searchQuery}".`
                  : 'Start by auto-loading standard curriculum courses or create one manually.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-1">
              {!searchQuery && (
                <button
                  type="button"
                  onClick={handleAutoLoad}
                  disabled={isSeeding}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary text-primary dark:text-primary-dark text-xs font-semibold hover:bg-primary-soft dark:hover:bg-primary/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Load Standard</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setModalState({ isOpen: true, mode: 'add', subject: null })}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subject</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <SubjectTable
              subjects={subjects}
              onEdit={(s) => setModalState({ isOpen: true, mode: 'edit', subject: s })}
              onDelete={setSubjectToDelete}
              onToggle={handleToggle}
              toggleLoadingId={toggleLoadingId}
            />
            <SubjectPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={50}
              onPageChange={(page) => fetchSubjects(page)}
            />
          </>
        )}
      </div>

      <SubjectModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        subject={modalState.subject}
        campuses={campuses}
        onClose={() => setModalState({ isOpen: false, mode: 'add', subject: null })}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={!!subjectToDelete}
        onClose={() => !deleteLoading && setSubjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        message={`Are you sure you want to delete ${subjectToDelete?.name || 'this subject'}? This will remove it from all course listings.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default SubjectsPage;

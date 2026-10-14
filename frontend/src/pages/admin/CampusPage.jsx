import { useState, useEffect, useMemo } from 'react';
import { Building2, Plus, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import CampusHeader from '../../components/admin/campus/CampusHeader';
import CampusCard from '../../components/admin/campus/CampusCard';
import CampusModal from '../../components/admin/campus/CampusModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const CampusPage = () => {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add',
    campus: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [campusToDelete, setCampusToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCampuses = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/campuses');
      setCampuses(res.data.campuses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  const filteredCampuses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return campuses;
    return campuses.filter((c) => {
      const name = c.name?.toLowerCase() || '';
      const email = c.email?.toLowerCase() || '';
      const website = c.website?.toLowerCase() || '';
      const address = c.address?.toLowerCase() || '';
      const phone = c.contact_number?.toLowerCase() || '';
      return (
        name.includes(query) ||
        email.includes(query) ||
        website.includes(query) ||
        address.includes(query) ||
        phone.includes(query)
      );
    });
  }, [campuses, searchQuery]);

  const handleOpenAdd = () => {
    setModalState({ isOpen: true, mode: 'add', campus: null });
  };

  const handleOpenView = (campus) => {
    setModalState({ isOpen: true, mode: 'view', campus });
  };

  const handleOpenEdit = (campus) => {
    setModalState({ isOpen: true, mode: 'edit', campus });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'add', campus: null });
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');

      if (modalState.mode === 'edit' && modalState.campus?._id) {
        const res = await api.put(`/campuses/${modalState.campus._id}`, formData);
        setCampuses((prev) =>
          prev.map((c) => (c._id === modalState.campus._id ? res.data.campus : c))
        );
      } else {
        const res = await api.post('/campuses', formData);
        setCampuses((prev) => [res.data.campus, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save campus');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!campusToDelete?._id) return;
    try {
      setDeleteLoading(true);
      setError('');
      await api.delete(`/campuses/${campusToDelete._id}`);
      setCampuses((prev) => prev.filter((c) => c._id !== campusToDelete._id));
      setCampusToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete campus');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CampusHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleOpenAdd}
        totalCount={campuses.length}
        filteredCount={filteredCampuses.length}
      />

      {error && (
        <div className="p-4 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <PageLoader text="Loading campuses..." />
      ) : campuses.length === 0 ? (
        <div className="p-12 text-center space-y-4 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ink dark:text-ink-dark">No campuses found</h3>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark max-w-sm mx-auto">
              Click + Add Campus to create your first branch.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Campus</span>
          </button>
        </div>
      ) : filteredCampuses.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl">
          <Building2 className="w-10 h-10 mx-auto text-ink-muted" />
          <p className="text-base font-semibold text-ink dark:text-ink-dark">No matching campuses</p>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">
            No campus matched your search term "{searchQuery}".
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-sm font-semibold text-primary dark:text-primary-dark hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampuses.map((campus) => (
            <CampusCard
              key={campus._id}
              campus={campus}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
              onDelete={setCampusToDelete}
            />
          ))}
        </div>
      )}

      <CampusModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        campus={modalState.campus}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={!!campusToDelete}
        onClose={() => !deleteLoading && setCampusToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Campus"
        message={`Are you sure you want to delete ${campusToDelete?.name || 'this campus'}? This action is permanent and cannot be reversed.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default CampusPage;

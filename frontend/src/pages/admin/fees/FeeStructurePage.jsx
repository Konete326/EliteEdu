import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import FeeStructureForm from '../../../components/admin/fees/FeeStructureForm';
import FeeStructureList from '../../../components/admin/fees/FeeStructureList';
import ConfirmModal from '../../../components/common/ConfirmModal';

const FeeStructurePage = () => {
  const { showToast } = useToast();
  const [structures, setStructures] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [stRes, grdRes] = await Promise.all([
        api.get('/fees/structures').catch(() => ({ data: { structures: [] } })),
        api.get('/grades').catch(() => ({ data: { data: [] } }))
      ]);
      if (stRes.data?.structures) setStructures(stRes.data.structures);
      if (grdRes.data?.data) setGrades(grdRes.data.data);
    } catch {
      showToast('Failed to load fee structures', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (formData, onDone) => {
    try {
      setLoading(true);
      const isEdit = Boolean(editingItem?._id);
      const url = isEdit ? `/fees/structures/${editingItem._id}` : '/fees/structures';
      const method = isEdit ? api.put : api.post;

      const res = await method(url, formData);
      if (res.data?.success) {
        showToast(isEdit ? 'Fee structure updated' : 'Fee structure saved', 'success');
        setEditingItem(null);
        if (onDone) onDone();
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving structure', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setLoading(true);
      await api.delete(`/fees/structures/${itemToDelete}`);
      showToast('Fee structure deleted', 'success');
      setItemToDelete(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-ink dark:text-ink-dark uppercase tracking-tight">Fee Structure Studio</h1>
        <p className="text-xs text-ink-muted">Configure class-wise tuition fees, admission charges, lab charges, late fines, and custom fee heads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5">
          <FeeStructureForm
            grades={grades}
            onSubmit={handleSubmit}
            loading={loading}
            editingItem={editingItem}
            onCancelEdit={setEditingItem}
          />
        </div>
        <div className="lg:col-span-7">
          <FeeStructureList
            structures={structures}
            onEdit={setEditingItem}
            onDelete={(id) => setItemToDelete(id)}
            loading={loading}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Fee Structure"
        message="Are you sure you want to remove this class fee structure? Existing invoices will not be affected."
      />
    </div>
  );
};

export default FeeStructurePage;

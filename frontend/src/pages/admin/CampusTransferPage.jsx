import { useState } from 'react';
import api from '../../services/api';
import TransferHeader from '../../components/admin/campustransfer/TransferHeader';
import TransferKpiStrip from '../../components/admin/campustransfer/TransferKpiStrip';
import TransferLedgerTable from '../../components/admin/campustransfer/TransferLedgerTable';
import TransferExecutionModal from '../../components/admin/campustransfer/TransferExecutionModal';
import PrintableTransferOrderModal from '../../components/admin/campustransfer/PrintableTransferOrderModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useCampusTransferData } from '../../components/admin/campustransfer/useCampusTransferData';
import { useToast } from '../../context/ToastContext';

const CampusTransferPage = () => {
  const { showToast } = useToast();
  const {
    campuses, grades, students, teachers, transfers, kpis, loading,
    prereqsLoading, loadData, loadPrereqs
  } = useCampusTransferData();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [transferToDelete, setTransferToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleExecute = async (payload) => {
    setExecuting(true);
    try {
      const res = await api.post('/campus-transfers', payload);
      if (res.data?.success) {
        showToast('Campus transfer executed successfully', 'success');
        setSelectedTransfer(res.data.data);
        loadData();
        return true;
      }
      return false;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to execute transfer', 'error');
      return false;
    } finally {
      setExecuting(false);
    }
  };

  const handleDelete = async () => {
    if (!transferToDelete?._id) return;
    setDeleting(true);
    try {
      await api.delete(`/campus-transfers/${transferToDelete._id}`);
      showToast('Transfer audit record deleted', 'success');
      setTransferToDelete(null);
      loadData();
    } catch {
      showToast('Failed to delete transfer record', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-3 sm:gap-4">
      <TransferHeader
        totalTransfers={transfers.length}
        loading={loading}
        onRefresh={loadData}
        onInitiateTransfer={() => {
          loadPrereqs();
          setIsTransferModalOpen(true);
        }}
      />

      <TransferKpiStrip kpis={kpis} />

      <TransferLedgerTable
        transfers={transfers}
        loading={loading}
        onPrint={setSelectedTransfer}
        onDelete={setTransferToDelete}
      />

      <TransferExecutionModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        campuses={campuses}
        grades={grades}
        students={students}
        teachers={teachers}
        prereqsLoading={prereqsLoading}
        loadPrereqs={loadPrereqs}
        onExecute={handleExecute}
        executing={executing}
      />

      <PrintableTransferOrderModal
        transfer={selectedTransfer}
        isOpen={Boolean(selectedTransfer)}
        onClose={() => setSelectedTransfer(null)}
      />

      <ConfirmModal
        isOpen={Boolean(transferToDelete)}
        onClose={() => !deleting && setTransferToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Transfer Record"
        message={`Are you sure you want to remove transfer order "${transferToDelete?.transfer_no || ''}"? This action will permanently remove the audit entry.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Record'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default CampusTransferPage;

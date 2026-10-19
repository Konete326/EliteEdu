import { useState } from 'react';
import api from '../../services/api';
import TransferHeader from '../../components/admin/transfer/TransferHeader';
import TransferKpiStrip from '../../components/admin/campustransfer/TransferKpiStrip';
import TransferLedgerTable from '../../components/admin/campustransfer/TransferLedgerTable';
import TransferExecutionModal from '../../components/admin/campustransfer/TransferExecutionModal';
import PrintableTransferOrderModal from '../../components/admin/campustransfer/PrintableTransferOrderModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useCampusTransferData } from '../../components/admin/campustransfer/useCampusTransferData';

const CampusTransferPage = () => {
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
        setSelectedTransfer(res.data.data);
        loadData();
        return true;
      }
      return false;
    } catch {
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
      setTransferToDelete(null);
      loadData();
    } catch {} finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <TransferHeader
        totalTransfers={transfers.length}
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
        message={`Remove order ${transferToDelete?.transfer_no || ''}? This will only delete the audit record.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Record'}
        confirmStyle="danger"
      />
    </div>
  );
};

export default CampusTransferPage;

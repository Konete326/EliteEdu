import ConfirmModal from '../ConfirmModal';

const LogsModals = ({
  logToDelete,
  onCloseDelete,
  onConfirmDelete,
  showClearModal,
  onCloseClear,
  onConfirmClear
}) => {
  return (
    <>
      <ConfirmModal
        isOpen={Boolean(logToDelete)}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        title="Delete Log Record"
        message="Are you sure you want to delete this log entry? It will be permanently removed from MongoDB."
        confirmText="Delete"
        confirmStyle="danger"
      />
      <ConfirmModal
        isOpen={showClearModal}
        onClose={onCloseClear}
        onConfirm={onConfirmClear}
        title="Clear Filtered Logs"
        message="Are you sure you want to clear these logs? All matching records will be permanently removed."
        confirmText="Clear All"
        confirmStyle="danger"
      />
    </>
  );
};

export default LogsModals;

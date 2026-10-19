import GenerateChallansModal from './GenerateChallansModal';
import ChallanSettingsModal from './ChallanSettingsModal';
import BulkDueDateModal from './BulkDueDateModal';
import ThreeCopyBankChallanModal from './ThreeCopyBankChallanModal';
import FeeReceiptModal from './FeeReceiptModal';

const FeeCollectionModals = ({
  isGenerateOpen, setIsGenerateOpen, grades, onGenerateSuccess,
  isSettingsOpen, setIsSettingsOpen, onSettingsSuccess,
  isDueDateOpen, setIsDueDateOpen, selectedIds, onDueDateSuccess,
  isPrintModalOpen, setIsPrintModalOpen, printInvoicesList, bankSettings,
  isReceiptOpen, setIsReceiptOpen, activeReceipt
}) => {
  return (
    <>
      <GenerateChallansModal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} grades={grades} onSuccess={onGenerateSuccess} />
      <ChallanSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSuccess={onSettingsSuccess} />
      <BulkDueDateModal isOpen={isDueDateOpen} onClose={() => setIsDueDateOpen(false)} selectedCount={selectedIds.length} selectedIds={selectedIds} onSuccess={onDueDateSuccess} />
      <ThreeCopyBankChallanModal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} invoices={printInvoicesList} bankSettings={bankSettings} />
      <FeeReceiptModal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} payment={activeReceipt} />
    </>
  );
};

export default FeeCollectionModals;

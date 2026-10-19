import ConfirmModal from '../../common/ConfirmModal';
import AutoLoadConfirmModal from '../../common/AutoLoadConfirmModal';
import GradeModal from './GradeModal';
import GradeDetailsModal from './GradeDetailsModal';
import { STANDARD_SEQUENCE } from '../../../utils/gradeSortHelper';

const GradeModals = ({
  modalOpen,
  selectedGrade,
  onCloseModal,
  onSaveGrade,
  viewGrade,
  onCloseView,
  onEditGrade,
  deleteTarget,
  onCloseDelete,
  onConfirmDelete,
  showAutoLoadModal,
  isSeeding,
  onCloseAutoLoad,
  onConfirmAutoLoad,
  targetCampusName,
  campuses = [],
  teachers = []
}) => {
  return (
    <>
      <GradeModal
        isOpen={modalOpen}
        onClose={onCloseModal}
        onSave={onSaveGrade}
        grade={selectedGrade}
        campuses={campuses}
        teachers={teachers}
      />

      <GradeDetailsModal
        isOpen={!!viewGrade}
        grade={viewGrade}
        onClose={onCloseView}
        onEdit={onEditGrade}
        campuses={campuses}
        teachers={teachers}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        title="Delete Grade"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Grade"
        confirmStyle="danger"
      />

      <AutoLoadConfirmModal
        isOpen={showAutoLoadModal}
        onClose={onCloseAutoLoad}
        onConfirm={onConfirmAutoLoad}
        isLoading={isSeeding}
        title="Auto-Load Standard Classes"
        description="Seed standard academic levels in proper sequence (Playgroup to Class 10) with default sections."
        targetName={targetCampusName}
        features={[
          'Creates standard academic levels in chronological sequence',
          'Configures default Sections A & B with Active status',
          'Safe operation: existing classes and assigned teachers remain unchanged'
        ]}
        sequencePreview={STANDARD_SEQUENCE}
      />
    </>
  );
};

export default GradeModals;

import { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, RefreshCw, X } from 'lucide-react';
import PrerequisiteGuardBanner from '../../common/PrerequisiteGuardBanner';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import TransferPersonSelect from './TransferPersonSelect';
import TransferTargetFields from './TransferTargetFields';

const INITIAL = {
  entity_type: 'Student', person_id: '', to_campus_id: '', to_grade_id: '',
  to_section: 'A', transfer_date: new Date().toISOString().split('T')[0],
  reason: '', transfer_unpaid_dues: true
};

const TransferExecutionModal = ({
  isOpen, onClose, campuses = [], grades = [], students = [], teachers = [],
  onExecute, executing, prereqsLoading = false, loadPrereqs
}) => {
  const [form, setForm, clearDraft] = usePersistentFormDraft('campus_transfer_draft_v1', INITIAL);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const isStudent = form.entity_type === 'Student';
  const personList = isStudent ? students : teachers;

  useEffect(() => {
    if (isOpen && loadPrereqs) {
      loadPrereqs();
    }
  }, [isOpen, loadPrereqs]);

  useEffect(() => {
    const p = form.person_id ? personList.find((x) => x._id === form.person_id) : null;
    setSelectedPerson(p || null);
  }, [form.person_id, personList]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.person_id || !form.to_campus_id || !form.reason.trim()) return;

    const payload = {
      entity_type: form.entity_type, to_campus_id: form.to_campus_id,
      transfer_date: form.transfer_date, reason: form.reason.trim(),
      transfer_unpaid_dues: form.transfer_unpaid_dues
    };

    if (isStudent) {
      payload.student_id = form.person_id;
      payload.to_grade_id = form.to_grade_id || selectedPerson?.current_grade || selectedPerson?.grade_id;
      payload.to_section = form.to_section || selectedPerson?.current_section || 'A';
    } else {
      payload.staff_id = form.person_id;
    }

    const success = await onExecute(payload);
    if (success) {
      clearDraft();
      setSelectedPerson(null);
      onClose();
    }
  };

  const prereqs = [{ name: 'Campus Branches (Min 2)', count: campuses.length, addPath: '/admin/campus', label: 'Add Campus' }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-surface dark:bg-surface-dark border border-line rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-ink dark:text-ink-dark">Execute Branch Transfer</h3>
                {prereqsLoading && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Syncing...
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted">Relocate student or faculty member across branches with live audit trail</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <PrerequisiteGuardBanner prerequisites={prereqs} />

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <TransferPersonSelect form={form} setForm={setForm} personList={personList} isStudent={isStudent} selectedPerson={selectedPerson} campuses={campuses} />
          <TransferTargetFields form={form} setForm={setForm} campuses={campuses} grades={grades} isStudent={isStudent} selectedPerson={selectedPerson} />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-line text-ink-muted hover:text-ink text-xs font-semibold cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={executing || prereqsLoading || campuses.length < 2 || !form.person_id || !form.to_campus_id}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Confirm & Execute Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferExecutionModal;

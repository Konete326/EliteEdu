import { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, RefreshCw, X, AlertCircle } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import TransferPersonSelect from './TransferPersonSelect';
import TransferTargetFields from './TransferTargetFields';

const INITIAL = {
  entity_type: 'Student',
  person_id: '',
  to_campus_id: '',
  to_grade_id: '',
  to_section: 'A',
  transfer_date: new Date().toISOString().split('T')[0],
  reason: '',
  transfer_unpaid_dues: true
};

const TransferExecutionModal = ({
  isOpen,
  onClose,
  campuses = [],
  grades = [],
  students = [],
  teachers = [],
  onExecute,
  executing,
  prereqsLoading = false,
  loadPrereqs
}) => {
  const [form, setForm, clearDraft] = usePersistentFormDraft('campus_transfer_draft_v2', INITIAL);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const isStudent = form.entity_type === 'Student';
  const personList = isStudent ? students : teachers;

  useEffect(() => {
    if (isOpen && loadPrereqs) {
      loadPrereqs();
    }
  }, [isOpen, loadPrereqs]);

  useEffect(() => {
    const p = form.person_id ? personList.find((x) => String(x._id) === String(form.person_id)) : null;
    setSelectedPerson(p || null);
  }, [form.person_id, personList]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.person_id || !form.to_campus_id || !form.reason.trim()) return;

    const payload = {
      entity_type: form.entity_type,
      to_campus_id: form.to_campus_id,
      transfer_date: form.transfer_date,
      reason: form.reason.trim(),
      transfer_unpaid_dues: form.transfer_unpaid_dues
    };

    if (isStudent) {
      payload.student_id = form.person_id;
      payload.to_grade_id = form.to_grade_id || selectedPerson?.current_grade?._id || selectedPerson?.current_grade;
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

  const hasEnoughCampuses = campuses.length >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-ink dark:text-white">
                  Execute Campus Transfer
                </h3>
                {prereqsLoading && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Syncing...
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted">
                Transfer student or staff member to another branch with instant audit trail
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {!hasEnoughCampuses ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle size={14} />
              <span>Multi-Branch Setup Required</span>
            </div>
            <p>
              Inter-campus transfers require at least 2 registered branches. Please register an additional campus branch first.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <TransferPersonSelect
              form={form}
              setForm={setForm}
              personList={personList}
              isStudent={isStudent}
              selectedPerson={selectedPerson}
              campuses={campuses}
            />

            <TransferTargetFields
              form={form}
              setForm={setForm}
              campuses={campuses}
              grades={grades}
              isStudent={isStudent}
              selectedPerson={selectedPerson}
            />

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line dark:border-line-dark">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={executing || !form.person_id || !form.to_campus_id || !form.reason.trim()}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {executing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirm & Execute</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransferExecutionModal;

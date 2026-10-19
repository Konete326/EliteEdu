import { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, RefreshCw } from 'lucide-react';
import PrerequisiteGuardBanner from '../../common/PrerequisiteGuardBanner';
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

const TransferExecutionCard = ({ campuses = [], grades = [], students = [], teachers = [], onExecute, executing }) => {
  const [form, setForm, clearDraft] = usePersistentFormDraft('campus_transfer_draft_v1', INITIAL);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const isStudent = form.entity_type === 'Student';
  const personList = isStudent ? students : teachers;

  useEffect(() => {
    const p = form.person_id ? personList.find((x) => x._id === form.person_id) : null;
    setSelectedPerson(p || null);
  }, [form.person_id, personList]);

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
      payload.to_grade_id = form.to_grade_id || selectedPerson?.current_grade || selectedPerson?.grade_id;
      payload.to_section = form.to_section || selectedPerson?.current_section || 'A';
    } else {
      payload.staff_id = form.person_id;
    }

    const success = await onExecute(payload);
    if (success) {
      clearDraft();
      setSelectedPerson(null);
    }
  };

  const prereqs = [{ name: 'Campus Branches (Min 2)', count: campuses.length, addPath: '/admin/campus', label: 'Add Campus' }];

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <ArrowLeftRight className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-black text-ink dark:text-ink-dark">Execute Branch Transfer</h3>
          <p className="text-[10px] text-ink-muted">Transfer students or staff across active school campuses</p>
        </div>
      </div>

      <PrerequisiteGuardBanner prerequisites={prereqs} />

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
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

        <button
          type="submit"
          disabled={executing || campuses.length < 2 || !form.person_id || !form.to_campus_id}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
        >
          {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Confirm & Execute Campus Transfer</span>
        </button>
      </form>
    </div>
  );
};

export default TransferExecutionCard;

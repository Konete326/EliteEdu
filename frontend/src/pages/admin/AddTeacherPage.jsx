import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useTeacherForm } from '../../hooks/useTeacherForm';
import PageLoader from '../../components/common/PageLoader';
import TeacherTopActionBar from '../../components/admin/teachers/TeacherTopActionBar';
import TeacherTabsNav from '../../components/admin/teachers/TeacherTabsNav';
import TeacherProfileTab from '../../components/admin/teachers/TeacherProfileTab';
import TeacherClassesTab from '../../components/admin/teachers/TeacherClassesTab';
import TeacherAppSettingsTab from '../../components/admin/teachers/TeacherAppSettingsTab';
import TeacherPayrollTab from '../../components/admin/teachers/TeacherPayrollTab';
import TeacherDependentTabs from '../../components/admin/teachers/TeacherDependentTabs';

const AddTeacherPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const {
    formData, campuses, subjects, grades,
    loading, submitting, error, setError, errors, saveTeacher,
    handleField, handleEmergency, handleBank,
    isEditMode, schoolType
  } = useTeacherForm(id);

  if (loading) return <PageLoader text="Loading staff records..." />;

  const handleSaveAction = async (customRedirect) => {
    try {
      const saved = await saveTeacher(customRedirect);
      if (!customRedirect && saved?._id && !id) navigate(`/admin/teachers/${saved._id}/edit`, { replace: true });
    } catch (e) {
      setActiveTab('profile');
      setError(e.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full space-y-6 pb-16">
      <div className="sticky top-[1px] z-20 mt-[1px] pb-2.5 pt-1 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-md border-b border-line dark:border-line-dark space-y-3 shadow-xs">
        <TeacherTopActionBar
          isEditMode={isEditMode}
          staffName={formData.name}
          schoolType={schoolType}
          onSave={() => handleSaveAction(true)}
          submitting={submitting}
        />
        <TeacherTabsNav activeTab={activeTab} onTabChange={setActiveTab} schoolType={schoolType} />
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold cursor-pointer">Dismiss</button>
        </div>
      )}

      {activeTab === 'profile' && (
        <TeacherProfileTab
          formData={formData}
          errors={errors}
          onFieldChange={handleField}
          onEmergencyChange={handleEmergency}
          campuses={campuses}
          schoolType={schoolType}
        />
      )}

      {activeTab === 'classes' && (
        <TeacherClassesTab
          subjects={subjects}
          grades={grades}
          assignments={formData.class_assignments || []}
          onAssignmentsChange={(a) => handleField('class_assignments', a)}
        />
      )}

      {activeTab === 'app_settings' && (
        <TeacherAppSettingsTab
          permissions={formData.app_permissions}
          onChange={(p) => handleField('app_permissions', p)}
          schoolType={schoolType}
        />
      )}

      {activeTab === 'payroll' && schoolType !== 'Government' && (
        <TeacherPayrollTab
          payrollConfig={formData.payroll_config}
          onPayrollChange={(p) => handleField('payroll_config', p)}
          basicSalary={formData.basic_salary}
          onSalaryChange={(s) => handleField('basic_salary', s)}
          bankDetails={formData.bank_details}
          onBankChange={handleBank}
          staffName={formData.name}
        />
      )}

      {['security_deposit', 'increment_history', 'loan_advance', 'follow_up', 'documents', 'active_sessions'].includes(activeTab) && (
        <TeacherDependentTabs
          activeTab={activeTab}
          teacherId={id}
          formData={formData}
          onSaveNow={() => handleSaveAction(false)}
          onUpdateField={handleField}
        />
      )}
    </div>
  );
};

export default AddTeacherPage;

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useStudentForm } from '../../hooks/useStudentForm';
import PageLoader from '../../components/common/PageLoader';
import StudentTopActionBar from '../../components/admin/students/StudentTopActionBar';
import StudentTabsNav from '../../components/admin/students/StudentTabsNav';
import StudentProfileTab from '../../components/admin/students/tabs/StudentProfileTab';
import StudentFamilyTab from '../../components/admin/students/tabs/StudentFamilyTab';
import StudentContactTab from '../../components/admin/students/tabs/StudentContactTab';
import StudentAcademicTab from '../../components/admin/students/tabs/StudentAcademicTab';
import StudentSubjectsTab from '../../components/admin/students/tabs/StudentSubjectsTab';
import StudentAppSettingsTab from '../../components/admin/students/tabs/StudentAppSettingsTab';
import StudentDocumentsTab from '../../components/admin/students/tabs/StudentDocumentsTab';

const AddStudentPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('profile');

  const {
    formData, campuses, grades, subjects, loading, submitting, error, setError,
    errors, saveStudent, handleField, handleNestedField, handleToggleAppSetting,
    handleToggleAllAppSettings, handleToggleSubject
  } = useStudentForm(id);

  const currentGradeName = grades.find(
    (g) => g._id === (formData.current_grade?._id || formData.current_grade)
  )?.name || '';

  if (loading) return <PageLoader text="Loading student record..." />;

  const handleSave = async () => {
    try {
      await saveStudent();
    } catch (e) {
      setActiveTab('profile');
      setError(e.message);
    }
  };

  return (
    <div className="w-full space-y-6 pb-16">
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-2 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-md border-b border-line dark:border-line-dark space-y-3 shadow-xs">
        <StudentTopActionBar
          isEditMode={Boolean(id)}
          studentName={formData.name}
          onSave={handleSave}
          submitting={submitting}
        />
        <StudentTabsNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold cursor-pointer">Dismiss</button>
        </div>
      )}

      {activeTab === 'profile' && (
        <StudentProfileTab formData={formData} errors={errors} campuses={campuses} grades={grades} onChange={handleField} />
      )}
      {activeTab === 'family' && (
        <StudentFamilyTab formData={formData} onNestedChange={handleNestedField} onChange={handleField} />
      )}
      {activeTab === 'contact' && (
        <StudentContactTab formData={formData} onNestedChange={handleNestedField} onChange={handleField} />
      )}
      {activeTab === 'academic' && (
        <StudentAcademicTab formData={formData} onNestedChange={handleNestedField} />
      )}
      {activeTab === 'subjects' && (
        <StudentSubjectsTab
          subjects={subjects}
          selectedSubjectIds={formData.subjects || []}
          onToggleSubject={handleToggleSubject}
          onChange={handleField}
          currentGradeName={currentGradeName}
        />
      )}
      {activeTab === 'app_settings' && (
        <StudentAppSettingsTab
          appSettings={formData.app_settings}
          onToggleSetting={handleToggleAppSetting}
          onToggleAll={handleToggleAllAppSettings}
        />
      )}
      {activeTab === 'documents' && (
        <StudentDocumentsTab formData={formData} onChange={handleField} />
      )}
    </div>
  );
};

export default AddStudentPage;

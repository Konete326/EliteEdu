import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useStaffApplicantForm } from '../../hooks/useStaffApplicantForm';
import PageLoader from '../../components/common/PageLoader';
import ApplicantTopActionBar from '../../components/admin/applicants/form/ApplicantTopActionBar';
import ApplicantTabsNav from '../../components/admin/applicants/form/ApplicantTabsNav';
import ApplicantPersonalInfoTab from '../../components/admin/applicants/form/ApplicantPersonalInfoTab';
import ApplicantProfessionalTab from '../../components/admin/applicants/form/ApplicantProfessionalTab';
import ApplicantAddressTab from '../../components/admin/applicants/form/ApplicantAddressTab';
import ApplicantDocumentsTab from '../../components/admin/applicants/form/ApplicantDocumentsTab';
import ApplicantFollowUpsTab from '../../components/admin/applicants/form/ApplicantFollowUpsTab';

const AddStaffApplicantPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('personal');

  const {
    formData, campuses, teachers, loading, submitting, error, setError,
    handleField, handleAddDocument, handleRemoveDocument, handleAddFollowUp,
    handleRemoveFollowUp, saveApplicant
  } = useStaffApplicantForm(id);

  if (loading) return <PageLoader text="Loading applicant profile..." />;

  const handleSave = async () => {
    try {
      await saveApplicant();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="w-full space-y-6 pb-16">
      <ApplicantTopActionBar
        isEditMode={Boolean(id)}
        applicantName={formData.name}
        onSave={handleSave}
        submitting={submitting}
      />

      <ApplicantTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {error && (
        <div className="p-3.5 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="underline font-semibold">Dismiss</button>
        </div>
      )}

      {activeTab === 'personal' && (
        <ApplicantPersonalInfoTab
          formData={formData}
          onChange={handleField}
          teachers={teachers}
        />
      )}

      {activeTab === 'professional' && (
        <ApplicantProfessionalTab
          formData={formData}
          onChange={handleField}
          campuses={campuses}
        />
      )}

      {activeTab === 'address' && (
        <ApplicantAddressTab
          formData={formData}
          onChange={handleField}
        />
      )}

      {activeTab === 'documents' && (
        <ApplicantDocumentsTab
          formData={formData}
          onChange={handleField}
          onAddDocument={handleAddDocument}
          onRemoveDocument={handleRemoveDocument}
        />
      )}

      {activeTab === 'followups' && (
        <ApplicantFollowUpsTab
          formData={formData}
          onAddFollowUp={handleAddFollowUp}
          onRemoveFollowUp={handleRemoveFollowUp}
        />
      )}
    </div>
  );
};

export default AddStaffApplicantPage;

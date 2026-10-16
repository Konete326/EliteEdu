import useSchoolGeneralSettings from '../../hooks/useSchoolGeneralSettings';
import GeneralSettingsHeader from '../../components/admin/settings/GeneralSettingsHeader';
import SchoolLogoUploadCard from '../../components/admin/settings/SchoolLogoUploadCard';
import SchoolBasicInfoCard from '../../components/admin/settings/SchoolBasicInfoCard';
import SchoolContactAndPdfCard from '../../components/admin/settings/SchoolContactAndPdfCard';
import LiveDocumentHeaderPreview from '../../components/admin/settings/LiveDocumentHeaderPreview';
import SettingsFeedbackModal from '../../components/admin/settings/SettingsFeedbackModal';

const GeneralSettingsPage = () => {
  const {
    settings,
    loading,
    saving,
    feedback,
    isDirty,
    handleChange,
    handleSave,
    closeFeedback
  } = useSchoolGeneralSettings();

  if (loading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-20 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 space-y-4">
            <div className="h-44 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
            <div className="h-64 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
          </div>
          <div className="xl:col-span-4 h-96 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <GeneralSettingsHeader
        settings={settings}
        isDirty={isDirty}
        saving={saving}
        onSave={handleSave}
      />

      <div className="flex flex-col xl:flex-row items-start gap-4">
        <div className="flex-1 w-full min-w-0 space-y-4">
          <SchoolLogoUploadCard
            logoUrl={settings.logo_url}
            onLogoChange={(val) => handleChange('logo_url', val)}
          />

          <SchoolBasicInfoCard
            settings={settings}
            onChange={handleChange}
          />

          <SchoolContactAndPdfCard
            settings={settings}
            onChange={handleChange}
          />
        </div>

        <div className="w-full xl:w-[350px] 2xl:w-[380px] shrink-0">
          <LiveDocumentHeaderPreview settings={settings} />
        </div>
      </div>

      <SettingsFeedbackModal
        feedback={feedback}
        onClose={closeFeedback}
      />
    </div>
  );
};

export default GeneralSettingsPage;

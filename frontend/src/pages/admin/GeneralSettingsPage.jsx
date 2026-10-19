import useSchoolGeneralSettings from '../../hooks/useSchoolGeneralSettings';
import GeneralSettingsHeader from '../../components/admin/settings/GeneralSettingsHeader';
import SchoolBasicInfoCard from '../../components/admin/settings/SchoolBasicInfoCard';
import SchoolContactAndPdfCard from '../../components/admin/settings/SchoolContactAndPdfCard';
import SchoolLogoUploadCard from '../../components/admin/settings/SchoolLogoUploadCard';
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
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-16 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-8 space-y-3">
            <div className="h-52 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
            <div className="h-52 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
          </div>
          <div className="xl:col-span-4 space-y-3">
            <div className="h-44 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
            <div className="h-64 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <GeneralSettingsHeader
        settings={settings}
        isDirty={isDirty}
        saving={saving}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 space-y-3">
          <SchoolBasicInfoCard
            settings={settings}
            onChange={handleChange}
          />
          <SchoolContactAndPdfCard
            settings={settings}
            onChange={handleChange}
          />
        </div>

        <div className="xl:col-span-4 space-y-3">
          <SchoolLogoUploadCard
            logoUrl={settings.logo_url}
            onLogoChange={(val) => handleChange('logo_url', val)}
          />
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

import { useState } from 'react';
import { Building2, Phone, PenTool, FileText } from 'lucide-react';
import useSchoolGeneralSettings from '../../hooks/useSchoolGeneralSettings';
import GeneralSettingsHeader from '../../components/admin/settings/GeneralSettingsHeader';
import SchoolSmartPresetsBar from '../../components/admin/settings/SchoolSmartPresetsBar';
import SchoolBasicInfoCard from '../../components/admin/settings/SchoolBasicInfoCard';
import SchoolContactAndPdfCard from '../../components/admin/settings/SchoolContactAndPdfCard';
import SchoolBrandAssetsStudioCard from '../../components/admin/settings/SchoolBrandAssetsStudioCard';
import LiveDocumentHeaderPreview from '../../components/admin/settings/LiveDocumentHeaderPreview';
import SettingsFeedbackModal from '../../components/admin/settings/SettingsFeedbackModal';
import MobileTabStepper from '../../components/common/MobileTabStepper';

const SETTINGS_STEPS = [
  { id: 'identity', label: 'Identity & Board', icon: Building2 },
  { id: 'contact', label: 'Contact & Motto', icon: Phone },
  { id: 'brand', label: 'Brand & Signatures', icon: PenTool },
  { id: 'preview', label: 'Live Preview', icon: FileText }
];

const GeneralSettingsPage = () => {
  const [activeStep, setActiveStep] = useState('identity');
  const {
    settings,
    loading,
    saving,
    feedback,
    isDirty,
    handleChange,
    handleBatchChange,
    syncSignaturesFromStudio,
    handleSave,
    closeFeedback
  } = useSchoolGeneralSettings();

  const handleApplyPreset = (presetData) => {
    handleBatchChange(presetData);
  };

  const handleAutoFormatAll = () => {
    const updates = {};
    if (settings.contact_number) {
      const digits = settings.contact_number.replace(/\D/g, '');
      if (digits.startsWith('92')) {
        const rest = digits.slice(2);
        updates.contact_number = rest.length <= 3 ? `+92 ${rest}` : `+92 ${rest.slice(0, 3)} ${rest.slice(3, 10)}`;
      } else if (digits.startsWith('03')) {
        const rest = digits.slice(1);
        updates.contact_number = rest.length <= 3 ? `+92 ${rest}` : `+92 ${rest.slice(0, 3)} ${rest.slice(3, 10)}`;
      }
    }
    if (settings.website) {
      const clean = settings.website.trim();
      if (clean && !clean.startsWith('http://') && !clean.startsWith('https://')) {
        updates.website = `https://${clean}`;
      }
    }
    if (settings.email) {
      updates.email = settings.email.trim().toLowerCase();
    }
    if (settings.name && !settings.code) {
      const words = settings.name.trim().split(/\s+/).filter(Boolean);
      const initials = words.map((w) => w[0]).join('').toUpperCase().slice(0, 5);
      updates.code = `${initials || 'SCH'}-01`;
    }
    if (Object.keys(updates).length > 0) {
      handleBatchChange(updates);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-16 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
        <div className="h-28 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7 space-y-4">
            <div className="h-60 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
            <div className="h-60 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
            <div className="h-44 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
          </div>
          <div className="xl:col-span-5 space-y-4">
            <div className="h-96 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pb-12">
      <GeneralSettingsHeader
        settings={settings}
        isDirty={isDirty}
        saving={saving}
        onSave={handleSave}
      />

      <div className="xl:hidden space-y-4">
        <MobileTabStepper
          tabs={SETTINGS_STEPS}
          activeTab={activeStep}
          onChange={setActiveStep}
          mobileBreakpoint="xl"
          scrollToTop={true}
        />

        {activeStep === 'identity' && (
          <div className="space-y-4">
            <SchoolSmartPresetsBar
              settings={settings}
              onApplyPreset={handleApplyPreset}
              onAutoFormatAll={handleAutoFormatAll}
            />
            <SchoolBasicInfoCard
              settings={settings}
              onChange={handleChange}
            />
          </div>
        )}

        {activeStep === 'contact' && (
          <SchoolContactAndPdfCard
            settings={settings}
            onChange={handleChange}
          />
        )}

        {activeStep === 'brand' && (
          <SchoolBrandAssetsStudioCard
            logoUrl={settings.logo_url}
            principalSignatureUrl={settings.principal_signature_url}
            teacherSignatureUrl={settings.teacher_signature_url}
            onAssetChange={handleChange}
            onSyncSignatures={syncSignaturesFromStudio}
          />
        )}

        {activeStep === 'preview' && (
          <LiveDocumentHeaderPreview settings={settings} />
        )}
      </div>

      <div className="hidden xl:block space-y-4">
        <SchoolSmartPresetsBar
          settings={settings}
          onApplyPreset={handleApplyPreset}
          onAutoFormatAll={handleAutoFormatAll}
        />

        <div className="grid grid-cols-12 gap-5 items-start">
          <div className="col-span-7 space-y-4">
            <SchoolBasicInfoCard
              settings={settings}
              onChange={handleChange}
            />
            <SchoolContactAndPdfCard
              settings={settings}
              onChange={handleChange}
            />
            <SchoolBrandAssetsStudioCard
              logoUrl={settings.logo_url}
              principalSignatureUrl={settings.principal_signature_url}
              teacherSignatureUrl={settings.teacher_signature_url}
              onAssetChange={handleChange}
              onSyncSignatures={syncSignaturesFromStudio}
            />
          </div>

          <div className="col-span-5 space-y-4 sticky top-6">
            <LiveDocumentHeaderPreview settings={settings} />
          </div>
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

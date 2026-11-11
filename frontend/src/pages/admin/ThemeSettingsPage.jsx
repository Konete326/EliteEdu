import { useState } from 'react';
import { Sun, Paintbrush, Languages, Eye } from 'lucide-react';
import ThemeStudioHeader from '../../components/admin/theme/ThemeStudioHeader';
import AppearanceModeCard from '../../components/admin/theme/AppearanceModeCard';
import ThemePlacementCard from '../../components/admin/theme/ThemePlacementCard';
import HeaderBgCard from '../../components/admin/theme/HeaderBgCard';
import ActiveColorCard from '../../components/admin/theme/ActiveColorCard';
import LanguageCard from '../../components/admin/theme/LanguageCard';
import ThemeLivePreviewCard from '../../components/admin/theme/ThemeLivePreviewCard';
import MobileTabStepper from '../../components/common/MobileTabStepper';

const THEME_TABS = [
  { id: 'appearance', label: 'Mode & Layout', icon: Sun },
  { id: 'colors', label: 'Colors & Header', icon: Paintbrush },
  { id: 'language', label: 'Portal Language', icon: Languages },
  { id: 'preview', label: 'Live Preview', icon: Eye }
];

const ThemeSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="w-full space-y-3.5 pb-10">
      <ThemeStudioHeader />

      <div className="xl:hidden space-y-3.5">
        <MobileTabStepper
          tabs={THEME_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          mobileBreakpoint="xl"
          scrollToTop={true}
        />

        {activeTab === 'appearance' && (
          <div className="space-y-3.5">
            <AppearanceModeCard />
            <ThemePlacementCard />
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-3.5">
            <HeaderBgCard />
            <ActiveColorCard />
          </div>
        )}

        {activeTab === 'language' && (
          <LanguageCard />
        )}

        {activeTab === 'preview' && (
          <ThemeLivePreviewCard />
        )}
      </div>

      <div className="hidden xl:flex items-start gap-3.5">
        <div className="flex-1 w-full min-w-0 grid grid-cols-2 gap-3.5">
          <div className="space-y-3.5">
            <AppearanceModeCard />
            <ThemePlacementCard />
          </div>
          <div className="space-y-3.5">
            <HeaderBgCard />
            <ActiveColorCard />
          </div>
          <div className="col-span-2">
            <LanguageCard />
          </div>
        </div>

        <div className="w-[300px] 2xl:w-[320px] shrink-0 sticky top-6">
          <ThemeLivePreviewCard />
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsPage;

import { useState } from 'react';
import ThemeStudioHeader from '../../components/admin/theme/ThemeStudioHeader';
import ThemeSectionTabs from '../../components/admin/theme/ThemeSectionTabs';
import AppearanceModeCard from '../../components/admin/theme/AppearanceModeCard';
import ThemePlacementCard from '../../components/admin/theme/ThemePlacementCard';
import SidebarBgCard from '../../components/admin/theme/SidebarBgCard';
import HeaderBgCard from '../../components/admin/theme/HeaderBgCard';
import ActiveColorCard from '../../components/admin/theme/ActiveColorCard';
import LanguageCard from '../../components/admin/theme/LanguageCard';
import ThemeLivePreviewCard from '../../components/admin/theme/ThemeLivePreviewCard';

const ThemeSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="w-full space-y-5 pb-12">
      <ThemeStudioHeader />
      <ThemeSectionTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'all' && (
        <div className="flex flex-col 2xl:flex-row items-start gap-6">
          <div className="flex-1 w-full min-w-0 grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="space-y-5">
              <AppearanceModeCard />
              <ThemePlacementCard />
              <LanguageCard />
            </div>
            <div className="space-y-5">
              <ActiveColorCard />
              <HeaderBgCard />
              <SidebarBgCard />
            </div>
          </div>
          <div className="w-full 2xl:w-84 shrink-0">
            <ThemeLivePreviewCard />
          </div>
        </div>
      )}

      {activeTab === 'interface' && (
        <div className="flex flex-col xl:flex-row items-start gap-6">
          <div className="flex-1 w-full space-y-5 min-w-0">
            <AppearanceModeCard />
            <ThemePlacementCard />
            <LanguageCard />
          </div>
          <div className="w-full xl:w-84 shrink-0">
            <ThemeLivePreviewCard />
          </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="flex flex-col xl:flex-row items-start gap-6">
          <div className="flex-1 w-full space-y-5 min-w-0">
            <ActiveColorCard />
            <HeaderBgCard />
            <SidebarBgCard />
          </div>
          <div className="w-full xl:w-84 shrink-0">
            <ThemeLivePreviewCard />
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="max-w-xl mx-auto w-full pt-2">
          <ThemeLivePreviewCard />
        </div>
      )}
    </div>
  );
};

export default ThemeSettingsPage;

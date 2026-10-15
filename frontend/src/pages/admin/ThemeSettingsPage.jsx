import ThemeStudioHeader from '../../components/admin/theme/ThemeStudioHeader';
import AppearanceModeCard from '../../components/admin/theme/AppearanceModeCard';
import ThemePlacementCard from '../../components/admin/theme/ThemePlacementCard';
import SidebarBgCard from '../../components/admin/theme/SidebarBgCard';
import HeaderBgCard from '../../components/admin/theme/HeaderBgCard';
import ActiveColorCard from '../../components/admin/theme/ActiveColorCard';
import LanguageCard from '../../components/admin/theme/LanguageCard';
import ThemeLivePreviewCard from '../../components/admin/theme/ThemeLivePreviewCard';

const ThemeSettingsPage = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <ThemeStudioHeader />

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex-1 w-full space-y-5 min-w-0">
          <AppearanceModeCard />
          <ThemePlacementCard />
          <SidebarBgCard />
          <HeaderBgCard />
          <ActiveColorCard />
          <LanguageCard />
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <ThemeLivePreviewCard />
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsPage;

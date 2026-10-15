import ThemeStudioHeader from '../../components/admin/theme/ThemeStudioHeader';
import AppearanceModeCard from '../../components/admin/theme/AppearanceModeCard';
import ThemePlacementCard from '../../components/admin/theme/ThemePlacementCard';
import HeaderBgCard from '../../components/admin/theme/HeaderBgCard';
import ActiveColorCard from '../../components/admin/theme/ActiveColorCard';
import LanguageCard from '../../components/admin/theme/LanguageCard';
import ThemeLivePreviewCard from '../../components/admin/theme/ThemeLivePreviewCard';

const ThemeSettingsPage = () => {
  return (
    <div className="w-full space-y-6 pb-12">
      <ThemeStudioHeader />

      <div className="flex flex-col xl:flex-row items-start gap-6">
        <div className="flex-1 w-full min-w-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AppearanceModeCard />
            <ThemePlacementCard />
            <LanguageCard />
          </div>
          <div className="space-y-6">
            <ActiveColorCard />
            <HeaderBgCard />
          </div>
        </div>

        <div className="w-full xl:w-[360px] shrink-0 xl:sticky xl:top-4">
          <ThemeLivePreviewCard />
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsPage;

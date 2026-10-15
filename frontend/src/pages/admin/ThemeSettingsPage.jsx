import ThemeStudioHeader from '../../components/admin/theme/ThemeStudioHeader';
import AppearanceModeCard from '../../components/admin/theme/AppearanceModeCard';
import ThemePlacementCard from '../../components/admin/theme/ThemePlacementCard';
import HeaderBgCard from '../../components/admin/theme/HeaderBgCard';
import ActiveColorCard from '../../components/admin/theme/ActiveColorCard';
import LanguageCard from '../../components/admin/theme/LanguageCard';
import ThemeLivePreviewCard from '../../components/admin/theme/ThemeLivePreviewCard';

const ThemeSettingsPage = () => {
  return (
    <div className="w-full space-y-3.5">
      <ThemeStudioHeader />

      <div className="flex flex-col xl:flex-row items-start gap-3.5">
        <div className="flex-1 w-full min-w-0 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="space-y-3.5">
            <AppearanceModeCard />
            <ThemePlacementCard />
          </div>
          <div className="space-y-3.5">
            <HeaderBgCard />
            <ActiveColorCard />
          </div>
          <div className="md:col-span-2">
            <LanguageCard />
          </div>
        </div>

        <div className="w-full xl:w-[300px] 2xl:w-[320px] shrink-0">
          <ThemeLivePreviewCard />
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsPage;

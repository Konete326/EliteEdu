import Template1CurveBlue from './templates/Template1CurveBlue';
import Template2GoldBlueFrame from './templates/Template2GoldBlueFrame';
import Template3WaveRibbon from './templates/Template3WaveRibbon';
import Template4ApwaClassic from './templates/Template4ApwaClassic';
import UniversalIdCardBack from './UniversalIdCardBack';

const renderFrontCard = (template, props) => {
  if (template === 'template_2_gold_blue') {
    return <Template2GoldBlueFrame {...props} />;
  }
  if (template === 'template_3_wave_ribbon') {
    return <Template3WaveRibbon {...props} />;
  }
  if (template === 'template_4_apwa_classic') {
    return <Template4ApwaClassic {...props} />;
  }
  return <Template1CurveBlue {...props} />;
};

const UniversalIdCard = ({
  holder,
  holderType = 'teacher',
  template = 'template_1_curve_blue',
  orientation = 'vertical',
  accentColor = '#003B73',
  sideMode = 'front',
  institution = {},
  isSelected = false,
  onToggleSelect,
}) => {
  const commonProps = {
    holder,
    holderType,
    orientation,
    accentColor,
    institution,
    isSelected,
    onToggleSelect,
    sideMode
  };

  const renderContent = () => {
    if (sideMode === 'back') {
      return <UniversalIdCardBack {...commonProps} />;
    }

    if (sideMode === 'both') {
      return (
        <div className={`flex flex-col ${orientation === 'horizontal' ? 'min-[840px]:flex-row' : 'min-[540px]:flex-row'} gap-3 items-center justify-center print:flex-row print:gap-3`}>
          {renderFrontCard(template, { ...commonProps, sideMode: 'both' })}
          <UniversalIdCardBack {...commonProps} />
        </div>
      );
    }

    return renderFrontCard(template, { ...commonProps, sideMode: 'front' });
  };

  return (
    <div
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      className={`print:break-inside-avoid [print-color-adjust:exact] [-webkit-print-color-adjust:exact] rounded-2xl transition-all duration-200 ${
        isSelected && sideMode !== 'both' ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface dark:ring-offset-[#0c0c0f] shadow-lg print:ring-0 print:ring-offset-0' : ''
      }`}
    >
      {renderContent()}
    </div>
  );
};

export default UniversalIdCard;
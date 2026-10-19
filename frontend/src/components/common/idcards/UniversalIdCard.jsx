import Template1CurveBlue from './templates/Template1CurveBlue';
import Template2GoldBlueFrame from './templates/Template2GoldBlueFrame';
import Template3WaveRibbon from './templates/Template3WaveRibbon';
import Template4ApwaClassic from './templates/Template4ApwaClassic';

const UniversalIdCard = ({
  holder,
  holderType = 'student',
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
  };

  if (template === 'template_2_gold_blue') {
    return <Template2GoldBlueFrame {...commonProps} />;
  }

  if (template === 'template_3_wave_ribbon') {
    return <Template3WaveRibbon {...commonProps} sideMode={sideMode} />;
  }

  if (template === 'template_4_apwa_classic') {
    return <Template4ApwaClassic {...commonProps} />;
  }

  return <Template1CurveBlue {...commonProps} />;
};

export default UniversalIdCard;

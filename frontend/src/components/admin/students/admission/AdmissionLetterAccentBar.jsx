const AdmissionLetterAccentBar = ({ template }) => {
  const primaryColor = template?.stripe_primary_color || '#581c87';
  const accentColor = template?.stripe_accent_color || '#0f766e';

  return (
    <div
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      className="absolute left-4 sm:left-6 top-8 bottom-8 flex gap-1.5 pointer-events-none select-none print:left-2 print:top-4 print:bottom-4"
    >
      <div
        style={{ backgroundColor: primaryColor }}
        className="w-1.5 h-full rounded-full"
      />
      <div
        style={{ backgroundColor: accentColor }}
        className="w-1.5 h-full rounded-full"
      />
    </div>
  );
};

export default AdmissionLetterAccentBar;

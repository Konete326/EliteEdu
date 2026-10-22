const AdmissionLetterAccentBar = () => {
  return (
    <div
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      className="absolute left-4 sm:left-6 top-8 bottom-8 flex gap-1.5 pointer-events-none select-none print:left-2 print:top-4 print:bottom-4"
    >
      <div className="w-1.5 h-full bg-[#581c87] rounded-full print:bg-[#581c87]" />
      <div className="w-1.5 h-full bg-[#0f766e] rounded-full print:bg-[#0f766e]" />
    </div>
  );
};

export default AdmissionLetterAccentBar;

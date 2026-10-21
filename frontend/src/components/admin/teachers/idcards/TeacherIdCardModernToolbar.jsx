import {
  Printer,
  Download,
  CheckSquare,
  Square,
  Search,
  X,
  CreditCard,
  Building2,
  UserCheck,
  Layers,
  Palette,
  Maximize2,
  Archive
} from 'lucide-react';
import SearchableSelect from '../../../common/SearchableSelect';

const TEMPLATES = [
  { id: 'template_1_curve_blue', label: 'Executive Curve' },
  { id: 'template_2_gold_blue', label: 'Royal Blue & Gold' },
  { id: 'template_3_wave_ribbon', label: 'Wave Ribbon' },
  { id: 'template_4_apwa_classic', label: 'APWA Classic' }
];

const PRESET_COLORS = [
  { hex: '#003B73', label: 'Navy Blue' },
  { hex: '#0F766E', label: 'Emerald' },
  { hex: '#1E3A8A', label: 'Royal Blue' },
  { hex: '#831843', label: 'Burgundy' },
  { hex: '#1E293B', label: 'Slate' },
  { hex: '#7C3AED', label: 'Purple' },
  { hex: '#D97706', label: 'Amber' }
];

const TeacherIdCardModernToolbar = ({
  template = 'template_1_curve_blue',
  onTemplateChange,
  orientation = 'vertical',
  onOrientationChange,
  accentColor = '#003B73',
  onAccentColorChange,
  sideMode = 'front',
  onSideModeChange,
  searchQuery = '',
  onSearchChange,
  campuses = [],
  selectedCampus = '',
  onCampusChange,
  teachers = [],
  selectedTeacherId = 'all',
  onSelectSpecificTeacher,
  selectedCount = 0,
  totalCount = 0,
  onToggleSelectAll,
  onExportPdf,
  isExporting = false,
  onExportZip,
  isExportingZip = false
}) => {
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;

  const campusOptions = [
    { value: '', label: 'All Campuses' },
    ...campuses.map((c) => ({ value: c._id, label: c.name }))
  ];

  const teacherOptions = [
    { value: 'all', label: 'All Faculty (Bulk Print)' },
    ...teachers.map((t) => ({
      value: t._id,
      label: `${t.name} (${t.designation || 'Faculty'})`,
      subtext: `ID: ${t.employee_code || t.personal_id || '—'} • ${t.campus_id?.name || 'Main Campus'}`
    }))
  ];

  return (
    <div className="print:hidden space-y-4 bg-surface dark:bg-[#111111] border border-line dark:border-white/10 p-4 sm:p-5 rounded-2xl shadow-xs">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-ink dark:text-white tracking-tight">
              Faculty Service ID Card Studio
            </h2>
            <p className="text-xs font-semibold text-ink-muted">
              Configure CR80 high-res printable PVC cards for school personnel
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] hover:bg-surface-secondary text-ink dark:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-primary" />
            ) : (
              <Square className="w-4 h-4 text-ink-muted" />
            )}
            <span>
              {selectedCount} of {totalCount} Selected
            </span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#181818] hover:bg-surface-secondary text-ink dark:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-primary" />
            <span>Print Sheet</span>
          </button>

          {onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExporting || selectedCount === 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm shadow-primary/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>
          )}

          {onExportZip && (
            <button
              type="button"
              onClick={onExportZip}
              disabled={isExportingZip || selectedCount === 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-dark text-xs font-bold transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
              title="Download ZIP package with individual printable cards + manifest for vendor"
            >
              <Archive className="w-4 h-4" />
              <span>{isExportingZip ? 'Packing ZIP...' : 'Export Vendor ZIP'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-center">
        <div>
          <label className="block text-[11px] font-bold text-ink dark:text-white mb-1">
            Pick Specific Faculty Member
          </label>
          <SearchableSelect
            options={teacherOptions}
            value={selectedTeacherId}
            onChange={onSelectSpecificTeacher}
            icon={UserCheck}
            size="sm"
            placeholder="Search & choose teacher..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink dark:text-white mb-1">
            Search Directory
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by name, ID, phone..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs rounded-xl bg-surface-secondary/50 dark:bg-[#181818] border border-line dark:border-white/10 text-ink dark:text-white outline-none focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink dark:text-white mb-1">
            Filter by Campus
          </label>
          <SearchableSelect
            options={campusOptions}
            value={selectedCampus}
            onChange={onCampusChange}
            icon={Building2}
            size="sm"
            placeholder="All Campuses"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink dark:text-white mb-1">
            Color Accent Theme
          </label>
          <div className="flex items-center gap-1.5 h-9 px-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/30 dark:bg-[#181818]">
            <Palette className="w-3.5 h-3.5 text-ink-muted shrink-0 mr-1" />
            {PRESET_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={c.label}
                onClick={() => onAccentColorChange(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                  accentColor === c.hex
                    ? 'scale-125 ring-2 ring-primary ring-offset-1 dark:ring-offset-black'
                    : 'opacity-85 hover:opacity-100 hover:scale-110'
                }`}
              />
            ))}
            <label
              className="relative flex items-center justify-center w-5 h-5 rounded-full cursor-pointer overflow-hidden border border-line ml-auto hover:scale-110 transition-transform"
              title="Custom Hex Picker"
            >
              <input
                type="color"
                value={accentColor || '#003B73'}
                onChange={(e) => onAccentColorChange(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <span className="w-full h-full" style={{ backgroundColor: accentColor }} />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line dark:border-white/10 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted mr-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Template:
          </span>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTemplateChange(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                template === t.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-secondary dark:bg-[#181818] text-ink-muted hover:text-ink dark:hover:text-white border border-line dark:border-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center bg-surface-secondary dark:bg-[#181818] p-1 rounded-xl border border-line dark:border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onOrientationChange('vertical')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                orientation === 'vertical'
                  ? 'bg-surface dark:bg-[#222222] text-ink dark:text-white font-bold shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Vertical (CR80)
            </button>
            <button
              type="button"
              onClick={() => onOrientationChange('horizontal')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                orientation === 'horizontal'
                  ? 'bg-surface dark:bg-[#222222] text-ink dark:text-white font-bold shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Horizontal (CR80)
            </button>
          </div>

          <div className="flex items-center bg-surface-secondary dark:bg-[#181818] p-1 rounded-xl border border-line dark:border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onSideModeChange('front')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                sideMode === 'front'
                  ? 'bg-surface dark:bg-[#222222] text-ink dark:text-white font-bold shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Front Only (Full)
            </button>
            <button
              type="button"
              onClick={() => onSideModeChange('both')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                sideMode === 'both'
                  ? 'bg-surface dark:bg-[#222222] text-ink dark:text-white font-bold shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Both Sides (Front &amp; Back)
            </button>
            <button
              type="button"
              onClick={() => onSideModeChange('back')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                sideMode === 'back'
                  ? 'bg-surface dark:bg-[#222222] text-ink dark:text-white font-bold shadow-2xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Back Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherIdCardModernToolbar;
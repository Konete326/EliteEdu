export const DEFAULT_THEME = {
  mode: 'light',
  placement: 'ltr',
  sidebarBg: 'white',
  headerBg: 'white',
  activeColor: '#0d9488',
  language: 'English'
};

export const ACTIVE_COLOR_SWATCHES = [
  { id: 'coral', name: 'Coral Red', hex: '#e15b4b', hover: '#cc4839', soft: '#fcebe9' },
  { id: 'pink', name: 'Rose Pink', hex: '#db2777', hover: '#be185d', soft: '#fdf2f8' },
  { id: 'teal', name: 'Deep Teal', hex: '#0d9488', hover: '#0f766e', soft: '#ccfbf1' },
  { id: 'emerald', name: 'Emerald Green', hex: '#10b981', hover: '#059669', soft: '#d1fae5' },
  { id: 'sky', name: 'Ocean Blue', hex: '#2563eb', hover: '#1d4ed8', soft: '#eff6ff' },
  { id: 'amber', name: 'Amber Gold', hex: '#f59e0b', hover: '#d97706', soft: '#fef3c7' },
  { id: 'orange', name: 'Warm Orange', hex: '#ea580c', hover: '#c2410c', soft: '#ffedd5' },
  { id: 'slate', name: 'Light Slate', hex: '#6366f1', hover: '#4f46e5', soft: '#eef2ff' },
  { id: 'indigo', name: 'Royal Indigo', hex: '#4f46e5', hover: '#4338ca', soft: '#e0e7ff' },
  { id: 'magenta', name: 'Magenta Pink', hex: '#c026d3', hover: '#a21caf', soft: '#fae8ff' },
  { id: 'crimson', name: 'Crimson Red', hex: '#dc2626', hover: '#b91c1c', soft: '#fee2e2' },
  { id: 'forest', name: 'Emerald Forest', hex: '#15803d', hover: '#166534', soft: '#dcfce7' },
  { id: 'purple', name: 'Imperial Purple', hex: '#7e22ce', hover: '#6b21a8', soft: '#f3e8ff' }
];

export const HEADER_BG_PRESETS = [
  {
    id: 'dark',
    label: 'Dark',
    previewBg: '#0c0c0f',
    headerClass: 'bg-surface-dark text-white border-b border-line-dark',
    sidebarClass: 'bg-surface-dark text-white border-r border-line-dark'
  },
  {
    id: 'red',
    label: 'Red',
    previewBg: '#dc2626',
    headerClass: 'bg-[#dc2626] text-white border-b border-red-700/50',
    sidebarClass: 'bg-[#dc2626] text-white border-r border-red-700/50'
  },
  {
    id: 'dark-green',
    label: 'Dark Green',
    previewBg: '#064e3b',
    headerClass: 'bg-[#064e3b] text-white border-b border-emerald-900/60',
    sidebarClass: 'bg-[#064e3b] text-white border-r border-emerald-900/60'
  },
  {
    id: 'green',
    label: 'Green',
    previewBg: '#10b981',
    headerClass: 'bg-[#10b981] text-white border-b border-emerald-600/50',
    sidebarClass: 'bg-[#10b981] text-white border-r border-emerald-600/50'
  },
  {
    id: 'blue',
    label: 'Blue',
    previewBg: '#2563eb',
    headerClass: 'bg-[#2563eb] text-white border-b border-blue-600/50',
    sidebarClass: 'bg-[#2563eb] text-white border-r border-blue-600/50'
  },
  {
    id: 'white',
    label: 'White',
    previewBg: '#ffffff',
    headerClass: 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark border-b border-line dark:border-line-dark',
    sidebarClass: 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark border-r border-line dark:border-line-dark'
  }
];

export const getActiveColorMeta = (hex) => {
  const found = ACTIVE_COLOR_SWATCHES.find((s) => s.hex.toLowerCase() === hex?.toLowerCase());
  if (found) return found;
  return {
    id: 'custom',
    name: 'Custom',
    hex: hex || '#0d9488',
    hover: hex || '#0f766e',
    soft: 'rgba(13, 148, 136, 0.15)'
  };
};

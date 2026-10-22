export const STYLE_OPTIONS = [
  {
    id: 'academic_gold_hatch',
    label: '1. Classic Gold & Hatch',
    description: 'Classic Gothic Gold Title, Diagonal Hatch Frame & 3D Star Seal',
    color: '#b59449'
  },
  {
    id: 'floral_corner_filigree',
    label: '2. Golden Corner Filigree',
    description: 'Crisp White Canvas with 4 Ornate Golden Filigree Corner Flourishes',
    color: '#f59e0b'
  },
  {
    id: 'guilloche_rosette_burgundy',
    label: '3. Burgundy Guilloche & Medal',
    description: 'Burgundy Security Frame, Corner Rosettes & Embossed Gold Laurel Medal',
    color: '#8c3b32'
  },
  {
    id: 'navy_ribbon_halftone',
    label: '4. Navy Ribbon & Champion',
    description: 'Navy Swallowtail Header, Left Ribbon with Champion 3-Star Badge',
    color: '#051937'
  },
  {
    id: 'classic_slate_multiborder',
    label: '5. Slate Multi-Border Completion',
    description: 'Dual Inset White Borders, Slate Blue Backdrop & Classic Underline Signatures',
    color: '#618597'
  }
];

export const normalizeDesignStyle = (style) => {
  switch (style) {
    case 'academic_gold_hatch':
    case 'royal_gold':
    case 'classic_academic':
      return 'academic_gold_hatch';
    case 'floral_corner_filigree':
    case 'emerald_modern':
    case 'minimal_corporate':
      return 'floral_corner_filigree';
    case 'guilloche_rosette_burgundy':
      return 'guilloche_rosette_burgundy';
    case 'navy_ribbon_halftone':
    case 'ribbon_prestigious':
      return 'navy_ribbon_halftone';
    case 'classic_slate_multiborder':
    case 'pm_certificate':
    case 'slate_completion':
      return 'classic_slate_multiborder';
    default:
      return 'academic_gold_hatch';
  }
};

import React from 'react';

export const getDesignClasses = (style = 'royal_gold', accentColor = '#0d9488') => {
  switch (style) {
    case 'emerald_modern':
      return {
        outerBorder: 'border-4 border-emerald-700 bg-white dark:bg-slate-900',
        innerBorder: 'border border-emerald-600/40 m-2 p-5',
        headerClass: 'text-emerald-800 dark:text-emerald-400 font-serif',
        badgeClass: 'bg-emerald-700 text-white',
        highlightColor: accentColor || '#059669'
      };
    case 'classic_academic':
      return {
        outerBorder: 'border-8 border-slate-900 bg-amber-50/20 dark:bg-slate-950',
        innerBorder: 'border-2 border-dashed border-slate-700 m-2 p-5',
        headerClass: 'text-slate-900 dark:text-slate-200 font-serif',
        badgeClass: 'bg-slate-900 text-amber-200',
        highlightColor: accentColor || '#334155'
      };
    case 'minimal_corporate':
      return {
        outerBorder: 'border-2 border-slate-800 bg-white dark:bg-slate-900',
        innerBorder: 'border-l-4 border-slate-800 m-2 p-6',
        headerClass: 'text-slate-900 dark:text-white font-sans font-black',
        badgeClass: 'bg-slate-800 text-white',
        highlightColor: accentColor || '#0f172a'
      };
    case 'ribbon_prestigious':
      return {
        outerBorder: 'border-4 border-purple-800 bg-purple-50/15 dark:bg-slate-900',
        innerBorder: 'border-2 border-purple-600/40 m-2 p-5',
        headerClass: 'text-purple-900 dark:text-purple-300 font-serif',
        badgeClass: 'bg-gradient-to-r from-purple-700 to-pink-600 text-white',
        highlightColor: accentColor || '#7c3aed'
      };
    case 'royal_gold':
    default:
      return {
        outerBorder: 'border-4 border-amber-600 bg-amber-50/30 dark:bg-slate-900',
        innerBorder: 'border-2 border-double border-amber-500/60 m-2 p-5',
        headerClass: 'text-amber-900 dark:text-amber-400 font-serif',
        badgeClass: 'bg-amber-600 text-white',
        highlightColor: accentColor || '#b45309'
      };
  }
};

export const STYLE_OPTIONS = [
  { id: 'royal_gold', label: 'Royal Gold', color: '#b45309' },
  { id: 'emerald_modern', label: 'Emerald Executive', color: '#059669' },
  { id: 'classic_academic', label: 'Classic Crest', color: '#334155' },
  { id: 'minimal_corporate', label: 'Corporate Minimal', color: '#0f172a' },
  { id: 'ribbon_prestigious', label: 'Ribbon Prestige', color: '#7c3aed' }
];

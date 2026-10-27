let cachedNationality = null;

const COUNTRY_TO_DEMONYM = {
  PK: 'Pakistani',
  Pakistan: 'Pakistani',
  AE: 'Emirati',
  'United Arab Emirates': 'Emirati',
  SA: 'Saudi',
  'Saudi Arabia': 'Saudi',
  GB: 'British',
  'United Kingdom': 'British',
  US: 'American',
  'United States': 'American',
  CA: 'Canadian',
  Canada: 'Canadian',
  AU: 'Australian',
  Australia: 'Australian',
  TR: 'Turkish',
  Turkey: 'Turkish',
  QA: 'Qatari',
  Qatar: 'Qatari',
  OM: 'Omani',
  Oman: 'Omani',
  KW: 'Kuwaiti',
  Kuwait: 'Kuwaiti',
  BH: 'Bahraini',
  Bahrain: 'Bahraini',
  IN: 'Indian',
  India: 'Indian',
  BD: 'Bangladeshi',
  Bangladesh: 'Bangladeshi'
};

export const getNationalityFromIp = async () => {
  if (cachedNationality) return cachedNationality;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://api.country.is', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data?.country) {
        const countryCode = String(data.country).toUpperCase();
        cachedNationality = COUNTRY_TO_DEMONYM[countryCode] || countryCode;
        return cachedNationality;
      }
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const c = data.country_code || data.country_name;
      if (c) {
        cachedNationality = COUNTRY_TO_DEMONYM[c] || data.country_name || 'Pakistani';
        return cachedNationality;
      }
    }
  } catch {}

  const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || '' : '';
  if (tz.includes('Karachi') || tz.includes('Pakistan')) cachedNationality = 'Pakistani';
  else if (tz.includes('Dubai')) cachedNationality = 'Emirati';
  else if (tz.includes('Riyadh')) cachedNationality = 'Saudi';
  else if (tz.includes('London')) cachedNationality = 'British';
  else if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles')) cachedNationality = 'American';
  else cachedNationality = 'Pakistani';

  return cachedNationality;
};

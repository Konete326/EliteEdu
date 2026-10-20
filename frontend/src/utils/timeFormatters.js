export const formatStandardTime = (date = new Date(), use12Hour = true) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const hours24 = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (!use12Hour) {
    const hours = String(hours24).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const hoursStr = String(hours12).padStart(2, '0');
  return `${hoursStr}:${minutes} ${ampm}`;
};

export const formatStandardTime24 = (date = new Date()) => {
  return formatStandardTime(date, false);
};

export const normalizeTimeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const ampm = match12[3] ? match12[3].toUpperCase() : (hours >= 12 ? 'PM' : 'AM');
    if (hours > 12) hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }
  return trimmed;
};

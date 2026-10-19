const getGradeRank = (name = '') => {
  const n = (name || '').trim().toLowerCase();
  if (n.includes('playgroup') || n.includes('play group') || n === 'pg' || n.includes('daycare')) return 0;
  if (n.includes('pre-nursery')) return 1;
  if (n.includes('nursery')) return 2;
  if (n.includes('lkg') || n.includes('lower kg')) return 3;
  if (n.includes('ukg') || n.includes('upper kg')) return 4;
  if (n.includes('kg') || n.includes('kindergarten') || n.includes('prep') || n.includes('reception')) return 5;

  const match = n.match(/\b(?:class|grade|year|level)?\s*(\d{1,2})\b/i);
  if (match) return 10 + parseInt(match[1], 10);
  if (n.includes('o-level') || n.includes('o level')) return 30;
  if (n.includes('a-level') || n.includes('a level')) return 40;
  return 100;
};

const sortGradesInSequence = (grades = []) => {
  return [...grades].sort((a, b) => {
    const orderA = typeof a.order === 'number' && a.order > 0 ? a.order : null;
    const orderB = typeof b.order === 'number' && b.order > 0 ? b.order : null;
    if (orderA !== null && orderB !== null) return orderA - orderB;
    if (orderA !== null) return -1;
    if (orderB !== null) return 1;
    const rankA = getGradeRank(a.name);
    const rankB = getGradeRank(b.name);
    if (rankA !== rankB) return rankA - rankB;
    return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' });
  });
};

module.exports = { getGradeRank, sortGradesInSequence };

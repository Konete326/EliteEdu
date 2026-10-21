const TimetableSlot = require('../models/TimetableSlot');

const parseTimeToMinutes = (str) => {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() : null;
  if (meridiem === 'PM' && h < 12) h += 12;
  if (meridiem === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

const isTimeOverlap = (startA, endA, startB, endB) => {
  const sA = parseTimeToMinutes(startA);
  const eA = parseTimeToMinutes(endA);
  const sB = parseTimeToMinutes(startB);
  const eB = parseTimeToMinutes(endB);
  if (sA === null || eA === null || sB === null || eB === null) return false;
  return sA < eB && eA > sB;
};

const checkTimetableConflict = async ({
  school_id,
  id,
  day_of_week,
  period_no,
  start_time,
  end_time,
  teacher_id,
  room_no,
  grade_id,
  section
}) => {
  const teacherSlots = await TimetableSlot.find({
    school_id,
    day_of_week,
    teacher_id,
    is_break: false,
    ...(id ? { _id: { $ne: id } } : {}),
    $or: [{ grade_id: { $ne: grade_id } }, { section: { $ne: section } }]
  }).populate('teacher_id', 'name').populate('grade_id', 'name').populate('subject_id', 'name').lean();

  for (const slot of teacherSlots) {
    const periodMatch = Number(slot.period_no) === Number(period_no);
    const timeOverlap = (start_time && end_time && slot.start_time && slot.end_time)
      ? isTimeOverlap(start_time, end_time, slot.start_time, slot.end_time)
      : false;

    if (periodMatch || timeOverlap) {
      const tName = slot.teacher_id?.name || 'Teacher';
      const cName = slot.grade_id?.name || 'another class';
      const sName = slot.subject_id?.name ? ` for ${slot.subject_id.name}` : '';
      const timeSpan = (slot.start_time && slot.end_time) ? ` (${slot.start_time} - ${slot.end_time})` : '';
      return `Schedule Conflict: ${tName} is already assigned to ${cName} (${slot.section})${sName} in Period ${slot.period_no}${timeSpan} on ${day_of_week}!`;
    }
  }

  if (room_no) {
    const roomSlots = await TimetableSlot.find({
      school_id,
      day_of_week,
      room_no: room_no.trim(),
      is_break: false,
      ...(id ? { _id: { $ne: id } } : {}),
      $or: [{ grade_id: { $ne: grade_id } }, { section: { $ne: section } }]
    }).populate('grade_id', 'name').lean();

    for (const slot of roomSlots) {
      const periodMatch = Number(slot.period_no) === Number(period_no);
      const timeOverlap = (start_time && end_time && slot.start_time && slot.end_time)
        ? isTimeOverlap(start_time, end_time, slot.start_time, slot.end_time)
        : false;

      if (periodMatch || timeOverlap) {
        return `Room Conflict: ${room_no} is already occupied by ${slot.grade_id?.name || 'another class'} (${slot.section}) in Period ${slot.period_no} on ${day_of_week}!`;
      }
    }
  }

  return null;
};

module.exports = { checkTimetableConflict, parseTimeToMinutes, isTimeOverlap };

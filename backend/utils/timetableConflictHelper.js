const TimetableSlot = require('../models/TimetableSlot');

const checkTimetableConflict = async ({ school_id, id, day_of_week, period_no, teacher_id, room_no, grade_id, section }) => {
  const teacherConflict = await TimetableSlot.findOne({
    school_id,
    day_of_week,
    period_no: Number(period_no),
    teacher_id,
    is_break: false,
    ...(id ? { _id: { $ne: id } } : {}),
    $or: [{ grade_id: { $ne: grade_id } }, { section: { $ne: section } }]
  }).populate('teacher_id', 'name').populate('grade_id', 'name').lean();

  if (teacherConflict) {
    const tName = teacherConflict.teacher_id?.name || 'Teacher';
    const cName = teacherConflict.grade_id?.name || 'another class';
    return `Schedule Conflict: ${tName} is already assigned to ${cName} (${teacherConflict.section}) in Period ${period_no} on ${day_of_week}!`;
  }

  if (room_no) {
    const roomConflict = await TimetableSlot.findOne({
      school_id,
      day_of_week,
      period_no: Number(period_no),
      room_no: room_no.trim(),
      is_break: false,
      ...(id ? { _id: { $ne: id } } : {}),
      $or: [{ grade_id: { $ne: grade_id } }, { section: { $ne: section } }]
    }).populate('grade_id', 'name').lean();

    if (roomConflict) {
      return `Room Conflict: ${room_no} is already occupied by ${roomConflict.grade_id?.name || 'another class'} (${roomConflict.section}) in Period ${period_no} on ${day_of_week}!`;
    }
  }
  return null;
};

module.exports = { checkTimetableConflict };

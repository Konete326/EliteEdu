const TimetableSlot = require('../models/TimetableSlot');
const TimetableSubstitution = require('../models/TimetableSubstitution');
const { timeToMinutes } = require('./bellScheduleHelper');

const buildTeacherTimeline = (bellSlots = [], teacherSlots = []) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const timeline = [];
  let currentSlot = null;
  let nextSlot = null;

  bellSlots.forEach((bs) => {
    const sMin = timeToMinutes(bs.start_time);
    const eMin = timeToMinutes(bs.end_time);
    const isNow = currentMinutes >= sMin && currentMinutes < eMin;
    const isUpcoming = currentMinutes < sMin;

    if (bs.slot_type === 'Break' || bs.slot_type === 'Assembly') {
      const item = {
        slot_no: bs.slot_no, label: bs.label, slot_type: bs.slot_type,
        start_time: bs.start_time, end_time: bs.end_time,
        is_break: bs.slot_type === 'Break', is_assembly: bs.slot_type === 'Assembly', is_current: isNow
      };
      timeline.push(item);
      if (isNow) currentSlot = item;
      else if (isUpcoming && !nextSlot) nextSlot = item;
      return;
    }

    const assigned = teacherSlots.find((ts) => Number(ts.period_no) === Number(bs.period_index));
    const label = assigned?.is_relief ? `${bs.label} (Relief Duty)` : bs.label;
    const item = {
      slot_no: bs.slot_no, period_no: bs.period_index, label, slot_type: 'Period',
      start_time: bs.start_time, end_time: bs.end_time, is_free: !assigned,
      is_current: isNow, slot_data: assigned || null, is_relief: Boolean(assigned?.is_relief)
    };

    timeline.push(item);
    if (isNow) currentSlot = item;
    else if (isUpcoming && !nextSlot) nextSlot = item;
  });

  return { timeline, currentSlot, nextSlot };
};

const fetchTeacherSlotsWithRelief = async (schoolId, teacherId, selectedDay, dateStr) => {
  const [regular, relief] = await Promise.all([
    TimetableSlot.find({ school_id: schoolId, teacher_id: teacherId, day_of_week: selectedDay })
      .populate('grade_id', 'name code').populate('subject_id', 'name code').lean(),
    TimetableSubstitution.find({
      school_id: schoolId, substitute_teacher_id: teacherId, status: 'Assigned',
      ...(dateStr ? { date: dateStr } : { day_of_week: selectedDay })
    }).populate('grade_id', 'name code').populate('subject_id', 'name code').lean()
  ]);
  return [...regular, ...relief.map((r) => ({ ...r, is_relief: true }))];
};

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports = { buildTeacherTimeline, fetchTeacherSlotsWithRelief, WEEKDAYS };

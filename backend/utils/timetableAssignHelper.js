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
    let label = bs.label;
    if (assigned?.is_relief) label = `${bs.label} (Proxy Class)`;
    else if (assigned?.is_extra_class) label = `${bs.label} (Extra Class)`;
    else if (assigned?.is_double_period) label = `${bs.label} (Double Period)`;
    else if (assigned?.is_relieved_busy) label = `${bs.label} (Relieved / Busy)`;
    else if (assigned?.is_covered_by_other) label = `${bs.label} (Covered by ${assigned.covered_by || 'Substitute'})`;

    const item = {
      slot_no: bs.slot_no,
      period_no: bs.period_index,
      label,
      slot_type: 'Period',
      start_time: bs.start_time,
      end_time: bs.end_time,
      is_free: !assigned || assigned.is_relieved_busy,
      is_current: isNow,
      slot_data: assigned || null,
      is_relief: Boolean(assigned?.is_relief),
      is_extra_class: Boolean(assigned?.is_extra_class),
      is_double_period: Boolean(assigned?.is_double_period),
      is_relieved_busy: Boolean(assigned?.is_relieved_busy),
      is_covered_by_other: Boolean(assigned?.is_covered_by_other),
      covered_by: assigned?.covered_by || null,
      relief_remarks: assigned?.relief_remarks || assigned?.remarks || '',
      adjustment_id: assigned?.adjustment_id || null
    };

    timeline.push(item);
    if (isNow) currentSlot = item;
    else if (isUpcoming && !nextSlot) nextSlot = item;
  });

  return { timeline, currentSlot, nextSlot };
};

const fetchTeacherSlotsWithRelief = async (schoolId, teacherId, selectedDay, dateStr) => {
  const targetDate = dateStr || new Date().toISOString().slice(0, 10);
  const [regular, myAdjustments, coveredByOthers] = await Promise.all([
    TimetableSlot.find({ school_id: schoolId, teacher_id: teacherId, day_of_week: selectedDay })
      .populate('grade_id', 'name code').populate('subject_id', 'name code').lean(),
    TimetableSubstitution.find({
      school_id: schoolId, substitute_teacher_id: teacherId, status: { $ne: 'Cancelled' },
      $or: [{ date: targetDate }, { day_of_week: selectedDay }]
    }).populate('grade_id', 'name code').populate('subject_id', 'name code').lean(),
    TimetableSubstitution.find({
      school_id: schoolId, original_teacher_id: teacherId, status: { $ne: 'Cancelled' },
      date: targetDate
    }).populate('substitute_teacher_id', 'name email').lean()
  ]);

  const coveredSlotMap = new Map();
  coveredByOthers.forEach((c) => {
    if (c.timetable_slot_id) coveredSlotMap.set(String(c.timetable_slot_id), c);
  });

  const processedRegular = regular.map((slot) => {
    const cov = coveredSlotMap.get(String(slot._id));
    if (cov) {
      return {
        ...slot,
        is_covered_by_other: true,
        covered_by: cov.substitute_teacher_id?.name || 'Substitute Teacher',
        relief_remarks: cov.remarks || 'Covered by substitute'
      };
    }
    return slot;
  });

  const formattedAdjustments = myAdjustments.map((a) => ({
    ...a,
    _id: a._id,
    period_no: a.period_no,
    adjustment_id: a._id,
    is_relief: a.adjustment_type === 'Substitution',
    is_extra_class: a.adjustment_type === 'Extra_Class',
    is_double_period: a.adjustment_type === 'Double_Period',
    is_relieved_busy: a.adjustment_type === 'Relieved_Busy',
    remarks: a.remarks
  }));

  return [...processedRegular, ...formattedAdjustments];
};

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports = { buildTeacherTimeline, fetchTeacherSlotsWithRelief, WEEKDAYS };

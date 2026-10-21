const TimetableSlot = require('../models/TimetableSlot');
const StaffAttendance = require('../models/StaffAttendance');

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const match = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3] ? match[3].toUpperCase() : null;
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

const getTodayWeekday = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[new Date().getDay()];
  return day === 'Sunday' ? 'Monday' : day;
};

const buildLiveActivity = (slots, currentMinutes) => {
  let current = null;
  let next = null;

  for (const s of slots) {
    const sMin = parseTimeToMinutes(s.start_time);
    const eMin = parseTimeToMinutes(s.end_time);
    if (sMin !== null && eMin !== null) {
      if (currentMinutes >= sMin && currentMinutes <= eMin) { current = s; break; }
      if (sMin > currentMinutes && !next) next = s;
    }
  }

  if (current) {
    const g = current.grade_id?.name || 'Class';
    const sub = current.subject_id?.name || 'Subject';
    return {
      status: 'in_class', label: `In Class: ${g}-${current.section} (${sub})`,
      room: current.room_no || 'Room 101', class_name: `${g}-${current.section}`,
      subject_name: sub, period_no: current.period_no,
      start_time: current.start_time, end_time: current.end_time
    };
  }
  if (!slots.length) {
    return { status: 'no_slots', label: 'No periods scheduled today', room: '', class_name: '', subject_name: '', period_no: null };
  }
  if (next) {
    const g = next.grade_id?.name || 'Class';
    const sub = next.subject_id?.name || 'Subject';
    return {
      status: 'free', label: `Free Now (Next: P${next.period_no} ${g}-${next.section})`,
      room: next.room_no || '', class_name: `${g}-${next.section}`, subject_name: sub, period_no: next.period_no,
      next_start_time: next.start_time
    };
  }
  return { status: 'free', label: 'Free Period (Staff Room)', room: '', class_name: '', subject_name: '', period_no: null };
};

const enrichTeachersWithRosterAndAttendance = async (schoolId, teachers) => {
  if (!teachers?.length) return [];
  const teacherIds = teachers.map((t) => t._id);
  const todayDate = getTodayDateString();
  const todayWeekday = getTodayWeekday();

  const [attendances, slots, weeklyCounts] = await Promise.all([
    StaffAttendance.find({ school_id: schoolId, date: todayDate, staff_id: { $in: teacherIds } })
      .select('staff_id status check_in_time check_out_time').lean(),
    TimetableSlot.find({ school_id: schoolId, day_of_week: todayWeekday, teacher_id: { $in: teacherIds }, is_break: false })
      .populate('grade_id', 'name code').populate('subject_id', 'name code').sort({ period_no: 1 }).lean(),
    TimetableSlot.aggregate([
      { $match: { school_id: schoolId, teacher_id: { $in: teacherIds }, is_break: false } },
      { $group: { _id: '$teacher_id', count: { $sum: 1 } } }
    ])
  ]);

  const attMap = new Map(attendances.map((a) => [String(a.staff_id), a]));
  const slotsMap = new Map();
  slots.forEach((s) => {
    const k = String(s.teacher_id);
    if (!slotsMap.has(k)) slotsMap.set(k, []);
    slotsMap.get(k).push(s);
  });
  const weeklyMap = new Map(weeklyCounts.map((w) => [String(w._id), w.count]));

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return teachers.map((teacher) => {
    const tId = String(teacher._id);
    const att = attMap.get(tId);
    const tSlots = slotsMap.get(tId) || [];
    const weeklyCount = weeklyMap.get(tId) || 0;
    return {
      ...teacher,
      attendance_today: att
        ? { status: att.status, check_in_time: att.check_in_time || '', check_out_time: att.check_out_time || '' }
        : { status: 'Not_Marked', check_in_time: '', check_out_time: '' },
      live_activity: buildLiveActivity(tSlots, currentMinutes),
      today_slots_count: tSlots.length,
      today_slots: tSlots,
      weekly_periods_count: weeklyCount,
      max_weekly_periods: 28,
      workload_status: weeklyCount >= 28 ? 'overload' : weeklyCount >= 22 ? 'busy' : 'normal'
    };
  });
};

module.exports = { enrichTeachersWithRosterAndAttendance, parseTimeToMinutes, getTodayDateString, getTodayWeekday };
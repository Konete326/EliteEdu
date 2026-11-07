const TimetableSlot = require('../models/TimetableSlot');
const BellSchedule = require('../models/BellSchedule');
const Grade = require('../models/Grade');
const { generateBellSlots } = require('./bellScheduleHelper');
const { generateFridayBellSlots } = require('./fridayBellHelper');

const buildSlotBuckets = (schedule) => {
  const normSlots = (schedule?.slots?.length ? schedule.slots : generateBellSlots({}))
    .filter((s) => s.slot_type === 'Period');
  const friSlots = (schedule?.friday_slots?.length ? schedule.friday_slots : generateFridayBellSlots({}))
    .filter((s) => s.slot_type === 'Period');
  return { normSlots, friSlots };
};

const resolvePool = (assignments, totalSlots) => {
  const pool = [];
  const valid = (assignments || []).filter((a) => a.subject_id && a.teacher_id);
  if (!valid.length) return pool;

  valid.forEach((a) => {
    const count = Math.max(1, Number(a.periods_per_week) || Math.floor(totalSlots / valid.length));
    for (let i = 0; i < count; i++) pool.push({ ...a });
  });

  while (pool.length < totalSlots) {
    const item = valid[pool.length % valid.length];
    pool.push({ ...item });
  }
  return pool.slice(0, totalSlots);
};

const autoScheduleClass = async ({ school_id, campus_id, grade_id, section = 'A', assignments = [] }) => {
  const schedule = await BellSchedule.findOne({ school_id, ...(campus_id ? { campus_id } : {}) }).lean();
  const grade = await Grade.findOne({ _id: grade_id, school_id }).lean();
  const workingDays = schedule?.working_days?.length ? schedule.working_days : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const { normSlots, friSlots } = buildSlotBuckets(schedule);

  const teacherIds = [...new Set(assignments.map((a) => String(a.teacher_id)).filter(Boolean))];
  const busySlots = await TimetableSlot.find({
    school_id,
    day_of_week: { $in: workingDays },
    teacher_id: { $in: teacherIds },
    $or: [{ grade_id: { $ne: grade_id } }, { section: { $ne: section } }]
  }).select('teacher_id day_of_week period_no').lean();

  const busySet = new Set(busySlots.map((s) => `${s.teacher_id}_${s.day_of_week}_${s.period_no}`));
  const roomName = grade?.name ? `Class ${grade.name} (${section})` : `Room ${section}`;

  let totalAvailableSlots = 0;
  workingDays.forEach((d) => { totalAvailableSlots += (d === 'Friday' ? friSlots.length : normSlots.length); });

  const pool = resolvePool(assignments, totalAvailableSlots);
  const remaining = [...pool];
  const finalSlots = [];

  for (const day of workingDays) {
    const dayPeriodList = day === 'Friday' ? friSlots : normSlots;
    const dayAssignedSubjects = new Set();

    for (let idx = 0; idx < dayPeriodList.length; idx++) {
      const pNo = idx + 1;
      const timing = dayPeriodList[idx];

      let candidateIndex = remaining.findIndex(
        (cand) => !busySet.has(`${cand.teacher_id}_${day}_${pNo}`) && !dayAssignedSubjects.has(String(cand.subject_id))
      );

      if (candidateIndex === -1) {
        candidateIndex = remaining.findIndex((cand) => !busySet.has(`${cand.teacher_id}_${day}_${pNo}`));
      }

      if (candidateIndex === -1 && remaining.length > 0) {
        candidateIndex = 0;
      }

      if (candidateIndex !== -1) {
        const [chosen] = remaining.splice(candidateIndex, 1);
        dayAssignedSubjects.add(String(chosen.subject_id));
        finalSlots.push({
          school_id,
          campus_id: campus_id || null,
          grade_id,
          section: section.trim(),
          day_of_week: day,
          period_no: pNo,
          start_time: timing.start_time,
          end_time: timing.end_time,
          subject_id: chosen.subject_id,
          teacher_id: chosen.teacher_id,
          room_no: roomName,
          is_break: false
        });
      }
    }
  }

  await TimetableSlot.deleteMany({ school_id, grade_id, section });
  if (finalSlots.length > 0) {
    await TimetableSlot.insertMany(finalSlots);
  }

  return { success: true, count: finalSlots.length, slots: finalSlots };
};

module.exports = { autoScheduleClass };


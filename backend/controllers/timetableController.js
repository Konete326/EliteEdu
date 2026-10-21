const TimetableSlot = require('../models/TimetableSlot');
const BellSchedule = require('../models/BellSchedule');
const Notification = require('../models/Notification');
const { checkTimetableConflict } = require('../utils/timetableConflictHelper');
const { buildTeacherTimeline, fetchTeacherSlotsWithRelief, WEEKDAYS } = require('../utils/timetableAssignHelper');

const getTimetableSlots = async (req, res) => {
  try {
    const { grade_id, section, teacher_id, day_of_week, campus_id } = req.query;
    const schoolId = req.schoolId || req.user.school_id;
    const query = { school_id: schoolId };

    if (campus_id) query.campus_id = campus_id;
    if (grade_id) query.grade_id = grade_id;
    if (section) query.section = section;
    if (day_of_week) query.day_of_week = day_of_week;
    if (teacher_id) query.teacher_id = teacher_id;

    const [slots, bellSchedule] = await Promise.all([
      TimetableSlot.find(query)
        .populate('grade_id', 'name code').populate('subject_id', 'name code')
        .populate('teacher_id', 'name email').populate('campus_id', 'name')
        .sort({ day_of_week: 1, period_no: 1 }).lean(),
      BellSchedule.findOne({ school_id: schoolId, ...(campus_id ? { campus_id } : {}) }).lean()
    ]);

    res.status(200).json({ success: true, bellSchedule, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMySchedule = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user.school_id;
    const teacherId = req.user.id;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()] === 'Sunday' ? 'Monday' : days[new Date().getDay()];
    const selectedDay = req.query.day_of_week || currentDay;

    const [bellSchedule, teacherSlots] = await Promise.all([
      BellSchedule.findOne({ school_id: schoolId }).lean(),
      fetchTeacherSlotsWithRelief(schoolId, teacherId, selectedDay)
    ]);

    const bellSlots = bellSchedule?.slots || [];
    const { timeline, currentSlot, nextSlot } = buildTeacherTimeline(bellSlots, teacherSlots);

    res.status(200).json({
      success: true,
      day_of_week: selectedDay,
      bellSchedule,
      periodTimeline: timeline,
      currentSlot,
      nextSlot
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignTimetableSlot = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user.school_id;
    const {
      id, grade_id, section = 'A', day_of_week, period_no, start_time,
      end_time, subject_id, teacher_id, room_no = 'Room 101', apply_all_weekdays = false, campus_id
    } = req.body;

    const daysToAssign = apply_all_weekdays ? WEEKDAYS : [day_of_week || 'Monday'];

    for (const day of daysToAssign) {
      const conflictMsg = await checkTimetableConflict({
        school_id: schoolId, id, day_of_week: day, period_no, start_time, end_time, teacher_id, room_no, grade_id, section
      });
      if (conflictMsg) return res.status(409).json({ success: false, message: conflictMsg });
    }

    const savedSlots = [];
    for (const day of daysToAssign) {
      const payload = {
        school_id: schoolId, campus_id: campus_id || null, grade_id, section: section.trim(),
        day_of_week: day, period_no: Number(period_no), start_time: start_time.trim(),
        end_time: end_time.trim(), subject_id, teacher_id, room_no: room_no ? room_no.trim() : 'Room 101',
        is_break: false
      };
      const slot = await TimetableSlot.findOneAndUpdate(
        { school_id: schoolId, grade_id, section, day_of_week: day, period_no: Number(period_no) },
        payload, { upsert: true, new: true, runValidators: true }
      );
      savedSlots.push(slot);
    }

    await Notification.create({
      school_id: schoolId, title: `Timetable Routine: Period ${period_no}`,
      message: `Scheduled for Period ${period_no} (${start_time} - ${end_time}) in ${room_no}.`,
      target_type: 'Teacher', target_id: teacher_id, created_by: req.user?.id || null
    }).catch(() => {});

    res.status(201).json({ success: true, message: 'Timetable assigned successfully', slotsCount: savedSlots.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTimetableSlot = async (req, res) => {
  try {
    const slot = await TimetableSlot.findOneAndDelete({ _id: req.params.id, school_id: req.schoolId || req.user.school_id });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.status(200).json({ success: true, message: 'Timetable slot removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTimetableSlots, getMySchedule, assignTimetableSlot, deleteTimetableSlot };

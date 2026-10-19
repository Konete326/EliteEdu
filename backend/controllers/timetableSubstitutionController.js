const TimetableSlot = require('../models/TimetableSlot');
const TimetableSubstitution = require('../models/TimetableSubstitution');
const StaffAttendance = require('../models/StaffAttendance');
const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

const getSubstitutions = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const campusId = req.query.campus_id || null;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const todayName = days[now.getDay()] === 'Sunday' ? 'Monday' : days[now.getDay()];
    const todayDate = req.query.date || now.toISOString().slice(0, 10);

    const [attendanceList, leaveList, activeTeachers, existingSubs] = await Promise.all([
      StaffAttendance.find({ school_id: schoolId, date: todayDate, status: { $in: ['A', 'L', 'HD'] } }).lean(),
      LeaveRequest.find({ school_id: schoolId, applicant_type: 'Staff', status: 'Approved', from_date: { $lte: todayDate }, to_date: { $gte: todayDate } }).lean(),
      User.find({ school_id: schoolId, role: { $in: ['Teacher', 'Staff'] }, status: { $ne: 'Inactive' } }).select('name email designation').lean(),
      TimetableSubstitution.find({ school_id: schoolId, date: todayDate, status: { $ne: 'Cancelled' } }).populate('substitute_teacher_id', 'name email').lean()
    ]);

    const absentMap = new Map();
    attendanceList.forEach((a) => absentMap.set(String(a.staff_id), a.status === 'L' ? 'On Leave' : 'Absent'));
    leaveList.forEach((l) => absentMap.set(String(l.staff_id), `${l.leave_type || 'Leave'} (Approved)`));

    const absentIds = Array.from(absentMap.keys());
    const slotQuery = { school_id: schoolId, day_of_week: todayName };
    if (campusId) slotQuery.campus_id = campusId;

    const [allSlotsToday, absentSlots] = await Promise.all([
      TimetableSlot.find(slotQuery).select('period_no teacher_id').lean(),
      TimetableSlot.find({ ...slotQuery, teacher_id: { $in: absentIds } })
        .populate('grade_id', 'name code').populate('subject_id', 'name code')
        .populate('teacher_id', 'name email designation').sort({ period_no: 1 }).lean()
    ]);

    const busyTeachersByPeriod = {};
    allSlotsToday.forEach((s) => {
      const p = s.period_no;
      if (!busyTeachersByPeriod[p]) busyTeachersByPeriod[p] = new Set();
      busyTeachersByPeriod[p].add(String(s.teacher_id));
    });
    existingSubs.forEach((sub) => {
      const p = sub.period_no;
      if (!busyTeachersByPeriod[p]) busyTeachersByPeriod[p] = new Set();
      busyTeachersByPeriod[p].add(String(sub.substitute_teacher_id?._id || sub.substitute_teacher_id));
    });

    const reliefItems = absentSlots.map((slot) => {
      const busySet = busyTeachersByPeriod[slot.period_no] || new Set();
      const freeTeachers = activeTeachers.filter((t) => !busySet.has(String(t._id)) && !absentMap.has(String(t._id)));
      const sub = existingSubs.find((s) => String(s.timetable_slot_id) === String(slot._id));
      return {
        slot,
        period_no: slot.period_no,
        start_time: slot.start_time,
        end_time: slot.end_time,
        absent_teacher: slot.teacher_id,
        reason: absentMap.get(String(slot.teacher_id?._id || slot.teacher_id)) || 'Absent',
        free_teachers: freeTeachers,
        substitution: sub || null
      };
    });

    res.status(200).json({ success: true, date: todayDate, day_of_week: todayName, absentCount: absentIds.length, reliefItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignSubstitution = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { slot_id, substitute_teacher_id, date, remarks } = req.body;
    if (!slot_id || !substitute_teacher_id) {
      return res.status(400).json({ success: false, message: 'Slot ID and substitute teacher are required' });
    }
    const slot = await TimetableSlot.findOne({ _id: slot_id, school_id: schoolId }).populate('grade_id', 'name').populate('subject_id', 'name');
    if (!slot) return res.status(404).json({ success: false, message: 'Timetable slot not found' });

    const targetDate = date || new Date().toISOString().slice(0, 10);
    const sub = await TimetableSubstitution.findOneAndUpdate(
      { school_id: schoolId, date: targetDate, timetable_slot_id: slot._id },
      {
        school_id: schoolId, campus_id: slot.campus_id, date: targetDate, timetable_slot_id: slot._id,
        period_no: slot.period_no, day_of_week: slot.day_of_week, grade_id: slot.grade_id?._id || slot.grade_id,
        section: slot.section, subject_id: slot.subject_id?._id || slot.subject_id, original_teacher_id: slot.teacher_id,
        substitute_teacher_id, status: 'Assigned', remarks: remarks || '', assigned_by: req.user?._id || null
      },
      { upsert: true, new: true }
    );

    await Notification.create({
      school_id: schoolId, campus_id: slot.campus_id, title: 'Relief Duty Assigned',
      message: `Relief Duty Assigned: Period ${slot.period_no} in ${slot.grade_id?.name || 'Class'} - Sec ${slot.section || 'A'} (${slot.subject_id?.name || 'Subject'})`,
      type: 'Academic', priority: 'Important', target_audience: 'Specific_User',
      target_user_id: substitute_teacher_id, action_url: '/teacher/timetable', created_by: req.user?._id || null
    }).catch(() => {});

    res.status(200).json({ success: true, message: 'Substitute teacher assigned successfully', data: sub });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelSubstitution = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    await TimetableSubstitution.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    res.status(200).json({ success: true, message: 'Substitution cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSubstitutions, assignSubstitution, cancelSubstitution };

const BellSchedule = require('../models/BellSchedule');
const { generateBellSlots } = require('../utils/bellScheduleHelper');
const { generateFridayBellSlots } = require('../utils/fridayBellHelper');

const getBellSchedule = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user.school_id;
    const campusId = req.query.campus_id || null;
    const filter = { school_id: schoolId };
    if (campusId) filter.campus_id = campusId;

    let schedule = await BellSchedule.findOne(filter).lean();
    if (!schedule) {
      const defaultSlots = generateBellSlots({
        school_start_time: '08:00 AM',
        assembly_duration: 15,
        period_duration: 40,
        total_periods: 7,
        break_after_period: 4,
        break_duration: 30
      });
      const defaultFridaySlots = generateFridayBellSlots({
        school_start_time: '08:00 AM',
        friday_end_time: '12:30 PM',
        assembly_duration: 15,
        friday_total_periods: 5,
        break_duration: 20
      });
      schedule = await BellSchedule.create({
        school_id: schoolId,
        campus_id: campusId,
        school_start_time: '08:00 AM',
        school_end_time: '02:00 PM',
        friday_end_time: '12:30 PM',
        assembly_duration: 15,
        period_duration: 40,
        total_periods: 7,
        friday_total_periods: 5,
        working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        break_after_period: 4,
        break_duration: 30,
        slots: defaultSlots,
        friday_slots: defaultFridaySlots
      });
    }

    res.status(200).json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const saveBellSchedule = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user.school_id;
    const {
      campus_id,
      school_start_time,
      school_end_time,
      friday_end_time,
      assembly_duration,
      period_duration,
      total_periods,
      friday_total_periods,
      working_days,
      break_after_period,
      break_duration,
      slots: customSlots,
      friday_slots: customFridaySlots
    } = req.body;

    const slots = (customSlots && customSlots.length > 0)
      ? customSlots
      : generateBellSlots({
          school_start_time,
          assembly_duration,
          period_duration,
          total_periods,
          break_after_period,
          break_duration
        });

    const fridaySlots = (customFridaySlots && customFridaySlots.length > 0)
      ? customFridaySlots
      : generateFridayBellSlots({
          school_start_time,
          friday_end_time,
          assembly_duration,
          friday_total_periods: friday_total_periods || 5,
          break_duration: 20
        });

    const filter = { school_id: schoolId };
    if (campus_id) filter.campus_id = campus_id;

    const schedule = await BellSchedule.findOneAndUpdate(
      filter,
      {
        school_id: schoolId,
        campus_id: campus_id || null,
        school_start_time: school_start_time || '08:00 AM',
        school_end_time: school_end_time || '02:00 PM',
        friday_end_time: friday_end_time || '12:30 PM',
        assembly_duration: Number(assembly_duration ?? 15),
        period_duration: Number(period_duration ?? 40),
        total_periods: Number(total_periods ?? 7),
        friday_total_periods: Number(friday_total_periods ?? 5),
        working_days: Array.isArray(working_days) && working_days.length > 0
          ? working_days
          : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        break_after_period: Number(break_after_period ?? 4),
        break_duration: Number(break_duration ?? 30),
        slots,
        friday_slots: fridaySlots
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Bell timings and period schedule saved successfully',
      schedule
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBellSchedule, saveBellSchedule };

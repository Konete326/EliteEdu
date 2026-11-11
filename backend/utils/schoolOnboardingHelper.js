const Campus = require('../models/Campus');
const BellSchedule = require('../models/BellSchedule');

const buildDefaultSchedule = (schoolId, campusId) => {
  const slots = [
    { slot_no: 1, label: 'Assembly', slot_type: 'Assembly', period_index: null, start_time: '08:00', end_time: '08:15' },
    { slot_no: 2, label: 'Period 1', slot_type: 'Period', period_index: 1, start_time: '08:15', end_time: '08:55' },
    { slot_no: 3, label: 'Period 2', slot_type: 'Period', period_index: 2, start_time: '08:55', end_time: '09:35' },
    { slot_no: 3, label: 'Period 3', slot_type: 'Period', period_index: 3, start_time: '09:35', end_time: '10:15' },
    { slot_no: 4, label: 'Period 4', slot_type: 'Period', period_index: 4, start_time: '10:15', end_time: '10:55' },
    { slot_no: 5, label: 'Break', slot_type: 'Break', period_index: null, start_time: '10:55', end_time: '11:25' },
    { slot_no: 6, label: 'Period 5', slot_type: 'Period', period_index: 5, start_time: '11:25', end_time: '12:05' },
    { slot_no: 7, label: 'Period 6', slot_type: 'Period', period_index: 6, start_time: '12:05', end_time: '12:45' },
    { slot_no: 8, label: 'Period 7', slot_type: 'Period', period_index: 7, start_time: '12:45', end_time: '13:30' }
  ];

  const friday_slots = [
    { slot_no: 1, label: 'Assembly', slot_type: 'Assembly', period_index: null, start_time: '08:00', end_time: '08:15' },
    { slot_no: 2, label: 'Period 1', slot_type: 'Period', period_index: 1, start_time: '08:15', end_time: '08:55' },
    { slot_no: 3, label: 'Period 2', slot_type: 'Period', period_index: 2, start_time: '08:55', end_time: '09:35' },
    { slot_no: 4, label: 'Break', slot_type: 'Break', period_index: null, start_time: '09:35', end_time: '09:55' },
    { slot_no: 5, label: 'Period 3', slot_type: 'Period', period_index: 3, start_time: '09:55', end_time: '10:35' },
    { slot_no: 6, label: 'Period 4', slot_type: 'Period', period_index: 4, start_time: '10:35', end_time: '11:15' },
    { slot_no: 7, label: 'Period 5', slot_type: 'Period', period_index: 5, start_time: '11:15', end_time: '12:00' }
  ];

  return {
    school_id: schoolId,
    campus_id: campusId,
    school_start_time: '08:00 AM',
    school_end_time: '01:30 PM',
    friday_end_time: '12:00 PM',
    assembly_duration: 15,
    period_duration: 40,
    total_periods: 7,
    friday_total_periods: 5,
    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    break_after_period: 4,
    break_duration: 30,
    slots,
    friday_slots
  };
};

const onboardSchoolDefaults = async (school, session) => {
  const existingCampus = await Campus.findOne({ school_id: school._id }).session(session).lean();
  let campusId = existingCampus?._id;

  if (!existingCampus) {
    const campusCode = school.code ? `${school.code}-MAIN` : 'MAIN';
    const [mainCampus] = await Campus.create(
      [
        {
          school_id: school._id,
          name: 'Main Campus',
          code: campusCode,
          is_main: true,
          status: 'Active',
          email: school.email || '',
          contact_number: school.contact_number || '',
          address: school.address || ''
        }
      ],
      { session }
    );
    campusId = mainCampus._id;
  }

  const existingSchedule = await BellSchedule.findOne({ school_id: school._id, campus_id: campusId }).session(session).lean();
  if (!existingSchedule) {
    await BellSchedule.create([buildDefaultSchedule(school._id, campusId)], { session });
  }
};

module.exports = { onboardSchoolDefaults, buildDefaultSchedule };


const StudentAttendance = require('../models/StudentAttendance');
const StaffAttendance = require('../models/StaffAttendance');
const MarkSheet = require('../models/MarkSheet');
const User = require('../models/User');
const FeePayment = require('../models/FeePayment');

const getCategoryData = async (req, res) => {
  try {
    const { category = 'attendance', campus_id } = req.query;
    const school_id = req.user.school_id;
    const filter = { school_id };
    if (campus_id && campus_id !== 'all') filter.campus_id = campus_id;

    if (category === 'attendance') {
      const records = await StudentAttendance.find(filter)
        .populate('grade_id', 'name')
        .populate('student_id', 'name gr_number')
        .sort({ date: -1 })
        .limit(100)
        .lean();
      return res.status(200).json({ success: true, category, data: records });
    }

    if (category === 'staff_attendance') {
      const records = await StaffAttendance.find(filter)
        .populate('staff_id', 'name email role employee_id')
        .sort({ date: -1 })
        .limit(100)
        .lean();
      return res.status(200).json({ success: true, category, data: records });
    }

    if (category === 'exams') {
      const sheets = await MarkSheet.find(filter)
        .populate('grade_id', 'name')
        .populate('subject_id', 'name')
        .populate('exam_id', 'title term')
        .sort({ exam_date: -1 })
        .limit(50)
        .lean();
      return res.status(200).json({ success: true, category, data: sheets });
    }

    if (category === 'staff_hr') {
      const staffList = await User.find({ school_id, is_active: true })
        .select('name email role phone designation campus_id')
        .populate('campus_id', 'name')
        .lean();
      return res.status(200).json({ success: true, category, data: staffList });
    }

    if (category === 'fee_finance') {
      const payments = await FeePayment.find(filter)
        .populate('student_id', 'name gr_number')
        .sort({ payment_date: -1 })
        .limit(100)
        .lean();
      return res.status(200).json({ success: true, category, data: payments });
    }

    return res.status(200).json({ success: true, category, data: [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategoryData };

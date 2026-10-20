const User = require('../models/User');
const Student = require('../models/Student');
const { escapeRegex } = require('../utils/chatQueryHelper');

const getDirectory = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const campusId = req.query.campus_id || (['Admin', 'SuperAdmin'].includes(req.user.role) ? null : req.user.campus_id);
    const search = String(req.query.search || '').trim();

    const userQuery = {
      school_id: schoolId,
      status: { $ne: 'Inactive' },
      is_active: { $ne: false },
      _id: { $ne: req.user.id }
    };
    if (campusId) userQuery.campus_id = campusId;

    const studentQuery = {
      school_id: schoolId,
      status: { $in: ['Active', 'active', 'Registered', 'registered'] }
    };
    if (campusId) studentQuery.campus_id = campusId;

    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      userQuery.$or = [{ name: regex }, { email: regex }, { designation: regex }, { employee_code: regex }];
      studentQuery.$or = [{ name: regex }, { gr_number: regex }, { current_section: regex }];
    }

    const [staffList, studentList] = await Promise.all([
      User.find(userQuery).select('name role designation photo_url campus_id employee_code').sort({ name: 1 }).limit(300),
      Student.find(studentQuery).select('name current_grade current_section photo_url gr_number campus_id').populate('current_grade', 'name').sort({ name: 1 }).limit(300)
    ]);

    const formattedStaff = staffList.map((u) => ({
      user_id: u._id,
      user_model: 'User',
      name: u.name,
      role_label: u.designation || u.role || 'Faculty',
      avatar_url: u.photo_url || '',
      campus_id: u.campus_id,
      code: u.employee_code || ''
    }));

    const formattedStudents = studentList.map((s) => ({
      user_id: s._id,
      user_model: 'Student',
      name: s.name,
      role_label: `Student (${s.current_grade?.name || 'Class'} - ${s.current_section || 'A'})`,
      avatar_url: s.photo_url || '',
      campus_id: s.campus_id,
      code: s.gr_number || ''
    }));

    res.status(200).json({
      success: true,
      data: {
        staff: formattedStaff,
        students: formattedStudents,
        total: formattedStaff.length + formattedStudents.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load directory', error: error.message });
  }
};

module.exports = { getDirectory };

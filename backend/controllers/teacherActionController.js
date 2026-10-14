const User = require('../models/User');
const Grade = require('../models/Grade');

const toggleTeacherStatus = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const { status } = req.body;

    const teacher = await User.findOne({ _id: id, school_id: schoolId, role: 'Teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.status = status !== undefined ? status : teacher.status === 'Active' ? 'Inactive' : 'Active';
    teacher.is_active = teacher.status === 'Active';
    await teacher.save();

    res.status(200).json({ success: true, teacher });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle status', error: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;

    const teacher = await User.findOneAndDelete({ _id: id, school_id: schoolId, role: 'Teacher' });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await Grade.updateMany(
      { school_id: schoolId, class_teacher: id },
      { $set: { class_teacher: null } }
    );

    res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete teacher', error: error.message });
  }
};

module.exports = { toggleTeacherStatus, deleteTeacher };

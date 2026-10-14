const Student = require('../models/Student');

const toggleStudentStatus = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const { status } = req.body;

    const student = await Student.findOne({ _id: id, school_id: schoolId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.status = status !== undefined ? status : student.status === 'Active' ? 'Left' : 'Active';
    await student.save();

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student status', error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;

    const student = await Student.findOneAndDelete({ _id: id, school_id: schoolId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
};

module.exports = { toggleStudentStatus, deleteStudent };

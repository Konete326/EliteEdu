const mongoose = require('mongoose');
const Student = require('../models/Student');
const { generateNextGrNumber } = require('../utils/grNumberGenerator');
const { sanitizeStudentPayload } = require('../utils/sanitizeData');

const createStudent = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { name, father_name, gr_number, campus_id, serial_no, portal_username, portal_temp_password, ...rest } = req.body;
    if (!name?.trim() || !father_name?.trim()) {
      return res.status(400).json({ message: 'Student Name and Father Name are required.' });
    }

    let finalCampusId = campus_id;
    if (!finalCampusId) {
      const defCampus = await mongoose.model('Campus').findOne({ school_id: schoolId }).lean();
      if (defCampus) finalCampusId = defCampus._id;
    }

    const finalGr = gr_number?.trim() || (await generateNextGrNumber(schoolId));
    const year = new Date().getFullYear();
    const finalSerial = serial_no?.trim() || `${year}-${finalGr}`;
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
    const finalUsername = portal_username?.trim() || `${finalGr}${cleanName}`;
    const finalPassword = portal_temp_password?.trim() || `Edu@${finalGr}`;

    const rawStudent = {
      ...rest,
      school_id: schoolId,
      campus_id: finalCampusId,
      name: name.trim(),
      father_name: father_name.trim(),
      gr_number: finalGr,
      serial_no: finalSerial,
      portal_username: finalUsername,
      portal_temp_password: finalPassword
    };

    const student = await Student.create(sanitizeStudentPayload(rawStudent));
    res.status(201).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const cleanBody = sanitizeStudentPayload(req.body);
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      cleanBody,
      { new: true, runValidators: true }
    )
      .populate('campus_id', 'name address contact_number email website logo')
      .populate('school_id', 'name school_type logo')
      .populate('current_grade', 'name sections');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
};

module.exports = { createStudent, updateStudent };

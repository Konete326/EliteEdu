const bcrypt = require('bcryptjs');
const StaffApplicant = require('../models/StaffApplicant');
const User = require('../models/User');
const { generateNextEmployeeCode } = require('../utils/employeeCodeGenerator');

const VALID_STATUSES = ['Pending Verification', 'Verified', 'Approved', 'Converted', 'Rejected'];

const updateApplicantStatus = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const { status, approved_salary } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (approved_salary !== undefined && !isNaN(Number(approved_salary))) {
      updateFields.approved_salary = Number(approved_salary);
    }

    const applicant = await StaffApplicant.findOneAndUpdate(
      { _id: id, school_id: schoolId },
      updateFields,
      { new: true }
    )
      .populate('campus_id', 'name')
      .populate('replacement_staff', 'name basic_salary designation employee_code photo_url');

    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.status(200).json({ success: true, applicant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update applicant status', error: error.message });
  }
};

const convertApplicantToTeacher = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;

    const applicant = await StaffApplicant.findOne({ _id: id, school_id: schoolId });
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });

    if (applicant.status === 'Converted' || applicant.converted_user_id) {
      return res.status(400).json({ message: 'Applicant has already been converted to staff' });
    }

    const empCode = await generateNextEmployeeCode(schoolId);
    let teacherEmail = applicant.email ? applicant.email.toLowerCase().trim() : '';

    if (!teacherEmail || (await User.findOne({ email: teacherEmail }).select('_id').lean())) {
      const slug = applicant.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'staff';
      teacherEmail = `${slug}.${Date.now().toString().slice(-4)}@school.local`;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Teacher123', salt);
    const finalSalary = Number(applicant.approved_salary) || Number(applicant.expected_salary) || 0;

    const teacher = await User.create({
      name: applicant.name,
      father_name: applicant.father_name || '',
      email: teacherEmail,
      password: hashedPassword,
      role: 'Teacher',
      school_id: schoolId,
      campus_id: applicant.campus_id || null,
      status: 'Active',
      is_active: true,
      photo_url: applicant.photo_url || '',
      dob: applicant.dob || null,
      gender: applicant.gender || 'Male',
      marital_status: applicant.marital_status || 'Single',
      contact_number: applicant.contact_number || '',
      cnic: applicant.cnic || '',
      employee_code: empCode,
      department: applicant.department || 'Academics',
      designation: applicant.designation || 'OTHER',
      bps_grade: applicant.bps_grade || '',
      qualification: applicant.qualification || '',
      basic_salary: finalSalary,
      current_address: applicant.current_address || '',
      permanent_address: applicant.permanent_address || '',
      joining_date: new Date()
    });

    applicant.status = 'Converted';
    applicant.converted_user_id = teacher._id;
    await applicant.save();

    res.status(201).json({
      success: true,
      message: 'Applicant successfully converted to staff member',
      teacher,
      applicant
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to convert applicant to teacher', error: error.message });
  }
};

module.exports = { updateApplicantStatus, convertApplicantToTeacher };

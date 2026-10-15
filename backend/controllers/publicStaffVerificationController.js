const mongoose = require('mongoose');
const User = require('../models/User');

const verifyStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Staff Verification Identifier' });
    }

    const staff = await User.findById(id)
      .populate('school_id', 'name school_type logo')
      .populate('campus_id', 'name address contact_number email website semis_code area')
      .populate('subjects', 'name code')
      .populate('grades', 'name')
      .lean();

    if (!staff || staff.role !== 'Teacher') {
      return res.status(404).json({ success: false, message: 'Staff record not found or identifier expired' });
    }

    const safeData = {
      _id: staff._id,
      name: staff.name,
      father_name: staff.father_name || staff.spouse_name || '',
      designation: staff.designation || 'Teacher',
      bps_grade: staff.bps_grade || '',
      employee_code: staff.employee_code || staff.personal_id || '',
      personal_id: staff.personal_id || '',
      photo_url: staff.photo_url || '',
      status: staff.status || 'Active',
      cnic: staff.cnic || '',
      dob: staff.dob,
      appointment_date: staff.appointment_date || staff.joining_date,
      blood_group: staff.blood_group || '',
      semis_code: staff.semis_code || staff.campus_id?.semis_code || '',
      vendor_no: staff.vendor_no || '',
      sed_no: staff.sed_no || '',
      contact_number: staff.contact_number || '',
      email: staff.email || '',
      current_address: staff.current_address || '',
      institution: {
        school_name: staff.school_id?.name || 'Elite Educational System',
        campus_name: staff.campus_id?.name || staff.school_id?.name || 'Main Campus',
        campus_address: staff.campus_id?.address || '',
        area: staff.campus_id?.area || '',
        school_type: staff.school_id?.school_type || 'Private'
      }
    };

    return res.status(200).json({ success: true, data: safeData });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyStaff };

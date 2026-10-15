const mongoose = require('mongoose');
const User = require('../models/User');

const verifyStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Staff Verification Identifier' });
    }

    const teacher = await User.findOne({ _id: id, role: 'Teacher' })
      .populate('school_id', 'name school_type logo')
      .populate('campus_id', 'name address contact_number email website semis_code area')
      .lean();

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher / Staff record not found or expired' });
    }

    const safeData = {
      _id: teacher._id,
      name: teacher.name,
      father_name: teacher.father_name || teacher.spouse_name || '',
      designation: teacher.designation || 'PST',
      bps_grade: teacher.bps_grade || 'BPS-14',
      employee_code: teacher.employee_code || '',
      personal_id: teacher.personal_id || teacher.employee_code || '',
      photo_url: teacher.photo_url || '',
      gender: teacher.gender || 'Male',
      status: teacher.status || 'Active',
      appointment_date: teacher.appointment_date || teacher.joining_date,
      cnic_last4: teacher.cnic ? teacher.cnic.slice(-4) : '',
      blood_group: teacher.blood_group || 'Not Specified',
      semis_code: teacher.semis_code || teacher.campus_id?.semis_code || '408110114',
      vendor_no: teacher.vendor_no || '',
      sed_no: teacher.sed_no || '',
      phone: teacher.contact_number || '',
      institution: {
        school_name: teacher.school_id?.name || 'Education Department, Govt of Sindh',
        school_type: teacher.school_id?.school_type || 'Government',
        campus_name: teacher.campus_id?.name || 'Campus APWA GBSS J-1',
        campus_address: teacher.campus_id?.address || 'Area Korangi, Karachi',
        campus_phone: teacher.campus_id?.contact_number || '03422667599',
        campus_website: teacher.campus_id?.website || 'https://eliteedu.pk'
      }
    };

    return res.status(200).json({ success: true, data: safeData });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyStaff };

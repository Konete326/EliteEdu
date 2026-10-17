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

    const rawBps = teacher.bps_grade ? String(teacher.bps_grade).replace(/^BPS[-_\s]*/i, '').trim() : '';
    const safeData = {
      _id: teacher._id,
      name: teacher.name,
      father_name: teacher.father_name || teacher.spouse_name || '',
      designation: teacher.designation || 'Staff',
      bps_grade: rawBps ? `BPS-${rawBps}` : '',
      employee_code: teacher.employee_code || '',
      personal_id: teacher.personal_id || teacher.employee_code || '',
      photo_url: teacher.photo_url || '',
      gender: teacher.gender || 'Male',
      status: teacher.status || 'Active',
      appointment_date: teacher.appointment_date || teacher.joining_date,
      cnic_last4: teacher.cnic ? teacher.cnic.slice(-4) : '',
      blood_group: teacher.blood_group || 'Not Specified',
      semis_code: teacher.semis_code || teacher.campus_id?.semis_code || '—',
      vendor_no: teacher.vendor_no || '',
      sed_no: teacher.sed_no || '',
      phone: teacher.contact_number || '',
      institution: {
        school_name: teacher.school_id?.name || '—',
        school_type: teacher.school_id?.school_type || '—',
        campus_name: teacher.campus_id?.name || '—',
        campus_address: teacher.campus_id?.address || '—',
        campus_phone: teacher.campus_id?.contact_number || '—',
        campus_website: teacher.campus_id?.website || ''
      }
    };

    return res.status(200).json({ success: true, data: safeData });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyStaff };

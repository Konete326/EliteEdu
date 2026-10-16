const mongoose = require('mongoose');
const Student = require('../models/Student');

const verifyStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Student Verification Identifier' });
    }

    const student = await Student.findById(id)
      .populate('school_id', 'name school_type logo')
      .populate('campus_id', 'name address contact_number email website semis_code area')
      .populate('current_grade', 'name')
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found or identifier expired' });
    }

    const emergencyPhone =
      student.emergency_contact_no ||
      student.father_details?.phone ||
      student.contact_number ||
      student.mother_details?.phone ||
      'Not Specified';

    const safeData = {
      _id: student._id,
      name: student.name,
      father_name: student.father_name,
      gr_number: student.gr_number,
      serial_no: student.serial_no || '',
      photo_url: student.photo_url || '',
      gender: student.gender || 'Male',
      status: student.status || 'Active',
      admission_date: student.admission_date,
      current_grade: student.current_grade?.name || 'Class',
      current_section: student.current_section || 'A',
      emergency: {
        blood_group: student.blood_group || 'Not Specified',
        disease_if_any: student.disease_if_any || 'None',
        identification_mark: student.identification_mark || 'Nil',
        emergency_contact_no: emergencyPhone
      },
      institution: {
        school_name: student.school_id?.name || 'Elite Educational System',
        campus_name: student.campus_id?.name || student.school_id?.name || 'Campus APWA GBSS J-1',
        campus_address: student.campus_id?.address || 'Area Korangi, Karachi',
        campus_phone: student.campus_id?.contact_number || '03422667599',
        campus_website: student.campus_id?.website || 'https://elitedev-edu.vercel.app',
        semis_code: student.campus_id?.semis_code || '408110114',
        area: student.campus_id?.area || 'KORANGI'
      }
    };

    return res.status(200).json({ success: true, data: safeData });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyStudent };

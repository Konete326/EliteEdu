const Student = require('../models/Student');

const getFeeConcessions = async (req, res) => {
  try {
    const query = { school_id: req.schoolId, status: 'Active' };
    if (req.query.campus_id) query.campus_id = req.query.campus_id;
    if (req.query.grade_id) query.current_grade = req.query.grade_id;

    if (req.query.only_discounted === 'true') {
      query.discount = { $gt: 0 };
    }

    if (req.query.search) {
      const q = req.query.search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { gr_number: { $regex: q, $options: 'i' } },
        { father_name: { $regex: q, $options: 'i' } },
        { discount_reference: { $regex: q, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('current_grade', 'name monthly_fee')
      .populate('campus_id', 'name code')
      .select('name father_name gr_number current_grade current_section contact_number monthly_fee discount discount_reference photo_url')
      .sort({ discount: -1, name: 1 })
      .lean();

    const totalScholarshipMonthly = students.reduce((sum, s) => sum + Number(s.discount || 0), 0);
    const discountedStudentsCount = students.filter((s) => Number(s.discount) > 0).length;

    res.status(200).json({
      success: true,
      students,
      stats: {
        total_scholarship_monthly: totalScholarshipMonthly,
        discounted_students_count: discountedStudentsCount,
        total_students: students.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStudentConcession = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { discount = 0, discount_reference = '', monthly_fee } = req.body;

    const student = await Student.findOne({ _id: studentId, school_id: req.schoolId });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    student.discount = Math.max(0, Number(discount));
    student.discount_reference = discount_reference ? String(discount_reference).trim() : '';
    if (monthly_fee !== undefined) {
      student.monthly_fee = Math.max(0, Number(monthly_fee));
    }

    await student.save();

    const updated = await Student.findById(student._id)
      .populate('current_grade', 'name')
      .populate('campus_id', 'name code');

    res.status(200).json({ success: true, message: 'Student concession updated successfully', student: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeeConcessions, updateStudentConcession };

const mongoose = require('mongoose');
const Student = require('../models/Student');
const { generateNextFamilyNumber } = require('../utils/familyNumberGenerator');

const getStudents = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { page = 1, limit = 20, search, campus_id, grade_id, status } = req.query;
    const filter = { school_id: schoolId };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) filter.campus_id = campus_id;
    if (grade_id && grade_id !== 'all' && mongoose.Types.ObjectId.isValid(grade_id)) filter.current_grade = grade_id;
    if (status && status !== 'all') filter.status = status;
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { gr_number: { $regex: q, $options: 'i' } },
        { contact_number: { $regex: q, $options: 'i' } },
        { b_form: { $regex: q, $options: 'i' } },
        { 'parents_cnic.father_cnic': { $regex: q, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const isMinimal = req.query.minimal === 'true';
    const isCard = req.query.cardView === 'true';
    const isFull = req.query.full === 'true';
    const query = Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    if (isMinimal) {
      query.select('name gr_number father_name current_grade current_section photo_url campus_id createdAt')
        .populate('current_grade', 'name sections')
        .populate('campus_id', 'name');
    } else if (isCard) {
      query.select('name gr_number father_name current_grade current_section photo_url campus_id date_of_admission admission_date parent_phone contact_number status emergency_contact_no b_form parents_cnic blood_group dob createdAt')
        .populate('current_grade', 'name')
        .populate('campus_id', 'name');
    } else if (isFull) {
      query.populate('campus_id', 'name address contact_number email website logo')
        .populate('school_id', 'name school_type logo_url slogan contact_number address website affiliation_number')
        .populate('current_grade', 'name sections')
        .populate('subjects', 'name code');
    } else {
      query.select('name father_name surname family_number gr_number admission_date current_grade current_section contact_number monthly_fee discount status photo_url campus_id gender dob b_form emergency_contact_no parents_cnic mother_guardian_name address createdAt')
        .populate('campus_id', 'name address contact_number')
        .populate('current_grade', 'name sections');
    }

    if (isCard || isMinimal) {
      const [totalCount, students] = await Promise.all([
        Student.countDocuments(filter),
        query.lean()
      ]);
      const totalPages = Math.ceil(totalCount / limitNum) || 1;
      return res.status(200).json({
        success: true,
        students,
        totalCount,
        totalPages,
        currentPage: pageNum,
        pagination: { total: totalCount, totalPages, page: pageNum, limit: limitNum }
      });
    }

    const baseScope = { school_id: schoolId };
    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) baseScope.campus_id = campus_id;
    if (grade_id && grade_id !== 'all' && mongoose.Types.ObjectId.isValid(grade_id)) baseScope.current_grade = grade_id;

    const [totalCount, activeCount, leftCount, discountCount, students] = await Promise.all([
      Student.countDocuments(filter),
      Student.countDocuments({ ...baseScope, status: { $regex: '^active$', $options: 'i' } }),
      Student.countDocuments({ ...baseScope, status: { $in: [/^inactive$/i, /^suspended$/i, /^left$/i, 'Inactive', 'Suspended', 'Left'] } }),
      Student.countDocuments({ ...baseScope, discount: { $gt: 0 } }),
      query.lean()
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    res.status(200).json({
      success: true,
      students,
      totalCount,
      totalPages,
      currentPage: pageNum,
      kpis: {
        total: totalCount,
        active: activeCount,
        left: leftCount,
        withDiscount: discountCount
      },
      pagination: { total: totalCount, totalPages, page: pageNum, limit: limitNum }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const student = await Student.findOne({ _id: req.params.id, school_id: schoolId })
      .populate('campus_id', 'name address contact_number email website logo')
      .populate('school_id', 'name school_type logo_url slogan contact_number address website affiliation_number')
      .populate('current_grade', 'name sections')
      .populate('grade_admitted', 'name sections')
      .populate('subjects', 'name code');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student profile', error: error.message });
  }
};

const getNextFamilyNumber = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const nextFamilyNumber = await generateNextFamilyNumber(schoolId);
    res.status(200).json({ success: true, family_number: nextFamilyNumber });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate family number', error: error.message });
  }
};

module.exports = { getStudents, getStudentById, getNextFamilyNumber };

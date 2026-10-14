const mongoose = require('mongoose');
const Student = require('../models/Student');
const { generateNextGrNumber } = require('../utils/grNumberGenerator');

const getStudents = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { page = 1, limit = 20, search, campus_id, grade_id, status } = req.query;
    const filter = { school_id: schoolId };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      filter.campus_id = campus_id;
    }
    if (grade_id && grade_id !== 'all' && mongoose.Types.ObjectId.isValid(grade_id)) {
      filter.current_grade = grade_id;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
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

    const [totalCount, students] = await Promise.all([
      Student.countDocuments(filter),
      Student.find(filter)
        .populate('campus_id', 'name')
        .populate('current_grade', 'name sections')
        .populate('subjects', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    res.status(200).json({
      success: true,
      students,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      currentPage: pageNum
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const student = await Student.findOne({ _id: req.params.id, school_id: schoolId })
      .populate('campus_id', 'name')
      .populate('current_grade', 'name sections')
      .populate('grade_admitted', 'name sections')
      .populate('subjects', 'name code');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student profile', error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { name, father_name, gr_number, campus_id, ...rest } = req.body;

    if (!name?.trim() || !father_name?.trim() || !campus_id) {
      return res.status(400).json({ message: 'Name, father name, and campus are required' });
    }

    const finalGr = gr_number?.trim() || (await generateNextGrNumber(schoolId));
    const student = await Student.create({
      ...rest,
      school_id: schoolId,
      campus_id,
      name: name.trim(),
      father_name: father_name.trim(),
      gr_number: finalGr
    });

    res.status(201).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;

    const student = await Student.findOneAndUpdate(
      { _id: id, school_id: schoolId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
};

module.exports = { getStudents, getStudentById, createStudent, updateStudent };

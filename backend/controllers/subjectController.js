const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Campus = require('../models/Campus');
const { findCodeCollision } = require('../utils/subjectIntegrityHelper');

const getSubjects = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id, search, class_name, stream, subject_type, page = 1, limit = 25 } = req.query;
    const filter = { school_id: schoolId };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) filter.campus_id = campus_id;
    if (class_name && class_name !== 'all') filter.classes = class_name;
    if (stream && stream !== 'all') filter.stream = stream;
    if (subject_type && subject_type !== 'all') filter.subject_type = subject_type;
    if (search?.trim()) {
      filter.$or = [{ name: { $regex: search.trim(), $options: 'i' } }, { code: { $regex: search.trim(), $options: 'i' } }];
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const [total, subjects] = await Promise.all([
      Subject.countDocuments(filter),
      Subject.find(filter)
        .populate('assigned_teacher', 'name email designation employee_code')
        .populate('campus_id', 'name code')
        .sort({ order: 1, createdAt: 1 })
        .skip(skip).limit(parseInt(limit)).lean()
    ]);

    res.status(200).json({ success: true, subjects, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) || 1 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { name, code, campus_id, status = 'Active', mandatory = true, subject_type, stream = 'General', elective_group = '', assigned_teacher, periods_per_week = 5, theory_marks = 75, practical_marks = 0, order, classes = [] } = req.body;
    if (!name?.trim() || !code?.trim()) return res.status(400).json({ message: 'Subject name and code are required' });

    let campusRef = null;
    if (campus_id && mongoose.Types.ObjectId.isValid(campus_id)) {
      const campus = await Campus.findOne({ _id: campus_id, school_id: schoolId }).select('_id').lean();
      if (campus) campusRef = campus._id;
    }

    const collision = await findCodeCollision(schoolId, code, null, campusRef);
    if (collision) {
      return res.status(409).json({
        message: `Subject code "${code.trim().toUpperCase()}" is already used by "${collision.existing.name}".`,
        suggested_code: collision.suggested_code
      });
    }

    const count = await Subject.countDocuments({ school_id: schoolId });
    const isMandatory = mandatory !== undefined ? Boolean(mandatory) : subject_type !== 'Elective';

    const subject = await Subject.create({
      school_id: schoolId, campus_id: campusRef, name: name.trim(), code: code.trim().toUpperCase(),
      status: ['Active', 'Inactive'].includes(status) ? status : 'Active', mandatory: isMandatory,
      subject_type: subject_type || (isMandatory ? 'Compulsory' : 'Elective'), stream: stream || 'General',
      elective_group: elective_group?.trim() || '',
      assigned_teacher: assigned_teacher && mongoose.Types.ObjectId.isValid(assigned_teacher) ? assigned_teacher : null,
      periods_per_week: Number(periods_per_week) || 5, theory_marks: Number(theory_marks) || 0,
      practical_marks: Number(practical_marks) || 0, order: order !== undefined ? Number(order) : count + 1,
      classes: Array.isArray(classes) ? classes : []
    });

    const populated = await Subject.findById(subject._id).populate('assigned_teacher', 'name email designation employee_code').populate('campus_id', 'name code').lean();
    res.status(201).json({ success: true, subject: populated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subject', error: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const b = req.body;
    const update = {};
    if (b.name !== undefined) update.name = b.name.trim();
    if (b.code !== undefined) {
      const collision = await findCodeCollision(schoolId, b.code, id, b.campus_id);
      if (collision) {
        return res.status(409).json({
          message: `Subject code "${b.code.trim().toUpperCase()}" is already used by "${collision.existing.name}".`,
          suggested_code: collision.suggested_code
        });
      }
      update.code = b.code.trim().toUpperCase();
    }
    if (b.status !== undefined) update.status = b.status;
    if (b.mandatory !== undefined) {
      update.mandatory = Boolean(b.mandatory);
      if (!b.subject_type) update.subject_type = Boolean(b.mandatory) ? 'Compulsory' : 'Elective';
    }
    if (b.subject_type !== undefined) update.subject_type = b.subject_type;
    if (b.stream !== undefined) update.stream = b.stream;
    if (b.elective_group !== undefined) update.elective_group = b.elective_group.trim();
    if (b.assigned_teacher !== undefined) update.assigned_teacher = mongoose.Types.ObjectId.isValid(b.assigned_teacher) ? b.assigned_teacher : null;
    ['periods_per_week', 'theory_marks', 'practical_marks', 'order'].forEach((k) => {
      if (b[k] !== undefined) update[k] = Number(b[k]);
    });
    if (b.classes && Array.isArray(b.classes)) update.classes = b.classes;
    if (b.campus_id !== undefined) update.campus_id = mongoose.Types.ObjectId.isValid(b.campus_id) ? b.campus_id : null;

    const subject = await Subject.findOneAndUpdate({ _id: id, school_id: schoolId }, update, { new: true, runValidators: true })
      .populate('assigned_teacher', 'name email designation employee_code')
      .populate('campus_id', 'name code').lean();
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update subject', error: error.message });
  }
};

module.exports = { getSubjects, createSubject, updateSubject };

const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Campus = require('../models/Campus');

const getSubjects = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { campus_id, search, class_name, page = 1, limit = 10 } = req.query;
    const filter = { school_id: schoolId };

    if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
      filter.campus_id = campus_id;
    }
    if (class_name && class_name !== 'all') {
      filter.classes = class_name;
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [{ name: { $regex: q, $options: 'i' } }, { code: { $regex: q, $options: 'i' } }];
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const [total, subjects] = await Promise.all([
      Subject.countDocuments(filter),
      Subject.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
    ]);

    res.status(200).json({
      success: true,
      subjects,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)) || 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { name, code, campus_id, status = 'Active', mandatory = true, classes = [] } = req.body;

    if (!name?.trim() || !code?.trim()) {
      return res.status(400).json({ message: 'Subject name and code are required' });
    }

    let campusRef = null;
    if (campus_id && mongoose.Types.ObjectId.isValid(campus_id)) {
      const campus = await Campus.findOne({ _id: campus_id, school_id: schoolId });
      if (campus) campusRef = campus._id;
    }

    const subject = await Subject.create({
      school_id: schoolId,
      campus_id: campusRef,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      status: ['Active', 'Inactive'].includes(status) ? status : 'Active',
      mandatory: Boolean(mandatory),
      classes: Array.isArray(classes) ? classes : []
    });

    res.status(201).json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subject', error: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { id } = req.params;
    const { name, code, campus_id, status, mandatory, classes } = req.body;

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (code !== undefined) update.code = code.trim().toUpperCase();
    if (status !== undefined) update.status = status;
    if (mandatory !== undefined) update.mandatory = Boolean(mandatory);
    if (classes !== undefined && Array.isArray(classes)) update.classes = classes;
    if (campus_id !== undefined) {
      update.campus_id = mongoose.Types.ObjectId.isValid(campus_id) ? campus_id : null;
    }

    const subject = await Subject.findOneAndUpdate(
      { _id: id, school_id: schoolId },
      update,
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    res.status(200).json({ success: true, subject });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update subject', error: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete subject', error: error.message });
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };

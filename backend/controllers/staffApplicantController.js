const StaffApplicant = require('../models/StaffApplicant');
const { buildApplicantFilter } = require('./staffApplicantFilterHelper');
const { sanitizeApplicantPayload } = require('../utils/sanitizeData');
const { createSystemNotification } = require('../utils/notificationDispatcher');

const getApplicants = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { page = 1, limit = 20 } = req.query;
    const filter = buildApplicantFilter(req.query, schoolId);
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [totalCount, applicants] = await Promise.all([
      StaffApplicant.countDocuments(filter),
      StaffApplicant.find(filter)
        .populate('campus_id', 'name')
        .populate('replacement_staff', 'name basic_salary designation employee_code photo_url')
        .populate('converted_user_id', 'name employee_code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    res.status(200).json({
      success: true,
      applicants,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      currentPage: pageNum
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applicants', error: error.message });
  }
};

const getApplicantById = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const applicant = await StaffApplicant.findOne({ _id: req.params.id, school_id: schoolId })
      .populate('campus_id', 'name')
      .populate('replacement_staff', 'name basic_salary designation employee_code photo_url')
      .populate('converted_user_id', 'name employee_code');

    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.status(200).json({ success: true, applicant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applicant details', error: error.message });
  }
};

const createApplicant = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { name, ...rest } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Applicant name is required' });
    }

    const payload = sanitizeApplicantPayload({
      ...rest,
      name: name.trim(),
      school_id: schoolId
    });

    const applicant = await StaffApplicant.create(payload);
    createSystemNotification({
      school_id: schoolId,
      title: 'New Staff Applicant',
      message: `New applicant received: ${name.trim()} (${rest.applying_for_position || 'Staff'}).`,
      type: 'Admission',
      target_audience: 'Admins',
      action_url: '/admin/staff-applicants',
      created_by: req.user?._id || req.user?.id
    });
    res.status(201).json({ success: true, applicant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create applicant', error: error.message });
  }
};

const updateApplicant = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const cleanPayload = sanitizeApplicantPayload(req.body);
    const applicant = await StaffApplicant.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      cleanPayload,
      { new: true, runValidators: true }
    );

    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.status(200).json({ success: true, applicant });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update applicant', error: error.message });
  }
};

const deleteApplicant = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const applicant = await StaffApplicant.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    res.status(200).json({ success: true, message: 'Applicant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete applicant', error: error.message });
  }
};

module.exports = {
  getApplicants, getApplicantById, createApplicant, updateApplicant, deleteApplicant
};

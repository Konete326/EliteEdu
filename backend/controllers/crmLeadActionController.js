const CrmLead = require('../models/CrmLead');
const { createSystemNotification } = require('../utils/notificationDispatcher');

const calculateAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
  return Math.max(0, years);
};

const createLead = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const body = { ...req.body, school_id: schoolId, created_by: req.user?._id || req.user?.id };
    if (body.dob && !body.age) body.age = calculateAge(body.dob);

    const lead = await CrmLead.create(body);
    createSystemNotification({
      school_id: schoolId,
      campus_id: lead.campus_id,
      title: 'New Admission Inquiry',
      message: `Lead recorded for ${lead.student_name} (${lead.class_name || 'Inquiry'})`,
      type: 'CRM',
      target_audience: 'Admins',
      action_url: '/admin/crm/inquiries',
      created_by: req.user?._id || req.user?.id
    });
    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create lead', error: err.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.dob) body.age = calculateAge(body.dob);
    delete body.school_id;
    delete body._id;

    const lead = await CrmLead.findOneAndUpdate(
      { _id: req.params.id, school_id: req.user?.school_id },
      { $set: body },
      { new: true }
    );
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update lead', error: err.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await CrmLead.findOneAndDelete({ _id: req.params.id, school_id: req.user?.school_id });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete lead', error: err.message });
  }
};

const togglePin = async (req, res) => {
  try {
    const lead = await CrmLead.findOne({ _id: req.params.id, school_id: req.user?.school_id });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    lead.is_pinned = !lead.is_pinned;
    await lead.save();
    res.json({ success: true, is_pinned: lead.is_pinned });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle pin', error: err.message });
  }
};

const updateStage = async (req, res) => {
  try {
    const { lead_status } = req.body;
    const lead = await CrmLead.findOneAndUpdate(
      { _id: req.params.id, school_id: req.user?.school_id },
      { $set: { lead_status } },
      { new: true }
    );
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update pipeline stage', error: err.message });
  }
};

const addFollowUp = async (req, res) => {
  try {
    const { channel, outcome, notes, next_date, lead_status } = req.body;
    if (!notes?.trim()) return res.status(400).json({ success: false, message: 'Notes are required' });
    const lead = await CrmLead.findOne({ _id: req.params.id, school_id: req.user?.school_id });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const entry = {
      channel: channel || 'Call',
      outcome: outcome || 'Contacted',
      notes: notes.trim(),
      next_date: next_date || null,
      logged_by: req.user?._id || req.user?.id,
      logged_by_name: req.user?.name || 'Staff'
    };
    lead.follow_ups.push(entry);
    if (next_date) lead.next_follow_up = next_date;
    if (lead_status) lead.lead_status = lead_status;
    await lead.save();
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record follow-up', error: err.message });
  }
};

module.exports = { createLead, updateLead, deleteLead, togglePin, updateStage, addFollowUp };

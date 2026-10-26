const ChatConversation = require('../models/ChatConversation');
const User = require('../models/User');
const Student = require('../models/Student');
const Grade = require('../models/Grade');

const createGroup = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const campusId = req.user.campus_id;
    const { group_name, group_type = 'Custom_Group', grade_id, section = '', members = [], avatar_url = '' } = req.body;

    const participants = [
      {
        user_id: req.user.id,
        user_model: req.user.role === 'Student' ? 'Student' : 'User',
        name: req.user.name,
        role_label: req.user.designation || req.user.role || 'Admin',
        avatar_url: req.user.photo_url || ''
      }
    ];

    let finalName = group_name;

    if (group_type === 'Staff_Group') {
      finalName = group_name || 'All Faculty & Staff Group';
      const staff = await User.find({ school_id: schoolId, status: { $ne: 'Inactive' }, _id: { $ne: req.user.id } })
        .select('name role designation photo_url')
        .limit(200)
        .lean();
      staff.forEach((u) => {
        participants.push({
          user_id: u._id,
          user_model: 'User',
          name: u.name,
          role_label: u.designation || u.role || 'Staff',
          avatar_url: u.photo_url || ''
        });
      });
    } else if (group_type === 'Class_Group') {
      const gradeDoc = grade_id ? await Grade.findById(grade_id).select('name').lean() : null;
      finalName = group_name || `Class Broadcast: ${gradeDoc?.name || 'Class'} ${section || ''}`.trim();

      const sQuery = {
        school_id: schoolId,
        status: { $in: ['Active', 'active', 'Registered', 'registered'] }
      };

      const gradeConditions = [];
      if (grade_id) {
        gradeConditions.push({ current_grade: grade_id }, { grade_id: grade_id });
      }
      if (gradeDoc?.name) {
        const cleanName = String(gradeDoc.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const gRegex = new RegExp(`^${cleanName}$`, 'i');
        gradeConditions.push({ class_name: gRegex }, { grade_name: gRegex }, { grade: gRegex });
      }
      if (gradeConditions.length > 0) {
        sQuery.$or = gradeConditions;
      }

      if (section && String(section).trim()) {
        const cleanSec = String(section).trim().replace(/^Sec\s*/i, '');
        const secEsc = cleanSec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rawEsc = String(section).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        sQuery.current_section = new RegExp(`^(${rawEsc}|Sec\\s*${secEsc}|${secEsc})$`, 'i');
      }

      const students = await Student.find(sQuery).select('name photo_url current_section').limit(200).lean();
      students.forEach((s) => {
        participants.push({
          user_id: s._id,
          user_model: 'Student',
          name: s.name,
          role_label: `Student (${section || s.current_section || 'A'})`,
          avatar_url: s.photo_url || ''
        });
      });
    } else {
      members.forEach((m) => {
        if (m.user_id && String(m.user_id) !== String(req.user.id)) {
          participants.push({
            user_id: m.user_id,
            user_model: m.user_model || 'User',
            name: m.name,
            role_label: m.role_label || 'Member',
            avatar_url: m.avatar_url || ''
          });
        }
      });
    }

    const conversation = await ChatConversation.create({
      school_id: schoolId,
      campus_id: campusId,
      is_group: true,
      group_name: finalName || 'Untitled Group',
      avatar_url: avatar_url || '',
      group_type,
      grade_id: grade_id || null,
      section: section || '',
      created_by: req.user.id,
      participants
    });

    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create group', error: error.message });
  }
};

module.exports = { createGroup };

const mongoose = require('mongoose');
const CrmLead = require('../models/CrmLead');
const Student = require('../models/Student');
const { generateNextGrNumber } = require('../utils/grNumberGenerator');
const { generateNextFamilyNumber } = require('../utils/familyNumberGenerator');
const { ensureDefaultCampus } = require('../utils/defaultCampusHelper');
const { sanitizeStudentPayload } = require('../utils/sanitizeData');
const { createSystemNotification } = require('../utils/notificationDispatcher');

const convertLeadToStudent = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const lead = await CrmLead.findOne({ _id: req.params.id, school_id: schoolId });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    if (lead.is_converted) {
      return res.status(400).json({ success: false, message: 'Lead has already been converted to an enrolled student' });
    }

    let finalCampusId = lead.campus_id || req.body.campus_id;
    if (!finalCampusId) {
      const defCampus = await ensureDefaultCampus(schoolId);
      if (defCampus) finalCampusId = defCampus._id;
    }

    const finalGr = req.body.gr_number?.trim() || (await generateNextGrNumber(schoolId));
    const finalFamily = (await generateNextFamilyNumber(schoolId));
    const year = new Date().getFullYear();
    const finalSerial = `${year}-${finalGr}`;
    const cleanName = (lead.student_name || 'student').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
    const finalUsername = `${finalGr}${cleanName}`;
    const finalPassword = `Edu@${finalGr}`;

    const rawStudent = {
      school_id: schoolId,
      campus_id: finalCampusId,
      name: lead.student_name.trim(),
      father_name: (lead.father_name || 'N/A').trim(),
      surname: (lead.surname || '').trim(),
      current_grade: lead.grade_id || req.body.grade_id || null,
      grade_admitted: lead.grade_id || req.body.grade_id || null,
      current_section: req.body.section || 'A',
      section_admitted: req.body.section || 'A',
      gr_number: finalGr,
      family_number: finalFamily,
      serial_no: finalSerial,
      portal_username: finalUsername,
      portal_temp_password: finalPassword,
      gender: lead.gender ? (lead.gender.charAt(0).toUpperCase() + lead.gender.slice(1).toLowerCase()) : 'Male',
      dob: lead.dob || null,
      academic_session: lead.academic_session || '2026-2027',
      contact_number: lead.contact_number || '',
      email: lead.email || '',
      status: 'Active',
      admission_date: new Date(),
      address: {
        present_address: lead.additional_info?.address || '',
        permanent_address: lead.additional_info?.address || ''
      },
      mother_guardian_name: lead.additional_info?.mother_name || '',
      discount: lead.additional_info?.expected_discount || 0,
      documents: (lead.documents || []).map((d) => ({
        document_type: d.title || 'Other',
        document_url: d.file_url,
        uploaded_at: d.uploaded_at || new Date()
      }))
    };

    const newStudent = await Student.create(sanitizeStudentPayload(rawStudent));

    lead.is_converted = true;
    lead.lead_status = 'Enrolled';
    lead.converted_student_id = newStudent._id;
    lead.converted_at = new Date();
    await lead.save();

    createSystemNotification({
      school_id: schoolId,
      campus_id: finalCampusId,
      title: 'Lead Converted to Enrolled Student',
      message: `${lead.student_name} converted to Student with GR: ${finalGr}`,
      type: 'Admission',
      target_audience: 'Admins',
      action_url: `/admin/students`,
      created_by: req.user?._id || req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Lead converted to enrolled student successfully',
      lead,
      student: newStudent
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to convert lead', error: err.message });
  }
};

module.exports = { convertLeadToStudent };

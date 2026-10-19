const mongoose = require('mongoose');
const IssuedCertificate = require('../models/IssuedCertificate');
const Student = require('../models/Student');

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

const buildCertReports = async (schoolId, campusId, { sub_report, recipient_type, certificate_type, search }) => {
  const sId = new mongoose.Types.ObjectId(schoolId);
  const qBase = { school_id: sId };
  if (campusId && campusId !== 'all') qBase.$or = [{ campus_id: new mongoose.Types.ObjectId(campusId) }, { campus_id: null }];

  if (sub_report === 'school_leaving_certificates') {
    const q = { ...qBase, template_name: { $regex: /leaving|slc/i } };
    const certs = await IssuedCertificate.find(q).sort({ issue_date: -1 }).lean();
    const rows = certs.map((c, i) => ({
      sr: i + 1, id: c._id, cert_no: c.certificate_no, student_name: c.recipient_name,
      father_name: c.father_name || '—', gr_number: c.identifier_code || '—',
      leaving_class: c.class_or_designation || 'Class 10', issue_date: fmtDate(c.issue_date)
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'cert_no', label: 'Certificate #', visible: true },
      { key: 'student_name', label: 'Student Name', visible: true }, { key: 'father_name', label: 'Father Name', visible: true },
      { key: 'gr_number', label: 'GR #', visible: true }, { key: 'leaving_class', label: 'Class at Leaving', visible: true },
      { key: 'issue_date', label: 'Date of Issue', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'character_merit_certificates') {
    const q = { ...qBase, template_name: { $regex: /character|merit|appreciation|award|achievement/i } };
    const certs = await IssuedCertificate.find(q).sort({ issue_date: -1 }).lean();
    const rows = certs.map((c, i) => ({
      sr: i + 1, id: c._id, cert_no: c.certificate_no, recipient_name: c.recipient_name,
      recipient_type: c.recipient_type, award: c.template_name, issue_date: fmtDate(c.issue_date)
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'cert_no', label: 'Certificate #', visible: true },
      { key: 'recipient_name', label: 'Recipient Name', visible: true }, { key: 'recipient_type', label: 'Type', visible: true },
      { key: 'award', label: 'Award Title', visible: true }, { key: 'issue_date', label: 'Date of Issue', visible: true }
    ];
    return { columns, rows };
  }

  if (sub_report === 'missing_student_documents') {
    const students = await Student.find(qBase).populate('current_grade', 'name').lean();
    const missingList = students.filter((s) => !s.b_form_number || !s.photo_url || !s.father_cnic);
    const rows = missingList.map((s, i) => ({
      sr: i + 1, id: s._id, gr_number: s.gr_number || '—', student_name: s.name,
      class_name: s.current_grade?.name || 'Class',
      missing_bform: !s.b_form_number ? 'Missing' : 'Provided',
      missing_photo: !s.photo_url ? 'Missing' : 'Uploaded',
      missing_father_cnic: !s.father_cnic ? 'Missing' : 'Provided',
      phone: s.parent_phone || s.guardian_phone || '—'
    }));
    const columns = [
      { key: 'sr', label: '#', visible: true }, { key: 'gr_number', label: 'GR #', visible: true },
      { key: 'student_name', label: 'Student Name', visible: true }, { key: 'class_name', label: 'Class', visible: true },
      { key: 'missing_bform', label: 'B-Form / CNIC', visible: true }, { key: 'missing_photo', label: 'Photo Avatar', visible: true },
      { key: 'missing_father_cnic', label: 'Father CNIC', visible: true }, { key: 'phone', label: 'Guardian Phone', visible: true }
    ];
    return { columns, rows };
  }

  const q = { ...qBase };
  if (recipient_type && recipient_type !== 'all') q.recipient_type = recipient_type;
  if (certificate_type && certificate_type !== 'all') q.template_name = certificate_type;
  const certs = await IssuedCertificate.find(q).sort({ issue_date: -1 }).limit(200).lean();
  const rows = certs.map((c, i) => ({
    sr: i + 1, id: c._id, cert_no: c.certificate_no, template_name: c.template_name,
    recipient: c.recipient_name, type: c.recipient_type, class_or_desig: c.class_or_designation || '—',
    issue_date: fmtDate(c.issue_date)
  }));
  const columns = [
    { key: 'sr', label: '#', visible: true }, { key: 'cert_no', label: 'Certificate #', visible: true },
    { key: 'template_name', label: 'Template', visible: true }, { key: 'recipient', label: 'Recipient Name', visible: true },
    { key: 'type', label: 'Role', visible: true }, { key: 'class_or_desig', label: 'Class / Desig', visible: true },
    { key: 'issue_date', label: 'Issue Date', visible: true }
  ];
  return { columns, rows };
};

module.exports = { buildCertReports };

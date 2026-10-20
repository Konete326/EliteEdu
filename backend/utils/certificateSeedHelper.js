const CertificateTemplate = require('../models/CertificateTemplate');

const DEFAULT_TEMPLATES = [
  {
    name: 'Pre & Primary Teacher Training Certificate',
    recipient_type: 'Staff',
    heading: 'Certificate in Pre & Primary Teacher Training',
    sub_heading: 'THIS CERTIFICATE IS PRESENTED TO',
    body_template: 'for successfully completing the specialized professional development course in {{custom_text}} (120 hrs / 6 Months). S/D/W of {{father_name}}, bearing Employee Code {{employee_code}}, serving with distinction at {{school_name}}.',
    design_style: 'academic_gold_hatch',
    orientation: 'landscape',
    accent_color: '#b59449',
    is_default: true
  },
  {
    name: 'Teaching Experience Certificate',
    recipient_type: 'Staff',
    heading: 'CERTIFICATE OF EXPERIENCE',
    sub_heading: 'THIS CERTIFICATE IS PRESENTED TO',
    body_template: 'This certificate is proudly awarded to {{name}} S/D/W of {{father_name}} ({{designation}}) for exemplary teaching service, scholarly devotion, and extraordinary contributions during the academic session at {{school_name}} ({{custom_text}}).',
    design_style: 'floral_corner_filigree',
    orientation: 'landscape',
    accent_color: '#f59e0b',
    is_default: false
  },
  {
    name: 'Teacher of the Year Award',
    recipient_type: 'Staff',
    heading: 'TEACHER OF THE YEAR CERTIFICATE',
    sub_heading: 'THIS CERTIFICATE IS PROUDLY PRESENTED TO',
    body_template: 'Awarded for exceptional leadership in educational reform, pedagogy, and outstanding contributions to curriculum development. {{name}} ({{designation}}) has been instrumental in implementing innovative teaching methods that have significantly improved learning outcomes ({{custom_text}}).',
    design_style: 'guilloche_rosette_burgundy',
    orientation: 'landscape',
    accent_color: '#8c3b32',
    is_default: false
  },
  {
    name: 'Top-Performing Champion Award',
    recipient_type: 'Both',
    heading: 'The Top-Performing Champion Award',
    sub_heading: 'THIS CERTIFICATE ACKNOWLEDGES THAT',
    body_template: 'has been awarded the prestigious title of The Top-Performing Champion at {{school_name}}. In recognition of their outstanding dedication, passion, and pursuit of scholastic excellence in {{custom_text}}.',
    design_style: 'navy_ribbon_halftone',
    orientation: 'landscape',
    accent_color: '#051937',
    is_default: false
  },
  {
    name: 'School Leaving Certificate',
    recipient_type: 'Student',
    heading: 'SCHOOL LEAVING CERTIFICATE',
    sub_heading: 'THIS IS TO CERTIFY THAT',
    body_template: '{{name}} S/D of {{father_name}}, bearing General Register (G.R) No. {{gr_number}}, was a bonafide student of this institution in Class {{class_name}} (Section {{section}}). According to school records, their date of birth is {{dob}}. Their conduct during their period of study was satisfactory. Reason for leaving: {{custom_text}}.',
    design_style: 'academic_gold_hatch',
    orientation: 'landscape',
    accent_color: '#b59449',
    is_default: false
  },
  {
    name: 'Merit & Scholastic Excellence',
    recipient_type: 'Student',
    heading: 'CERTIFICATE OF MERIT & EXCELLENCE',
    sub_heading: 'PRESENTED IN RECOGNITION OF',
    body_template: 'This certificate is proudly awarded to {{name}} S/D of {{father_name}} of Class {{class_name}} (Section {{section}}) for demonstrating {{custom_text}} and securing distinguished academic standing in the annual examinations.',
    design_style: 'guilloche_rosette_burgundy',
    orientation: 'landscape',
    accent_color: '#8c3b32',
    is_default: false
  },
  {
    name: 'Character & Bonafide Certificate',
    recipient_type: 'Student',
    heading: 'BONAFIDE & CHARACTER CERTIFICATE',
    sub_heading: 'TO WHOM IT MAY CONCERN',
    body_template: 'This is to certify that {{name}} S/D of {{father_name}}, GR No. {{gr_number}}, is a regular student studying in Class {{class_name}}, Section {{section}} at {{school_name}}. They bear an exemplary moral character, high discipline, and dedication ({{custom_text}}).',
    design_style: 'floral_corner_filigree',
    orientation: 'landscape',
    accent_color: '#f59e0b',
    is_default: false
  },
  {
    name: 'Perfect Attendance Certificate',
    recipient_type: 'Student',
    heading: 'PERFECT ATTENDANCE CERTIFICATE',
    sub_heading: 'HONORING PUNCTUALITY & COMMITMENT',
    body_template: 'Awarded to {{name}} S/D of {{father_name}} of Class {{class_name}} in recognition of achieving 100% punctuality and perfect attendance throughout the academic term. Their unwavering consistency and presence exemplifies student discipline ({{custom_text}}).',
    design_style: 'navy_ribbon_halftone',
    orientation: 'landscape',
    accent_color: '#051937',
    is_default: false
  }
];

const ensureDefaultTemplates = async (schoolId) => {
  const count = await CertificateTemplate.countDocuments({ school_id: schoolId });
  if (count === 0) {
    const docs = DEFAULT_TEMPLATES.map((t) => ({ ...t, school_id: schoolId }));
    await CertificateTemplate.insertMany(docs);
  } else {
    const hasNewStyles = await CertificateTemplate.exists({
      school_id: schoolId,
      design_style: { $in: ['academic_gold_hatch', 'floral_corner_filigree', 'guilloche_rosette_burgundy', 'navy_ribbon_halftone'] }
    });
    if (!hasNewStyles) {
      const docs = DEFAULT_TEMPLATES.map((t) => ({ ...t, school_id: schoolId }));
      await CertificateTemplate.insertMany(docs);
    }
  }
};

module.exports = { ensureDefaultTemplates, DEFAULT_TEMPLATES };

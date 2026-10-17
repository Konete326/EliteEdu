const CertificateTemplate = require('../models/CertificateTemplate');

const DEFAULT_TEMPLATES = [
  {
    name: 'School Leaving Certificate',
    recipient_type: 'Student',
    heading: 'SCHOOL LEAVING CERTIFICATE',
    sub_heading: 'THIS IS TO CERTIFY THAT',
    body_template: '{{name}} S/D of {{father_name}}, bearing General Register (G.R) No. {{gr_number}}, was a bonafide student of this institution in Class {{class_name}} (Section {{section}}). According to school records, their date of birth is {{dob}}. Their conduct and general behavior during their period of study was satisfactory. They are leaving the institution on account of {{custom_text}}.',
    design_style: 'classic_academic',
    accent_color: '#0d9488',
    is_default: true
  },
  {
    name: 'Character Certificate',
    recipient_type: 'Student',
    heading: 'CHARACTER CERTIFICATE',
    sub_heading: 'TO WHOM IT MAY CONCERN',
    body_template: 'This is to certify that {{name}} S/D of {{father_name}}, resident of this locality, is known to the administration as a student of Class {{class_name}}. They bear an exemplary moral character and pleasant disposition. They took active part in academic and co-curricular activities, demonstrating high discipline and dedication ({{custom_text}}). We wish them success in all future pursuits.',
    design_style: 'royal_gold',
    accent_color: '#b45309',
    is_default: false
  },
  {
    name: 'Bonafide / Study Certificate',
    recipient_type: 'Student',
    heading: 'BONAFIDE CERTIFICATE',
    sub_heading: 'THIS IS TO CERTIFY THAT',
    body_template: '{{name}} S/D of {{father_name}}, GR No. {{gr_number}}, is a regular student studying in Class {{class_name}}, Section {{section}} at {{school_name}} during the current academic session. This certificate is issued upon request for {{custom_text}}.',
    design_style: 'minimal_corporate',
    accent_color: '#2563eb',
    is_default: false
  },
  {
    name: 'Merit / Outstanding Performance Award',
    recipient_type: 'Student',
    heading: 'CERTIFICATE OF MERIT & EXCELLENCE',
    sub_heading: 'PRESENTED IN RECOGNITION OF',
    body_template: 'This certificate is proudly awarded to {{name}} S/D of {{father_name}} of Class {{class_name}} for demonstrating {{custom_text}} and securing distinguished academic standing in the annual examinations. Their commitment to scholarly brilliance and leadership is truly commendable.',
    design_style: 'royal_gold',
    accent_color: '#d97706',
    is_default: false
  },
  {
    name: '100% Attendance Award',
    recipient_type: 'Student',
    heading: 'PERFECT ATTENDANCE CERTIFICATE',
    sub_heading: 'HONORING PUNCTUALITY & COMMITMENT',
    body_template: 'Awarded to {{name}} S/D of {{father_name}} of Class {{class_name}} in recognition of achieving 100% punctuality and perfect attendance throughout the academic term. Their unwavering consistency and presence exemplifies student discipline ({{custom_text}}).',
    design_style: 'emerald_modern',
    accent_color: '#059669',
    is_default: false
  },
  {
    name: 'Sports & Co-Curricular Excellence',
    recipient_type: 'Student',
    heading: 'CERTIFICATE OF SPORTS ACHIEVEMENT',
    sub_heading: 'PROUDLY PRESENTED TO',
    body_template: 'Presented to {{name}} S/D of {{father_name}} in recognition of exceptional athletic talent, sportsmanship, and victorious contribution in {{custom_text}} representing {{school_name}} with distinction.',
    design_style: 'ribbon_prestigious',
    accent_color: '#dc2626',
    is_default: false
  },
  {
    name: 'Staff Experience Certificate',
    recipient_type: 'Staff',
    heading: 'EXPERIENCE & SERVICE CERTIFICATE',
    sub_heading: 'TO WHOM IT MAY CONCERN',
    body_template: 'This is to certify that {{name}} S/D/W of {{father_name}}, bearing Employee Code {{employee_code}}, served at {{school_name}} as {{designation}} ({{bps_grade}}). During their tenure, they discharged their professional duties with utmost diligence, dedication, and integrity. We appreciate their valuable contributions and wish them success in their future career.',
    design_style: 'minimal_corporate',
    accent_color: '#475569',
    is_default: false
  },
  {
    name: 'Best Teacher Appreciation Certificate',
    recipient_type: 'Staff',
    heading: 'EXEMPLARY EDUCATOR AWARD',
    sub_heading: 'FOR INSPIRATIONAL TEACHING & LEADERSHIP',
    body_template: 'In grateful appreciation of outstanding pedagogical dedication, mentorship, and extraordinary service rendered by {{name}} ({{designation}}). Your passion for education and commitment to nurturing students has made a profound impact on the institution ({{custom_text}}).',
    design_style: 'ribbon_prestigious',
    accent_color: '#7c3aed',
    is_default: false
  }
];

const ensureDefaultTemplates = async (schoolId) => {
  const count = await CertificateTemplate.countDocuments({ school_id: schoolId });
  if (count === 0) {
    const docs = DEFAULT_TEMPLATES.map((t) => ({ ...t, school_id: schoolId }));
    await CertificateTemplate.insertMany(docs);
  }
};

module.exports = { ensureDefaultTemplates, DEFAULT_TEMPLATES };

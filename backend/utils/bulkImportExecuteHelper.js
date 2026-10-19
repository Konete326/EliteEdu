const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const User = require('../models/User');
const CrmLead = require('../models/CrmLead');
const QuestionBank = require('../models/QuestionBank');
const StoreItem = require('../models/StoreItem');
const { generateNextGrNumber } = require('./grNumberGenerator');
const { generateNextEmployeeCode } = require('./employeeCodeGenerator');

const commitBulkRows = async (entityType, validRows, { schoolId, campusId, userId }) => {
  const dataRows = validRows.map((r) => r.data || r);
  if (dataRows.length === 0) return { insertedCount: 0 };

  if (entityType === 'students') {
    let nextGr = Number(await generateNextGrNumber(schoolId));
    const docs = dataRows.map((r) => ({
      school_id: schoolId, campus_id: campusId || null,
      name: String(r.name).trim(), father_name: String(r.father_name || '').trim(),
      gender: r.gender || 'Male', dob: r.dob ? new Date(r.dob) : null,
      contact_number: r.contact_number || '', father_details: { contact_number: r.father_contact || r.contact_number || '' },
      current_grade: r.grade_id, current_section: (r.section || 'A').trim().toUpperCase(),
      monthly_fee: Number(r.monthly_fee) || 0, admission_date: r.admission_date ? new Date(r.admission_date) : new Date(),
      religion: r.religion || 'Islam', b_form: r.b_form || '', gr_number: r.gr_number ? String(r.gr_number).trim() : String(nextGr++)
    }));
    const result = await Student.insertMany(docs, { ordered: false });
    return { insertedCount: result.length };
  }

  if (entityType === 'teachers') {
    const hashedPassword = await bcrypt.hash('EliteEdu@123', 10);
    const docs = await Promise.all(dataRows.map(async (r) => ({
      school_id: schoolId, campus_id: campusId || null, assigned_campuses: campusId ? [campusId] : [],
      role: 'Teacher', name: String(r.name).trim(), father_name: String(r.father_name || '').trim(),
      email: String(r.email).toLowerCase().trim(), password: hashedPassword, contact_number: r.contact_number || '',
      designation: r.designation || 'Teacher', bps_grade: r.bps_grade || '', basic_salary: Number(r.basic_salary) || 0,
      cnic: r.cnic || '', joining_date: r.joining_date ? new Date(r.joining_date) : new Date(),
      employee_code: r.employee_code || await generateNextEmployeeCode(schoolId)
    })));
    const result = await User.insertMany(docs, { ordered: false });
    return { insertedCount: result.length };
  }

  if (entityType === 'crm_leads') {
    const docs = dataRows.map((r) => ({
      school_id: schoolId, campus_id: campusId || null, student_name: String(r.student_name).trim(),
      father_name: String(r.father_name || '').trim(), contact_number: String(r.contact_number).trim(),
      grade_id: r.grade_id || null, class_name: r.class_name || '', lead_source: r.lead_source || 'Walk-in',
      priority: r.priority || 'Medium', message: r.notes || ''
    }));
    const result = await CrmLead.insertMany(docs, { ordered: false });
    return { insertedCount: result.length };
  }

  if (entityType === 'questions') {
    const docs = dataRows.map((r) => ({
      school_id: schoolId, grade_id: r.grade_id, subject_id: r.subject_id,
      question_type: r.question_type || 'MCQ', difficulty: r.difficulty || 'Medium',
      marks: Number(r.marks) || 1, question_text: String(r.question_text).trim(),
      options: [r.option_a, r.option_b, r.option_c, r.option_d].filter(Boolean).map(String),
      correct_answer: String(r.correct_answer || '').trim(), created_by: userId || null
    }));
    const result = await QuestionBank.insertMany(docs, { ordered: false });
    return { insertedCount: result.length };
  }

  if (entityType === 'store_items') {
    const docs = dataRows.map((r) => ({
      school_id: schoolId, campus_id: campusId || null, item_code: String(r.item_code).trim(),
      sku: String(r.item_code).trim(), name: String(r.name).trim(), category: r.category || 'Other',
      cost_price: Number(r.cost_price) || 0, sale_price: Number(r.sale_price) || 0, stock_qty: Number(r.stock_qty) || 0
    }));
    const result = await StoreItem.insertMany(docs, { ordered: false });
    return { insertedCount: result.length };
  }

  return { insertedCount: 0 };
};

module.exports = { commitBulkRows };

const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const User = require('../models/User');
const CrmLead = require('../models/CrmLead');
const QuestionBank = require('../models/QuestionBank');
const Subject = require('../models/Subject');
const AccountTransaction = require('../models/AccountTransaction');
const Notification = require('../models/Notification');

const executeBatchCommit = async (req, res) => {
  try {
    const { entity, rows = [], campus_id } = req.body;
    const validRows = rows.filter((r) => r.isValid !== false).map((r) => r.data || r);

    if (validRows.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rows to import' });
    }

    const schoolId = req.schoolId;
    const campusId = campus_id || null;
    let imported = 0;

    if (entity === 'students') {
      const docs = validRows.map((r) => ({
        school_id: schoolId, campus_id: campusId, gr_number: r.gr_number.trim(),
        name: r.name.trim(), father_name: r.father_name.trim(), current_grade: r.grade_id,
        current_section: (r.section || 'A').trim(), gender: r.gender || 'Male',
        contact_number: r.contact_number || '', email: r.email || '', transport_route: r.transport_route || ''
      }));
      const result = await Student.insertMany(docs, { ordered: false });
      imported = result.length;
    } else if (entity === 'teachers') {
      const hashed = await bcrypt.hash('EliteEdu@123', 10);
      const docs = validRows.map((r) => ({
        school_id: schoolId, campus_id: campusId, role: 'Teacher', name: r.name.trim(),
        email: r.email.toLowerCase().trim(), password: hashed, contact_number: r.contact_number || '',
        gender: r.gender || 'Male', designation: r.designation || 'Teacher', department: r.department || 'Academics',
        qualification: r.qualification || 'Graduate'
      }));
      const result = await User.insertMany(docs, { ordered: false });
      imported = result.length;
    } else if (entity === 'crm_leads') {
      const docs = validRows.map((r) => ({
        school_id: schoolId, student_name: r.student_name.trim(), parent_name: r.parent_name.trim(),
        phone: r.phone.trim(), email: r.email || '', grade_id: r.grade_id || null,
        source: r.source || 'Bulk Import', status: r.status || 'New'
      }));
      const result = await CrmLead.insertMany(docs, { ordered: false });
      imported = result.length;
    } else if (entity === 'questions') {
      const docs = validRows.map((r) => ({
        school_id: schoolId, question_text: r.question_text.trim(), question_type: r.question_type || 'Short',
        grade_id: r.grade_id, correct_answer: r.correct_answer || '', marks: Number(r.marks) || 1, difficulty: r.difficulty || 'Medium'
      }));
      const result = await QuestionBank.insertMany(docs, { ordered: false });
      imported = result.length;
    } else if (entity === 'subjects') {
      const docs = validRows.map((r) => ({
        school_id: schoolId, campus_id: campusId, name: r.name.trim(), code: r.code.trim(),
        grade_id: r.grade_id, category: r.category || 'Core', passing_marks: Number(r.passing_marks) || 33, total_marks: Number(r.total_marks) || 100
      }));
      const result = await Subject.insertMany(docs, { ordered: false });
      imported = result.length;
    } else if (entity === 'account_transactions') {
      const docs = validRows.map((r) => ({
        school_id: schoolId, type: r.type || 'Expense', amount: Number(r.amount) || 0,
        payment_method: r.payment_method || 'Cash', date: r.date ? new Date(r.date) : new Date(), description: r.description || 'Bulk Import'
      }));
      const result = await AccountTransaction.insertMany(docs, { ordered: false });
      imported = result.length;
    }

    await Notification.create({
      school_id: schoolId,
      title: `Bulk Migration Completed: ${entity}`,
      message: `Successfully batch committed ${imported} ${entity} records into the database.`,
      target_type: 'All_Admins',
      created_by: req.user?.id || null
    }).catch(() => {});

    res.status(200).json({
      success: true,
      importedCount: imported,
      failedCount: validRows.length - imported,
      message: `Successfully committed ${imported} ${entity} records`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { executeBatchCommit };

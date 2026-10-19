const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
const User = require('../models/User');
const StoreItem = require('../models/StoreItem');

const REQUIRED_FIELDS = {
  students: ['name', 'class_name'],
  teachers: ['name', 'email', 'contact_number'],
  crm_leads: ['student_name', 'contact_number'],
  questions: ['class_name', 'subject_name', 'question_text'],
  store_items: ['item_code', 'name', 'sale_price', 'stock_qty']
};

const validateBulkRows = async (entityType, rows, schoolId) => {
  const required = REQUIRED_FIELDS[entityType] || [];
  const [grades, subjects] = await Promise.all([
    Grade.find({ school_id: schoolId }).select('_id name').lean(),
    Subject.find({ school_id: schoolId }).select('_id name grade_id').lean()
  ]);

  const gradeMap = new Map(grades.map((g) => [g.name.toLowerCase().trim(), g._id]));
  const subjectMap = new Map(subjects.map((s) => [s.name.toLowerCase().trim(), s]));

  let existingEmails = new Set();
  let existingItemCodes = new Set();
  if (entityType === 'teachers') {
    const users = await User.find({ email: { $ne: null } }).select('email').lean();
    users.forEach((u) => u.email && existingEmails.add(u.email.toLowerCase().trim()));
  } else if (entityType === 'store_items') {
    const items = await StoreItem.find({ school_id: schoolId }).select('item_code').lean();
    items.forEach((i) => i.item_code && existingItemCodes.add(i.item_code.toLowerCase().trim()));
  }

  const seenInBatch = new Set();
  const validRows = [];
  const invalidRows = [];

  rows.forEach((raw, idx) => {
    const row = { ...raw };
    const errors = [];

    required.forEach((f) => {
      if (!row[f] || String(row[f]).trim() === '') {
        errors.push(`Missing required field '${f}'`);
      }
    });

    if (row.class_name) {
      const gid = gradeMap.get(String(row.class_name).toLowerCase().trim());
      if (gid) {
        row.grade_id = gid;
      } else {
        errors.push(`Class '${row.class_name}' does not exist in active grades`);
      }
    }

    if (row.subject_name) {
      const sub = subjectMap.get(String(row.subject_name).toLowerCase().trim());
      if (sub) {
        row.subject_id = sub._id;
        if (!row.grade_id && sub.grade_id) row.grade_id = sub.grade_id;
      } else {
        errors.push(`Subject '${row.subject_name}' does not exist in curriculum`);
      }
    }

    if (entityType === 'teachers' && row.email) {
      const emailLower = String(row.email).toLowerCase().trim();
      if (existingEmails.has(emailLower)) errors.push(`Email '${row.email}' already registered`);
      if (seenInBatch.has(emailLower)) errors.push(`Duplicate email '${row.email}' in batch`);
      seenInBatch.add(emailLower);
    }

    if (entityType === 'store_items' && row.item_code) {
      const codeLower = String(row.item_code).toLowerCase().trim();
      if (existingItemCodes.has(codeLower)) errors.push(`Item Code '${row.item_code}' already exists`);
      if (seenInBatch.has(codeLower)) errors.push(`Duplicate Item Code '${row.item_code}' in batch`);
      seenInBatch.add(codeLower);
    }

    const evaluated = { rowIndex: idx + 1, data: row, errors, isValid: errors.length === 0 };
    if (evaluated.isValid) {
      validRows.push(evaluated);
    } else {
      invalidRows.push(evaluated);
    }
  });

  return {
    validRows,
    invalidRows,
    summary: {
      total: rows.length,
      validCount: validRows.length,
      errorCount: invalidRows.length
    }
  };
};

module.exports = { validateBulkRows };

const { ENTITY_SCHEMAS } = require('../utils/bulkMigrationSchemas');
const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const User = require('../models/User');
const CrmLead = require('../models/CrmLead');

const getMigrationTemplate = async (req, res) => {
  const { entity } = req.params;
  const schema = ENTITY_SCHEMAS[entity];
  if (!schema) return res.status(404).json({ success: false, message: 'Invalid entity type' });
  res.status(200).json({ success: true, entity, headers: schema.headers, samples: schema.samples });
};

const parseAndValidateBatch = async (req, res) => {
  try {
    const { entity, rows = [], campus_id } = req.body;
    const schema = ENTITY_SCHEMAS[entity];
    if (!schema) return res.status(400).json({ success: false, message: 'Unsupported entity' });

    const grades = await Grade.find({ school_id: req.schoolId }).select('_id name code').lean();
    const gradeMap = new Map(grades.map((g) => [g.name.toLowerCase().trim(), g._id]));

    let existingSet = new Set();
    if (entity === 'students') {
      const studs = await Student.find({ school_id: req.schoolId }).select('gr_number').lean();
      studs.forEach((s) => s.gr_number && existingSet.add(s.gr_number.toLowerCase().trim()));
    } else if (entity === 'teachers') {
      const users = await User.find({ email: { $ne: null } }).select('email').lean();
      users.forEach((u) => u.email && existingSet.add(u.email.toLowerCase().trim()));
    } else if (entity === 'subjects') {
      const subs = await Subject.find({ school_id: req.schoolId }).select('code').lean();
      subs.forEach((s) => s.code && existingSet.add(s.code.toLowerCase().trim()));
    }

    const seenInBatch = new Set();
    const validatedRows = rows.map((raw, idx) => {
      const row = { ...raw };
      const errors = [];

      schema.required.forEach((f) => {
        if (!row[f] || String(row[f]).trim() === '') errors.push(`Missing required field '${f}'`);
      });

      if (row.grade_name) {
        const gid = gradeMap.get(String(row.grade_name).toLowerCase().trim());
        if (gid) row.grade_id = gid;
        else errors.push(`Grade '${row.grade_name}' not found in active school classes`);
      }

      const uniqueVal = (row.gr_number || row.email || row.code || '').toLowerCase().trim();
      if (uniqueVal) {
        if (existingSet.has(uniqueVal)) errors.push(`Value '${uniqueVal}' already exists in database`);
        if (seenInBatch.has(uniqueVal)) errors.push(`Duplicate '${uniqueVal}' found within uploaded batch`);
        seenInBatch.add(uniqueVal);
      }

      return { rowIndex: idx + 1, data: row, isValid: errors.length === 0, errors };
    });

    const validCount = validatedRows.filter((r) => r.isValid).length;
    res.status(200).json({
      success: true,
      totalRows: validatedRows.length,
      validCount,
      errorCount: validatedRows.length - validCount,
      rows: validatedRows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMigrationTemplate, parseAndValidateBatch };

const Notification = require('../models/Notification');
const { getEntityTemplate } = require('../utils/bulkImportTemplateHelper');
const { validateBulkRows } = require('../utils/bulkImportValidationHelper');
const { commitBulkRows } = require('../utils/bulkImportExecuteHelper');

const getTemplate = async (req, res) => {
  try {
    const { entityType } = req.params;
    const template = getEntityTemplate(entityType);
    if (!template) {
      return res.status(404).json({ success: false, message: `Template for '${entityType}' not found` });
    }
    res.status(200).json({ success: true, entityType, headers: template.headers, samples: template.samples });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const parseRows = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { entityType, rows = [], campus_id } = req.body;
    if (!entityType || !Array.isArray(rows)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: entityType and rows array required' });
    }

    const result = await validateBulkRows(entityType, rows, schoolId);
    res.status(200).json({ success: true, entityType, campus_id, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const executeImport = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { entityType, validRows = [], campus_id } = req.body;
    if (!entityType || !Array.isArray(validRows) || validRows.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rows to import' });
    }

    const { insertedCount } = await commitBulkRows(entityType, validRows, {
      schoolId,
      campusId: campus_id,
      userId: req.user?._id
    });

    try {
      await Notification.create({
        school_id: schoolId,
        recipient_role: 'All',
        title: `Bulk Import Completed: ${entityType}`,
        message: `Successfully imported ${insertedCount} ${entityType} records.`,
        type: 'General'
      });
    } catch {}

    res.status(200).json({
      success: true,
      entityType,
      insertedCount,
      message: `Successfully imported ${insertedCount} ${entityType} records into the system`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTemplate, parseRows, executeImport };

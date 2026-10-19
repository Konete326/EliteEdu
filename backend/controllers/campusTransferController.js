const CampusTransferLog = require('../models/CampusTransferLog');
const Notification = require('../models/Notification');
const { executeStudentTransfer, executeStaffTransfer } = require('../utils/campusTransferHelper');

const getTransfers = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { entity_type, campus_id, page = 1, limit = 50, search = '' } = req.query;
    const query = { school_id: schoolId };

    if (entity_type && entity_type !== 'All') query.entity_type = entity_type;
    if (campus_id) query.$or = [{ from_campus_id: campus_id }, { to_campus_id: campus_id }];
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ person_name: regex }, { identifier_code: regex }, { transfer_no: regex }];
    }

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const [transfers, totalCount, studentCount, staffCount, thisMonthCount] = await Promise.all([
      CampusTransferLog.find(query).sort({ transfer_date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
      CampusTransferLog.countDocuments({ school_id: schoolId }),
      CampusTransferLog.countDocuments({ school_id: schoolId, entity_type: 'Student' }),
      CampusTransferLog.countDocuments({ school_id: schoolId, entity_type: 'Staff' }),
      CampusTransferLog.countDocuments({ school_id: schoolId, transfer_date: { $gte: startOfMonth } })
    ]);

    res.status(200).json({
      success: true,
      data: transfers,
      kpis: {
        totalTransfers: totalCount,
        studentTransfers: studentCount,
        staffTransfers: staffCount,
        thisMonthTransfers: thisMonthCount
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const executeTransfer = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { entity_type = 'Student' } = req.body;
    const ctx = { schoolId, userId: req.user?._id };

    let log;
    if (entity_type === 'Staff') {
      log = await executeStaffTransfer(req.body, ctx);
    } else {
      log = await executeStudentTransfer(req.body, ctx);
    }

    try {
      await Notification.create({
        school_id: schoolId,
        recipient_role: 'All',
        title: `Campus Transfer Executed: ${log.transfer_no}`,
        message: `${log.entity_type} ${log.person_name} reallocated from ${log.from_campus_name} to ${log.to_campus_name}.`,
        type: 'General'
      });
    } catch {}

    res.status(201).json({ success: true, message: 'Campus transfer executed successfully', data: log });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTransfer = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { id } = req.params;
    const record = await CampusTransferLog.findOneAndDelete({ _id: id, school_id: schoolId });
    if (!record) return res.status(404).json({ success: false, message: 'Transfer record not found' });
    res.status(200).json({ success: true, message: 'Transfer record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTransfers, executeTransfer, deleteTransfer };

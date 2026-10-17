const SystemLog = require('../models/SystemLog');

const getSystemLogs = async (req, res) => {
  try {
    const { page = 1, limit = 8, category, severity, search, school_id } = req.query;
    const filter = {};

    if (req.user.role === 'Admin') {
      filter.school_id = req.user.school_id;
    } else if (req.user.role === 'SuperAdmin' && school_id && school_id !== 'ALL') {
      filter.school_id = school_id;
    }

    const baseScope = { ...filter };

    if (category && category !== 'ALL') {
      filter.category = category;
    }

    if (severity && severity !== 'ALL') {
      filter.severity = severity;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { message: regex },
        { user_name: regex },
        { school_name: regex },
        { endpoint: regex },
        { last_clicked_element: regex },
        { page_url: regex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 8));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total, totalLogs, networkErrors, consoleErrors, activityLogs] = await Promise.all([
      SystemLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      SystemLog.countDocuments(filter),
      SystemLog.countDocuments(baseScope),
      SystemLog.countDocuments({ ...baseScope, category: 'NETWORK_ERROR' }),
      SystemLog.countDocuments({ ...baseScope, category: { $in: ['CONSOLE_ERROR', 'RUNTIME_ERROR'] } }),
      SystemLog.countDocuments({ ...baseScope, category: 'USER_ACTIVITY' })
    ]);

    return res.status(200).json({
      success: true,
      logs,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      summary: {
        totalLogs,
        networkErrors,
        consoleErrors,
        activityLogs
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSystemLogs };

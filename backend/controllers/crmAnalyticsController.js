const mongoose = require('mongoose');
const CrmLead = require('../models/CrmLead');

const getAnalytics = async (req, res) => {
  try {
    const schoolId = new mongoose.Types.ObjectId(req.user?.school_id);
    const campusId = req.query.campus_id && req.query.campus_id !== 'all'
      ? new mongoose.Types.ObjectId(req.query.campus_id)
      : null;

    const baseMatch = { school_id: schoolId };
    if (campusId) baseMatch.campus_id = campusId;

    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [
      totalLeads,
      convertedLeads,
      pendingToday,
      overdueFollowUps,
      statusAgg,
      sourceAgg,
      gradeAgg
    ] = await Promise.all([
      CrmLead.countDocuments(baseMatch),
      CrmLead.countDocuments({ ...baseMatch, is_converted: true }),
      CrmLead.countDocuments({
        ...baseMatch,
        is_converted: { $ne: true },
        next_follow_up: { $gte: startToday, $lte: endToday }
      }),
      CrmLead.countDocuments({
        ...baseMatch,
        is_converted: { $ne: true },
        next_follow_up: { $lt: startToday, $ne: null }
      }),
      CrmLead.aggregate([
        { $match: baseMatch },
        { $group: { _id: '$lead_status', count: { $sum: 1 } } }
      ]),
      CrmLead.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: '$lead_source',
            total: { $sum: 1 },
            converted: { $sum: { $cond: [{ $eq: ['$is_converted', true] }, 1, 0] } }
          }
        }
      ]),
      CrmLead.aggregate([
        { $match: baseMatch },
        {
          $lookup: {
            from: 'grades',
            localField: 'grade_id',
            foreignField: '_id',
            as: 'grade'
          }
        },
        { $unwind: { path: '$grade', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { $ifNull: ['$grade.name', '$class_name'] },
            count: { $sum: 1 },
            converted: { $sum: { $cond: [{ $eq: ['$is_converted', true] }, 1, 0] } }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      kpis: {
        totalLeads,
        convertedLeads,
        conversionRate: Number(conversionRate),
        pendingToday,
        overdueFollowUps
      },
      pipelineFunnel: statusAgg.map((s) => ({ stage: s._id || 'Unassigned', count: s.count })),
      sourcePerformance: sourceAgg.map((s) => ({
        source: s._id || 'Unknown',
        total: s.total,
        converted: s.converted,
        rate: s.total > 0 ? Number(((s.converted / s.total) * 100).toFixed(1)) : 0
      })),
      gradeDemand: gradeAgg.map((g) => ({
        className: g._id || 'Unassigned',
        inquiries: g.count,
        enrolled: g.converted
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate CRM analytics', error: err.message });
  }
};

module.exports = { getAnalytics };

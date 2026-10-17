const CrmLead = require('../models/CrmLead');

const buildFilter = (user, query) => {
  const schoolId = user?.school_id;
  const filter = { school_id: schoolId };
  if (query.campus_id && query.campus_id !== 'all') filter.campus_id = query.campus_id;
  if (query.show_converted !== 'true') filter.is_converted = { $ne: true };
  if (query.lead_status && query.lead_status !== 'all') filter.lead_status = query.lead_status;
  if (query.lead_source && query.lead_source !== 'all') filter.lead_source = query.lead_source;
  if (query.priority && query.priority !== 'all') filter.priority = query.priority;
  if (query.grade_id && query.grade_id !== 'all') filter.grade_id = query.grade_id;

  if (query.search) {
    const rx = new RegExp(query.search.trim(), 'i');
    filter.$or = [{ student_name: rx }, { father_name: rx }, { contact_number: rx }, { email: rx }];
  }

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (query.follow_up_filter === 'today') {
    filter.next_follow_up = { $gte: startToday, $lte: endToday };
  } else if (query.follow_up_filter === 'overdue') {
    filter.next_follow_up = { $lt: startToday, $ne: null };
  } else if (query.follow_up_filter === 'upcoming') {
    filter.next_follow_up = { $gt: endToday };
  }

  return filter;
};

const getLeads = async (req, res) => {
  try {
    const filter = buildFilter(req.user, req.query);
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [leads, total, totalLeads, convertedLeads] = await Promise.all([
      CrmLead.find(filter)
        .populate('grade_id', 'name sections')
        .populate('campus_id', 'name')
        .populate('converted_student_id', 'gr_number current_section name')
        .sort({ is_pinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CrmLead.countDocuments(filter),
      CrmLead.countDocuments({ school_id: req.user?.school_id }),
      CrmLead.countDocuments({ school_id: req.user?.school_id, is_converted: true })
    ]);

    res.json({
      success: true,
      leads,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      badges: { totalLeads, convertedLeads }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve CRM leads', error: err.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await CrmLead.findOne({ _id: req.params.id, school_id: req.user?.school_id })
      .populate('grade_id', 'name sections')
      .populate('campus_id', 'name')
      .populate('converted_student_id', 'gr_number name current_section')
      .lean();
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve lead details', error: err.message });
  }
};

module.exports = { getLeads, getLeadById };

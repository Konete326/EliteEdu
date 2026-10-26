const mongoose = require('mongoose');
const FeeInvoice = require('../models/FeeInvoice');
const Notification = require('../models/Notification');

const getFeeDefaulters = async (req, res) => {
  try {
    const schoolObjId = new mongoose.Types.ObjectId(String(req.schoolId));
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 50, 100));
    const skip = (page - 1) * limit;

    const matchQuery = {
      school_id: schoolObjId,
      status: { $in: ['Unpaid', 'Partial', 'Overdue'] },
      balance_due: { $gt: 0 }
    };

    if (req.query.campus_id && req.query.campus_id !== 'all') {
      matchQuery.campus_id = new mongoose.Types.ObjectId(String(req.query.campus_id));
    }
    if (req.query.grade_id && req.query.grade_id !== 'all') {
      matchQuery.grade_id = new mongoose.Types.ObjectId(String(req.query.grade_id));
    }
    if (req.query.billing_month) {
      matchQuery.billing_month = req.query.billing_month.trim();
    }

    const minArrears = Number(req.query.min_arrears || 0);

    const pipeline = [
      { $match: matchQuery },
      {
        $group: {
          _id: '$student_id',
          grade_id: { $first: '$grade_id' },
          campus_id: { $first: '$campus_id' },
          section: { $first: '$section' },
          total_balance: { $sum: '$balance_due' },
          unpaid_invoices_count: { $sum: 1 },
          earliest_due_date: { $min: '$due_date' },
          invoices: {
            $push: {
              _id: '$_id',
              challan_no: '$challan_no',
              billing_month: '$billing_month',
              due_date: '$due_date',
              balance_due: '$balance_due',
              net_payable: '$net_payable'
            }
          }
        }
      }
    ];

    if (minArrears > 0) {
      pipeline.push({ $match: { total_balance: { $gte: minArrears } } });
    }

    pipeline.push(
      { $sort: { total_balance: -1 } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'students',
                localField: '_id',
                foreignField: '_id',
                as: 'student',
                pipeline: [
                  {
                    $project: {
                      _id: 1,
                      name: 1,
                      gr_number: 1,
                      contact_number: 1,
                      father_name: 1,
                      emergency_contact_no: 1,
                      current_grade: 1,
                      current_section: 1
                    }
                  }
                ]
              }
            },
            { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'grades',
                localField: 'grade_id',
                foreignField: '_id',
                as: 'grade',
                pipeline: [{ $project: { _id: 1, name: 1, code: 1 } }]
              }
            },
            { $unwind: { path: '$grade', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'campuses',
                localField: 'campus_id',
                foreignField: '_id',
                as: 'campus',
                pipeline: [{ $project: { _id: 1, name: 1, code: 1 } }]
              }
            },
            { $unwind: { path: '$campus', preserveNullAndEmptyArrays: true } }
          ]
        }
      }
    );

    const [result] = await FeeInvoice.aggregate(pipeline);
    const total = result?.metadata?.[0]?.total || 0;
    const now = new Date();

    const defaulters = (result?.data || []).map((item) => {
      const isPastDue = item.earliest_due_date && new Date(item.earliest_due_date) < now;
      const overdueDays = isPastDue ? Math.floor((now - new Date(item.earliest_due_date)) / (1000 * 60 * 60 * 24)) : 0;
      return {
        student: item.student || null,
        grade: item.grade || null,
        campus: item.campus || null,
        section: item.section || 'A',
        total_balance: item.total_balance || 0,
        unpaid_invoices_count: item.unpaid_invoices_count || 0,
        max_overdue_days: overdueDays,
        invoices: item.invoices || []
      };
    });

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      defaulters,
      count: defaulters.length,
      total,
      page,
      totalPages,
      limit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendDefaulterAlert = async (req, res) => {
  try {
    const { student_id, message, total_balance } = req.body;
    if (!student_id) return res.status(400).json({ success: false, message: 'Student ID is required' });

    await Notification.create({
      school_id: req.schoolId,
      title: 'Fee Dues Reminder',
      message: message || `Gentle reminder: Outstanding fee balance of PKR ${total_balance || 0} is pending. Please deposit promptly.`,
      target_type: 'Student',
      target_id: student_id,
      priority: 'High',
      created_by: req.user?.id || null
    });

    res.status(200).json({ success: true, message: 'Fee reminder alert dispatched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeeDefaulters, sendDefaulterAlert };

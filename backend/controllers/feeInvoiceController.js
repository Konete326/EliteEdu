const FeeInvoice = require('../models/FeeInvoice');
const Student = require('../models/Student');

const getInvoices = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = { school_id: req.schoolId };
    if (req.query.campus_id) query.campus_id = req.query.campus_id;
    if (req.query.billing_month) query.billing_month = req.query.billing_month.trim();
    if (req.query.grade_id) query.grade_id = req.query.grade_id;
    if (req.query.section) query.section = req.query.section;
    if (req.query.status) query.status = req.query.status;

    if (req.query.search) {
      const q = req.query.search.trim();
      const matchingStudents = await Student.find({
        school_id: req.schoolId,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { gr_number: { $regex: q, $options: 'i' } },
          { father_name: { $regex: q, $options: 'i' } }
        ]
      }).select('_id');
      query.$or = [
        { challan_no: { $regex: q, $options: 'i' } },
        { student_id: { $in: matchingStudents.map((s) => s._id) } }
      ];
    }

    const [invoices, total] = await Promise.all([
      FeeInvoice.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('student_id', 'name gr_number current_section current_grade contact_number father_name photo_url')
        .populate('grade_id', 'name code')
        .populate('campus_id', 'name code')
        .lean(),
      FeeInvoice.countDocuments(query)
    ]);

    res.status(200).json({ success: true, invoices, total, page, totalPages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleInvoice = async (req, res) => {
  try {
    const invoice = await FeeInvoice.findOne({ _id: req.params.id, school_id: req.schoolId })
      .populate('student_id')
      .populate('grade_id', 'name code')
      .populate('campus_id', 'name code address phone')
      .populate('collected_by', 'name email');

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const bulkUpdateDueDate = async (req, res) => {
  try {
    const { invoice_ids, new_due_date, grade_id, billing_month } = req.body;
    if (!new_due_date) {
      return res.status(400).json({ success: false, message: 'New due date is required' });
    }

    const filter = { school_id: req.schoolId, status: { $in: ['Unpaid', 'Partial', 'Overdue'] } };
    if (Array.isArray(invoice_ids) && invoice_ids.length > 0) {
      filter._id = { $in: invoice_ids };
    } else {
      if (grade_id) filter.grade_id = grade_id;
      if (billing_month) filter.billing_month = billing_month;
    }

    const result = await FeeInvoice.updateMany(filter, { $set: { due_date: new Date(new_due_date) } });
    res.status(200).json({ success: true, message: `Updated due date for ${result.modifiedCount} invoices` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const revertInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await FeeInvoice.findOne({ _id: id, school_id: req.schoolId });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    invoice.status = 'Void';
    invoice.notes = `Voided/Reverted on ${new Date().toISOString()}`;
    await invoice.save();

    res.status(200).json({ success: true, message: 'Fee invoice reverted/voided successfully', invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getInvoices, getSingleInvoice, bulkUpdateDueDate, revertInvoice };

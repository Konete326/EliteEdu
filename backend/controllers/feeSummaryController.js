const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');

const getCurrentMonthKey = () => {
  const d = new Date();
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

const getFeeSummary = async (req, res) => {
  try {
    const monthKey = req.query.fee_month || getCurrentMonthKey();
    const campusFilter = req.query.campus_id ? { campus_id: req.query.campus_id } : {};

    const [allStudents, monthPayments] = await Promise.all([
      Student.find({ school_id: req.schoolId, status: 'Active', ...campusFilter })
        .select('monthly_fee discount current_grade')
        .lean(),
      FeePayment.find({ school_id: req.schoolId, fee_month: monthKey, ...campusFilter })
        .select('paid_amount status student_id')
        .lean()
    ]);

    const totalStudents = allStudents.length;
    const projectedRevenue = allStudents.reduce(
      (acc, s) => acc + Math.max(0, Number(s.monthly_fee || 0) - Number(s.discount || 0)),
      0
    );

    const paidStudentIds = new Set(
      monthPayments.filter((p) => p.status === 'Paid').map((p) => String(p.student_id))
    );

    const totalCollected = monthPayments.reduce((acc, p) => acc + Number(p.paid_amount || 0), 0);
    const paidCount = paidStudentIds.size;
    const defaultersCount = Math.max(0, totalStudents - paidCount);

    res.status(200).json({
      success: true,
      summary: {
        fee_month: monthKey,
        total_students: totalStudents,
        total_collected: totalCollected,
        projected_revenue: projectedRevenue,
        paid_students_count: paidCount,
        defaulters_count: defaultersCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeeStudents = async (req, res) => {
  try {
    const monthKey = req.query.fee_month || getCurrentMonthKey();
    const query = { school_id: req.schoolId, status: 'Active' };

    if (req.query.campus_id) query.campus_id = req.query.campus_id;
    if (req.query.grade_id) query.current_grade = req.query.grade_id;

    if (req.query.search) {
      const q = req.query.search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { gr_number: { $regex: q, $options: 'i' } },
        { father_name: { $regex: q, $options: 'i' } }
      ];
    }

    const [students, monthPayments] = await Promise.all([
      Student.find(query)
        .populate('current_grade', 'name')
        .populate('campus_id', 'name')
        .select('name father_name gr_number current_grade current_section contact_number photo_url monthly_fee discount')
        .sort({ current_grade: 1, current_section: 1, name: 1 })
        .limit(100)
        .lean(),
      FeePayment.find({ school_id: req.schoolId, fee_month: monthKey })
        .select('student_id paid_amount status receipt_number payment_date')
        .lean()
    ]);

    const paymentMap = new Map();
    monthPayments.forEach((p) => paymentMap.set(String(p.student_id), p));

    const result = students.map((s) => {
      const pay = paymentMap.get(String(s._id));
      const base = Number(s.monthly_fee || 0);
      const disc = Number(s.discount || 0);
      const net = Math.max(0, base - disc);
      return {
        ...s,
        base_fee: base,
        discount: disc,
        net_payable: net,
        payment_status: pay ? pay.status : 'Unpaid',
        paid_amount: pay ? pay.paid_amount : 0,
        receipt_number: pay ? pay.receipt_number : null,
        payment_date: pay ? pay.payment_date : null
      };
    });

    res.status(200).json({ success: true, students: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeeSummary, getFeeStudents };

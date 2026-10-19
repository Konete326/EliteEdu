const FeeInvoice = require('../models/FeeInvoice');
const FeeStructure = require('../models/FeeStructure');
const Student = require('../models/Student');
const { generateChallanNo } = require('../utils/challanNumberHelper');

const generateMonthlyChallans = async (req, res) => {
  try {
    const { grade_id, section, campus_id, billing_month, due_date, student_ids = [] } = req.body;
    if (!billing_month || !due_date) {
      return res.status(400).json({ success: false, message: 'Billing month and due date are required' });
    }

    const studentQuery = { school_id: req.schoolId, status: 'Active' };
    if (student_ids && student_ids.length > 0) {
      studentQuery._id = { $in: student_ids };
    } else {
      if (grade_id) studentQuery.current_grade = grade_id;
      if (section) studentQuery.current_section = section;
      if (campus_id) studentQuery.campus_id = campus_id;
    }

    const students = await Student.find(studentQuery).populate('current_grade', 'name').lean();
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'No active students found matching criteria' });
    }

    const gradeIds = [...new Set(students.map((s) => String(s.current_grade?._id || s.current_grade)).filter(Boolean))];
    const structures = await FeeStructure.find({
      school_id: req.schoolId,
      grade_id: { $in: gradeIds },
      status: 'Active'
    }).lean();
    const structureMap = new Map();
    structures.forEach((st) => structureMap.set(String(st.grade_id), st));

    const existingInvoices = await FeeInvoice.find({
      school_id: req.schoolId,
      billing_month: billing_month.trim(),
      student_id: { $in: students.map((s) => s._id) }
    }).select('student_id').lean();
    const existingStudentIds = new Set(existingInvoices.map((i) => String(i.student_id)));

    const createdInvoices = [];
    let skippedCount = 0;

    for (const student of students) {
      const sId = String(student._id);
      if (existingStudentIds.has(sId)) {
        skippedCount++;
        continue;
      }

      const struct = structureMap.get(String(student.current_grade?._id || student.current_grade));
      const heads = [];
      const tuition = Number(struct?.tuition_fee !== undefined ? struct.tuition_fee : student.monthly_fee || 0);
      heads.push({ title: 'Tuition Fee', amount: tuition });

      if (struct?.exam_fee > 0) heads.push({ title: 'Exam Fee', amount: Number(struct.exam_fee) });
      if (struct?.computer_lab_fee > 0) heads.push({ title: 'Computer Lab Fee', amount: Number(struct.computer_lab_fee) });
      const transportFee = Number(struct?.transport_fee > 0 ? struct.transport_fee : (student.transport_fee || 0));
      if (transportFee > 0) heads.push({ title: 'Transport Fee', amount: transportFee });
      if (Array.isArray(struct?.custom_heads)) {
        struct.custom_heads.forEach((h) => {
          if (h.amount > 0) heads.push({ title: h.title, amount: Number(h.amount) });
        });
      }

      const grossAmount = heads.reduce((sum, h) => sum + h.amount, 0);

      const pastUnpaid = await FeeInvoice.find({
        school_id: req.schoolId,
        student_id: student._id,
        status: { $in: ['Unpaid', 'Partial', 'Overdue'] },
        billing_month: { $ne: billing_month.trim() }
      }).select('balance_due').lean();
      const arrearsAmount = pastUnpaid.reduce((sum, inv) => sum + Number(inv.balance_due || 0), 0);

      const discountAmount = Math.min(grossAmount, Number(student.discount || 0));
      const netPayable = Math.max(0, grossAmount + arrearsAmount - discountAmount);
      const challanNo = await generateChallanNo(req.schoolId, billing_month);

      const invoice = await FeeInvoice.create({
        school_id: req.schoolId,
        campus_id: student.campus_id || req.body.campus_id || null,
        challan_no: challanNo,
        student_id: student._id,
        grade_id: student.current_grade?._id || student.current_grade || null,
        section: student.current_section || 'A',
        billing_month: billing_month.trim(),
        issue_date: new Date(),
        due_date: new Date(due_date),
        fee_heads: heads,
        gross_amount: grossAmount,
        arrears_amount: arrearsAmount,
        discount_amount: discountAmount,
        late_fine: Number(struct?.late_fine_amount || 200),
        net_payable: netPayable,
        paid_amount: 0,
        balance_due: netPayable,
        status: 'Unpaid'
      });

      createdInvoices.push(invoice);
    }

    res.status(201).json({
      success: true,
      message: `Generated ${createdInvoices.length} fee challan(s). (${skippedCount} already had challans).`,
      generated_count: createdInvoices.length,
      skipped_count: skippedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateMonthlyChallans };

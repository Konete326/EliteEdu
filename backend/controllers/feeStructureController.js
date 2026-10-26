const FeeStructure = require('../models/FeeStructure');
const Grade = require('../models/Grade');
const Student = require('../models/Student');

const getFeeStructures = async (req, res) => {
  try {
    const query = { school_id: req.schoolId };
    if (req.query.campus_id) query.campus_id = req.query.campus_id;
    if (req.query.grade_id) query.grade_id = req.query.grade_id;

    const structures = await FeeStructure.find(query)
      .populate('grade_id', 'name code monthly_fee')
      .populate('campus_id', 'name code')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, structures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFeeStructure = async (req, res) => {
  try {
    const {
      grade_id, campus_id, academic_session = '2026-2027', tuition_fee,
      admission_fee = 0, exam_fee = 0, computer_lab_fee = 0, transport_fee = 0,
      custom_heads = [], late_fine_amount = 200, due_day_of_month = 10,
      status = 'Active', sync_to_students = false
    } = req.body;

    if (!grade_id || tuition_fee === undefined) {
      return res.status(400).json({ success: false, message: 'Grade and tuition fee are required' });
    }

    const structure = await FeeStructure.findOneAndUpdate(
      { school_id: req.schoolId, grade_id, academic_session },
      {
        campus_id: campus_id || null,
        tuition_fee: Number(tuition_fee),
        admission_fee: Number(admission_fee),
        exam_fee: Number(exam_fee),
        computer_lab_fee: Number(computer_lab_fee),
        transport_fee: Number(transport_fee),
        custom_heads: Array.isArray(custom_heads) ? custom_heads : [],
        late_fine_amount: Number(late_fine_amount),
        due_day_of_month: Number(due_day_of_month),
        status
      },
      { new: true, upsert: true, runValidators: true }
    );

    await Grade.findByIdAndUpdate(grade_id, { monthly_fee: Number(tuition_fee) });

    if (sync_to_students) {
      await Student.updateMany(
        { school_id: req.schoolId, current_grade: grade_id, status: 'Active' },
        { monthly_fee: Number(tuition_fee) }
      );
    }

    const populated = await FeeStructure.findById(structure._id)
      .populate('grade_id', 'name code monthly_fee')
      .populate('campus_id', 'name code')
      .lean();

    res.status(201).json({ success: true, message: 'Fee structure saved successfully', structure: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const structure = await FeeStructure.findOneAndUpdate(
      { _id: id, school_id: req.schoolId },
      req.body,
      { new: true, runValidators: true }
    ).populate('grade_id', 'name code monthly_fee').populate('campus_id', 'name code').lean();

    if (!structure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }

    if (req.body.tuition_fee !== undefined && req.body.sync_to_students) {
      await Student.updateMany(
        { school_id: req.schoolId, current_grade: structure.grade_id, status: 'Active' },
        { monthly_fee: Number(req.body.tuition_fee) }
      );
    }

    res.status(200).json({ success: true, message: 'Fee structure updated successfully', structure });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const structure = await FeeStructure.findOneAndDelete({ _id: id, school_id: req.schoolId });
    if (!structure) {
      return res.status(404).json({ success: false, message: 'Fee structure not found' });
    }
    res.status(200).json({ success: true, message: 'Fee structure deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure };

const StaffSalarySlip = require('../models/StaffSalarySlip');

const getSlips = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { salary_month, staff_id, status, campus_id } = req.query;
    const query = { school_id: schoolId };

    if (salary_month) query.salary_month = salary_month;
    if (staff_id) query.staff_id = staff_id;
    if (status) query.status = status;
    if (campus_id) query.campus_id = campus_id;

    const slips = await StaffSalarySlip.find(query).populate('staff_id', 'name email employee_code designation department photo_url basic_salary bank_details').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: slips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySlips = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const staffId = req.user?._id;
    const slips = await StaffSalarySlip.find({ school_id: schoolId, staff_id: staffId }).populate('staff_id', 'name email employee_code designation department basic_salary bank_details').sort({ salary_month: -1 });
    res.status(200).json({ success: true, data: slips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSalarySlip = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const slip = await StaffSalarySlip.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      { $set: req.body },
      { new: true }
    );
    if (!slip) return res.status(404).json({ message: 'Slip not found' });
    res.status(200).json({ success: true, data: slip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSlips,
  getMySlips,
  updateSalarySlip
};

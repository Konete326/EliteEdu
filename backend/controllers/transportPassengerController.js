const TransportRoute = require('../models/TransportRoute');
const Student = require('../models/Student');

const assignStudent = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const { route_id, student_id, fee_amount, action = 'assign' } = req.body;
    const targetRouteId = route_id || req.params.id;
    const targetStudentId = student_id || req.params.studentId;

    const route = await TransportRoute.findOne({ _id: targetRouteId, school_id: schoolId });
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });

    if (action === 'unassign') {
      route.assigned_students = route.assigned_students.filter((s) => String(s) !== String(targetStudentId));
      await route.save();
      await Student.findByIdAndUpdate(targetStudentId, { transport_route: '', transport_fee: 0 });
      return res.status(200).json({ success: true, message: 'Student removed from transport route' });
    }

    if (!route.assigned_students.some((s) => String(s) === String(targetStudentId))) {
      route.assigned_students.push(targetStudentId);
      await route.save();
    }
    const finalFee = Number(fee_amount) >= 0 ? Number(fee_amount) : (route.monthly_fee || 0);
    await Student.findByIdAndUpdate(targetStudentId, { transport_route: route.route_name, transport_fee: finalFee });

    res.status(200).json({ success: true, message: 'Student assigned to route and fee synced successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoutePassengers = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const route = await TransportRoute.findOne({ _id: req.params.id, school_id: schoolId })
      .populate({
        path: 'assigned_students',
        select: 'name father_name parent_phone gr_number current_section transport_fee photo_url',
        populate: { path: 'current_grade', select: 'name code' }
      })
      .lean();
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    res.status(200).json({ success: true, passengers: route.assigned_students || [], route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  assignStudent,
  getRoutePassengers,
  assignStudentToRoute: assignStudent,
  unassignStudentFromRoute: (req, res) => assignStudent({ ...req, body: { action: 'unassign' } }, res)
};

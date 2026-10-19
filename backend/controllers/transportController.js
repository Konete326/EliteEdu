const TransportRoute = require('../models/TransportRoute');
const Student = require('../models/Student');
const {
  assignStudent,
  getRoutePassengers,
  assignStudentToRoute,
  unassignStudentFromRoute
} = require('./transportPassengerController');

const getRoutes = async (req, res) => {
  try {
    const { campus_id, status } = req.query;
    const query = { school_id: req.schoolId || req.user?.school_id };
    if (campus_id) query.campus_id = campus_id;
    if (status) query.status = status;

    const routes = await TransportRoute.find(query)
      .populate('campus_id', 'name')
      .populate({
        path: 'assigned_students',
        select: 'name father_name gr_number roll_number current_section transport_fee photo_url',
        populate: { path: 'current_grade', select: 'name code' }
      })
      .sort({ createdAt: -1 })
      .lean();

    let assignedStudentsCount = 0, totalCapacity = 0, estMonthlyRevenue = 0;
    routes.forEach((r) => {
      const cap = Number(r.seating_capacity || r.capacity || 18);
      const count = r.assigned_students?.length || 0;
      r.seating_capacity = cap;
      r.availableSeats = Math.max(0, cap - count);
      assignedStudentsCount += count;
      totalCapacity += cap;
      estMonthlyRevenue += count * Number(r.monthly_fee || 0);
    });

    res.status(200).json({
      success: true,
      routes,
      kpis: {
        totalRoutes: routes.length,
        totalVehicles: routes.length,
        totalCapacity,
        assignedStudentsCount,
        availableSeats: Math.max(0, totalCapacity - assignedStudentsCount),
        estMonthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createRoute = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const cap = Number(req.body.seating_capacity || req.body.capacity || 18);
    const route = await TransportRoute.create({ ...req.body, school_id: schoolId, seating_capacity: cap, capacity: cap });
    res.status(201).json({ success: true, message: 'Transport route created successfully', route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRoute = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const cap = Number(req.body.seating_capacity || req.body.capacity || 18);
    const route = await TransportRoute.findOneAndUpdate(
      { _id: req.params.id, school_id: schoolId },
      { ...req.body, seating_capacity: cap, capacity: cap },
      { new: true, runValidators: true }
    );
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    if (route.assigned_students?.length) {
      const upd = {};
      if (req.body.route_name) upd.transport_route = route.route_name;
      if (req.body.monthly_fee !== undefined) upd.transport_fee = route.monthly_fee;
      if (Object.keys(upd).length) await Student.updateMany({ _id: { $in: route.assigned_students } }, upd);
    }
    res.status(200).json({ success: true, message: 'Route updated successfully', route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const schoolId = req.schoolId || req.user?.school_id;
    const route = await TransportRoute.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    if (route.assigned_students?.length) {
      await Student.updateMany({ _id: { $in: route.assigned_students } }, { transport_route: '', transport_fee: 0 });
    }
    res.status(200).json({ success: true, message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  assignStudent,
  getRoutePassengers,
  assignStudentToRoute,
  unassignStudentFromRoute
};

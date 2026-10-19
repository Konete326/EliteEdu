const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
  {
    stop_name: { type: String, required: true, trim: true },
    pickup_time: { type: String, default: '07:15 AM' },
    fee_amount: { type: Number, default: 0 }
  },
  { _id: false }
);

const transportRouteSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    route_name: { type: String, required: true, trim: true },
    route_code: { type: String, required: true, trim: true, default: 'VAN-01' },
    vehicle_no: { type: String, required: true, trim: true },
    vehicle_type: {
      type: String,
      enum: ['School Van', 'Coaster / Mini Bus', 'School Bus', 'Hiace'],
      default: 'School Van'
    },
    seating_capacity: { type: Number, default: 18, min: 1 },
    capacity: { type: Number, default: 18, min: 1 },
    driver_name: { type: String, required: true, trim: true },
    driver_phone: { type: String, required: true, trim: true },
    driver_cnic: { type: String, trim: true, default: '' },
    driver_license: { type: String, trim: true, default: '' },
    conductor_name: { type: String, trim: true, default: '' },
    conductor_phone: { type: String, trim: true, default: '' },
    monthly_fee: { type: Number, required: true, default: 3000, min: 0 },
    morning_pickup_time: { type: String, default: '07:15 AM' },
    afternoon_drop_time: { type: String, default: '02:15 PM' },
    stops: [stopSchema],
    assigned_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    status: { type: String, enum: ['Active', 'Maintenance', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

transportRouteSchema.index({ school_id: 1, route_name: 1 });
transportRouteSchema.index({ school_id: 1, route_code: 1 });

module.exports = mongoose.model('TransportRoute', transportRouteSchema);

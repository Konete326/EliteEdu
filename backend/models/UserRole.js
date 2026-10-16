const mongoose = require('mongoose');

const modulePermissionSchema = new mongoose.Schema(
  {
    module_key: { type: String, required: true, trim: true },
    module_name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    view: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    filter: { type: Boolean, default: false },
    reports: { type: Boolean, default: false }
  },
  { _id: false }
);

const userRoleSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    dashboard_type: {
      type: String,
      enum: ['AdminDashboard', 'TeacherDashboard', 'AcademicDashboard', 'FinanceDashboard', 'ReceptionDashboard'],
      default: 'TeacherDashboard'
    },
    permissions: [modulePermissionSchema],
    is_system: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

userRoleSchema.index({ school_id: 1, name: 1, campus_id: 1 });

module.exports = mongoose.model('UserRole', userRoleSchema);

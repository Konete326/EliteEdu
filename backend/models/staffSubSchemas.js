const mongoose = require('mongoose');

const weeklyTimingSchema = new mongoose.Schema({
  day: { type: String, required: true },
  is_working: { type: Boolean, default: true },
  start_time: { type: String, default: '08:00' },
  end_time: { type: String, default: '14:00' }
}, { _id: false });

const classAssignmentSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true },
  section: { type: String, required: true, trim: true }
}, { _id: true });

const childSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, default: null },
  name: { type: String, trim: true, default: '' },
  gr_number: { type: String, trim: true, default: '' },
  grade_name: { type: String, trim: true, default: '' }
}, { _id: true });

const appPermissionsSchema = new mongoose.Schema({
  my_profile: { type: Boolean, default: true },
  homework: { type: Boolean, default: true },
  attendance: { type: Boolean, default: true },
  examination: { type: Boolean, default: true },
  resources: { type: Boolean, default: true },
  events: { type: Boolean, default: true },
  timetable: { type: Boolean, default: true },
  students: { type: Boolean, default: true },
  update_picture: { type: Boolean, default: true },
  complaints: { type: Boolean, default: true },
  feedback: { type: Boolean, default: true },
  counseling: { type: Boolean, default: true },
  lost_and_found: { type: Boolean, default: true },
  quizzes: { type: Boolean, default: true },
  lectures: { type: Boolean, default: true },
  online_classes: { type: Boolean, default: true },
  planner: { type: Boolean, default: true },
  datesheet: { type: Boolean, default: true },
  salary: { type: Boolean, default: true }
}, { _id: false });

const payrollConfigSchema = new mongoose.Schema({
  allowances: [{ title: String, amount: Number, type: { type: String, default: 'Fixed' } }],
  deductions: [{ title: String, amount: Number, type: { type: String, default: 'Fixed' } }],
  contribution_policy: { type: String, default: '' },
  breakup_policy: { type: String, default: '' },
  payroll_policy: { type: String, default: '' }
}, { _id: false });

const securityDepositSchema = new mongoose.Schema({
  amount: Number, deduction_month: String, status: { type: String, default: 'Pending' }, date: { type: Date, default: Date.now }
}, { _id: true });

const incrementSchema = new mongoose.Schema({
  amount: Number, effective_date: Date, reason: String, previous_salary: Number
}, { _id: true });

const loanSchema = new mongoose.Schema({
  amount: Number, installment: Number, status: { type: String, default: 'Active' }, reason: String, date: { type: Date, default: Date.now }
}, { _id: true });

const followUpSchema = new mongoose.Schema({
  remarks: String, status: { type: String, default: 'Open' }, follow_up_date: Date, created_at: { type: Date, default: Date.now }
}, { _id: true });

const documentSchema = new mongoose.Schema({
  title: String, file_url: String, file_name: String, uploaded_at: { type: Date, default: Date.now }
}, { _id: true });

module.exports = {
  weeklyTimingSchema, classAssignmentSchema, childSchema, appPermissionsSchema,
  payrollConfigSchema, securityDepositSchema, incrementSchema, loanSchema, followUpSchema, documentSchema
};

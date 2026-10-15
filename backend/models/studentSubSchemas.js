const mongoose = require('mongoose');

const parentDetailsSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  cnic: { type: String, trim: true, default: '' },
  education: { type: String, trim: true, default: '' },
  mobile: { type: String, trim: true, default: '' },
  occupation: { type: String, trim: true, default: '' },
  profession: { type: String, trim: true, default: '' },
  income: { type: Number, default: 0 }
}, { _id: false });

const familyMemberSchema = new mongoose.Schema({
  relation: { type: String, trim: true, default: '' },
  name: { type: String, trim: true, default: '' },
  cnic: { type: String, trim: true, default: '' },
  occupation: { type: String, trim: true, default: '' },
  profession: { type: String, trim: true, default: '' },
  education: { type: String, trim: true, default: '' },
  monthly_income: { type: Number, default: 0 }
}, { _id: false });

const academicHistorySchema = new mongoose.Schema({
  last_institute: { type: String, trim: true, default: '' },
  previous_school: { type: String, trim: true, default: '' },
  previous_id_roll_no: { type: String, trim: true, default: '' },
  last_class: { type: String, trim: true, default: '' },
  last_session: { type: String, trim: true, default: '' },
  last_result: { type: String, trim: true, default: '' }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  current_address: { type: String, trim: true, default: '' },
  permanent_address: { type: String, trim: true, default: '' },
  area: { type: String, trim: true, default: '' }
}, { _id: false });

const appSettingsSchema = new mongoose.Schema({
  edit_profile: { type: Boolean, default: true },
  homework: { type: Boolean, default: true },
  attendance: { type: Boolean, default: true },
  timetable: { type: Boolean, default: true },
  result: { type: Boolean, default: true },
  circulars: { type: Boolean, default: true },
  news_feed: { type: Boolean, default: true }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  file_url: { type: String, trim: true, default: '' },
  file_name: { type: String, trim: true, default: '' },
  uploaded_at: { type: Date, default: Date.now }
}, { _id: true });

module.exports = {
  parentDetailsSchema,
  familyMemberSchema,
  academicHistorySchema,
  addressSchema,
  appSettingsSchema,
  documentSchema
};

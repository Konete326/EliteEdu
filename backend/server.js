require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const campusRoutes = require('./routes/campusRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const studentRoutes = require('./routes/studentRoutes');
const staffApplicantRoutes = require('./routes/staffApplicantRoutes');
const gradingPolicyRoutes = require('./routes/gradingPolicyRoutes');
const publicRoutes = require('./routes/publicRoutes');
const teacherPortalRoutes = require('./routes/teacherPortalRoutes');
const systemLogRoutes = require('./routes/systemLogRoutes');
const userMgmtRoutes = require('./routes/userMgmtRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const signatureRoutes = require('./routes/signatureRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const staffAttendanceRoutes = require('./routes/staffAttendanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const examRoutes = require('./routes/examRoutes');
const classTestRoutes = require('./routes/classTestRoutes');
const feeRoutes = require('./routes/feeRoutes');
const examSuiteRoutes = require('./routes/examSuiteRoutes');
const questionPaperRoutes = require('./routes/questionPaperRoutes');
const auditLogger = require('./middlewares/auditLogger');
const sanitizePayload = require('./utils/sanitizePayload');
const seedSuperAdmin = require('./utils/seedSuperAdmin');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eliteedu';
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'https://elitedev-edu.vercel.app'];

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') req.body = sanitizePayload(req.body);
  next();
});
app.use(auditLogger);

let isDbConnected = false;
const connectDB = async () => {
  if (isDbConnected && mongoose.connection.readyState === 1) return;
  const conn = await mongoose.connect(MONGO_URI);
  isDbConnected = conn.connections[0].readyState === 1;
  if (isDbConnected) await seedSuperAdmin();
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/schools', '/schools'], schoolRoutes);
app.use(['/api/teachers', '/teachers'], teacherRoutes);
app.use(['/api/dashboard', '/dashboard'], dashboardRoutes);
app.use(['/api/campuses', '/campuses'], campusRoutes);
app.use(['/api/subjects', '/subjects'], subjectRoutes);
app.use(['/api/grades', '/grades'], gradeRoutes);
app.use(['/api/students', '/students'], studentRoutes);
app.use(['/api/staff-applicants', '/staff-applicants'], staffApplicantRoutes);
app.use(['/api/grading-policies', '/grading-policies'], gradingPolicyRoutes);
app.use(['/api/public', '/public'], publicRoutes);
app.use(['/api/teacher-portal', '/teacher-portal'], teacherPortalRoutes);
app.use(['/api/logs', '/logs'], systemLogRoutes);
app.use(['/api/user-management', '/user-management'], userMgmtRoutes);
app.use(['/api/promotions', '/promotions'], promotionRoutes);
app.use(['/api/signatures', '/signatures'], signatureRoutes);
app.use(['/api/attendance', '/attendance'], attendanceRoutes);
app.use(['/api/staff-attendance', '/staff-attendance'], staffAttendanceRoutes);
app.use(['/api/notifications', '/notifications'], notificationRoutes);
app.use(['/api/exams', '/exams'], examRoutes);
app.use(['/api/class-tests', '/class-tests'], classTestRoutes);
app.use(['/api/fees', '/fees'], feeRoutes);
app.use(['/api/exam-suite', '/exam-suite'], examSuiteRoutes);
app.use(['/api/question-papers', '/question-papers'], questionPaperRoutes);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch((err) => console.error('Database connection failed:', err));
}

module.exports = app;

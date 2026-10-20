require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); const schoolRoutes = require('./routes/schoolRoutes');
const teacherRoutes = require('./routes/teacherRoutes'); const dashboardRoutes = require('./routes/dashboardRoutes');
const campusRoutes = require('./routes/campusRoutes'); const subjectRoutes = require('./routes/subjectRoutes');
const gradeRoutes = require('./routes/gradeRoutes'); const studentRoutes = require('./routes/studentRoutes');
const staffApplicantRoutes = require('./routes/staffApplicantRoutes'); const gradingPolicyRoutes = require('./routes/gradingPolicyRoutes');
const publicRoutes = require('./routes/publicRoutes'); const teacherPortalRoutes = require('./routes/teacherPortalRoutes');
const systemLogRoutes = require('./routes/systemLogRoutes'); const userMgmtRoutes = require('./routes/userMgmtRoutes');
const promotionRoutes = require('./routes/promotionRoutes'); const signatureRoutes = require('./routes/signatureRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes'); const staffAttendanceRoutes = require('./routes/staffAttendanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); const examRoutes = require('./routes/examRoutes');
const classTestRoutes = require('./routes/classTestRoutes'); const feeRoutes = require('./routes/feeRoutes');
const examSuiteRoutes = require('./routes/examSuiteRoutes'); const questionPaperRoutes = require('./routes/questionPaperRoutes');
const reportRoutes = require('./routes/reportRoutes'); const certificateRoutes = require('./routes/certificateRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes'); const attendanceReportRoutes = require('./routes/attendanceReportRoutes');
const crmRoutes = require('./routes/crmRoutes'); const accountsRoutes = require('./routes/accountsRoutes');
const payrollRoutes = require('./routes/payrollRoutes'); const lmsRoutes = require('./routes/lmsRoutes');
const timetableRoutes = require('./routes/timetableRoutes'); const storePosRoutes = require('./routes/storePosRoutes');
const plannerEventRoutes = require('./routes/plannerEventRoutes'); const operationsRoutes = require('./routes/operationsRoutes');
const behaviorRoutes = require('./routes/behaviorRoutes'); const bulkMigrationRoutes = require('./routes/bulkMigrationRoutes');
const bulkImportRoutes = require('./routes/bulkImportRoutes'); const campusTransferRoutes = require('./routes/campusTransferRoutes');
const transportRoutes = require('./routes/transportRoutes'); const studentPortalRoutes = require('./routes/studentPortalRoutes');
const messengerRoutes = require('./routes/messengerRoutes'); const scannerRoutes = require('./routes/scannerRoutes'); const messagingRoutes = require('./routes/messagingRoutes'); const zoomRoutes = require('./routes/zoomRoutes');
const auditLogger = require('./middlewares/auditLogger');
const sanitizePayload = require('./utils/sanitizePayload');
const seedSuperAdmin = require('./utils/seedSuperAdmin');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eliteedu';

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
app.use(express.json({ limit: '25mb', verify: (req, res, buf) => { req.rawBody = buf.toString(); } }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') req.body = sanitizePayload(req.body);
  if (req.url?.startsWith('/api/api/')) req.url = req.url.replace('/api/api/', '/api/');
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

const routes = [
  [['/api/auth', '/auth'], authRoutes], [['/api/schools', '/schools'], schoolRoutes],
  [['/api/teachers', '/teachers'], teacherRoutes], [['/api/dashboard', '/dashboard'], dashboardRoutes],
  [['/api/campuses', '/campuses'], campusRoutes], [['/api/subjects', '/subjects'], subjectRoutes],
  [['/api/grades', '/grades'], gradeRoutes], [['/api/students', '/students'], studentRoutes],
  [['/api/staff-applicants', '/staff-applicants'], staffApplicantRoutes], [['/api/grading-policies', '/grading-policies'], gradingPolicyRoutes],
  [['/api/public', '/public'], publicRoutes], [['/api/teacher-portal', '/teacher-portal'], teacherPortalRoutes],
  [['/api/logs', '/logs'], systemLogRoutes], [['/api/user-management', '/user-management'], userMgmtRoutes],
  [['/api/promotions', '/promotions'], promotionRoutes], [['/api/signatures', '/signatures'], signatureRoutes],
  [['/api/attendance', '/attendance'], attendanceRoutes], [['/api/staff-attendance', '/staff-attendance'], staffAttendanceRoutes],
  [['/api/notifications', '/notifications'], notificationRoutes], [['/api/exams', '/exams'], examRoutes],
  [['/api/class-tests', '/class-tests'], classTestRoutes], [['/api/fees', '/fees'], feeRoutes],
  [['/api/exam-suite', '/exam-suite'], examSuiteRoutes], [['/api/question-papers', '/question-papers'], questionPaperRoutes],
  [['/api/reports', '/reports'], reportRoutes], [['/api/certificates', '/certificates'], certificateRoutes],
  [['/api/leaves', '/leaves'], leaveRequestRoutes], [['/api/attendance-reports', '/attendance-reports'], attendanceReportRoutes],
  [['/api/crm', '/crm'], crmRoutes], [['/api/accounts', '/accounts'], accountsRoutes],
  [['/api/payroll', '/payroll'], payrollRoutes], [['/api/lms', '/lms'], lmsRoutes],
  [['/api/timetable', '/timetable'], timetableRoutes], [['/api/store', '/store'], storePosRoutes],
  [['/api/operations', '/operations'], operationsRoutes], [['/api/planners', '/planners'], plannerEventRoutes],
  [['/api/behavior', '/behavior'], behaviorRoutes], [['/api/bulk-migration', '/bulk-migration'], bulkMigrationRoutes],
  [['/api/bulk-import', '/bulk-import'], bulkImportRoutes], [['/api/campus-transfers', '/campus-transfers'], campusTransferRoutes],
  [['/api/transport', '/transport'], transportRoutes], [['/api/student-portal', '/student-portal'], studentPortalRoutes],
  [['/api/messenger', '/messenger'], messengerRoutes], [['/api/scanner', '/scanner'], scannerRoutes],
  [['/api/messaging', '/messaging'], messagingRoutes], [['/api/zoom', '/zoom'], zoomRoutes]
];
routes.forEach(([paths, handler]) => app.use(paths, handler));

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  }).catch((err) => console.error('Database connection failed:', err));
}

module.exports = app;

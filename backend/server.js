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
const seedSuperAdmin = require('./utils/seedSuperAdmin');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eliteedu';

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

let isDbConnected = false;
const connectDB = async () => {
  if (isDbConnected && mongoose.connection.readyState === 1) return;
  const conn = await mongoose.connect(MONGO_URI);
  isDbConnected = conn.connections[0].readyState === 1;
  if (isDbConnected) {
    await seedSuperAdmin();
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/students', studentRoutes);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Database connection failed:', err);
  });
}

module.exports = app;

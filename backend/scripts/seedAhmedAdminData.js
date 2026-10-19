const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FIRST_NAMES_M = ['Muhammad', 'Ali', 'Hamza', 'Ahmed', 'Bilal', 'Usman', 'Zain', 'Hassan', 'Umar', 'Mustafa', 'Tariq', 'Farhan', 'Saad', 'Daniyal', 'Omer', 'Asad', 'Haris', 'Shahid', 'Raza', 'Kashif'];
const FIRST_NAMES_F = ['Ayesha', 'Fatima', 'Zainab', 'Mariam', 'Hira', 'Sana', 'Khadija', 'Anum', 'Noor', 'Maham', 'Eman', 'Sadia', 'Iqra', 'Rabia', 'Laiba', 'Bisma', 'Alishba', 'Momina', 'Zoya', 'Mehak'];
const LAST_NAMES = ['Khan', 'Ahmed', 'Ali', 'Malik', 'Raza', 'Shah', 'Chaudhry', 'Bhatti', 'Siddiqui', 'Qureshi', 'Abbasi', 'Mirza', 'Farooqi', 'Akram', 'Tariq', 'Iqbal', 'Hussain', 'Rehman', 'Jamil', 'Nasir'];

const TEACHER_ROLES = [
  { desig: 'Senior Mathematics Teacher', dept: 'Math' },
  { desig: 'Senior Physics Teacher', dept: 'Physics' },
  { desig: 'Senior Chemistry Teacher', dept: 'Chemistry' },
  { desig: 'Biology Lecturer', dept: 'Biology' },
  { desig: 'Computer Science Instructor', dept: 'Computer Science' },
  { desig: 'English Language Teacher', dept: 'English' },
  { desig: 'Urdu Literature Teacher', dept: 'Urdu' },
  { desig: 'Islamic Studies Instructor', dept: 'Islamiat' },
  { desig: 'Pakistan Studies Teacher', dept: 'Social Studies' },
  { desig: 'General Science Teacher', dept: 'Science' },
  { desig: 'Primary Years Coordinator', dept: 'Primary' },
  { desig: 'Junior Section Teacher', dept: 'Junior' },
  { desig: 'Art & Design Instructor', dept: 'Arts' },
  { desig: 'Physical Education Coach', dept: 'Sports' },
  { desig: 'Arabic & Quranic Teacher', dept: 'Arabic' }
];

const STAFF_ROLES = [
  'Vice Principal', 'Head Accountant', 'Examination Incharge', 'Admissions Officer',
  'Senior Librarian', 'Science Lab Incharge', 'Transport Coordinator', 'IT Systems Specialist',
  'HR & Admin Officer', 'School Counselor'
];

const STANDARD_CLASSES = [
  'Playgroup', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3',
  'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

const run = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;

    const admin = await db.collection('users').findOne({ email: 'ahmedadmin@gmail.com' });
    if (!admin) throw new Error('ahmedadmin@gmail.com not found');
    const schoolId = admin.school_id;
    console.log(`Target School ID: ${schoolId} for ${admin.name} (${admin.email})`);

    console.log('1. Setting up Campuses...');
    let mainCampus = await db.collection('campuses').findOne({ school_id: schoolId, name: 'Main Campus' });
    if (!mainCampus) {
      const res = await db.collection('campuses').insertOne({
        school_id: schoolId,
        name: 'Main Campus',
        address: '45-A Main Boulevard, Gulberg III, Lahore',
        contact_number: '042-35870011',
        email: 'main.campus@ahmedgrammer.edu.pk',
        website: 'https://ahmedgrammer.edu.pk',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      mainCampus = { _id: res.insertedId, name: 'Main Campus' };
    }

    let cityCampus = await db.collection('campuses').findOne({ school_id: schoolId, name: 'City Campus' });
    if (!cityCampus) {
      const res = await db.collection('campuses').insertOne({
        school_id: schoolId,
        name: 'City Campus',
        address: '12 Model Town Link Road, Lahore',
        contact_number: '042-35170022',
        email: 'city.campus@ahmedgrammer.edu.pk',
        website: 'https://ahmedgrammer.edu.pk',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      cityCampus = { _id: res.insertedId, name: 'City Campus' };
    }

    console.log('2. Preparing 40 Real Teacher & Staff Accounts...');
    const salt = await bcrypt.genSalt(10);
    const commonPasswordHash = await bcrypt.hash('123456', salt);

    const existingUsers = await db.collection('users').find({
      school_id: schoolId,
      _id: { $ne: admin._id }
    }).toArray();
    const existingEmails = new Set(existingUsers.map(u => u.email));

    const teachersToInsert = [];
    const createdTeachers = [];

    for (let i = 1; i <= 30; i++) {
      const isFemale = i % 2 === 0;
      const fn = isFemale ? FIRST_NAMES_F[i % FIRST_NAMES_F.length] : FIRST_NAMES_M[i % FIRST_NAMES_M.length];
      const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
      const name = `${fn} ${ln}`;
      const email = `teacher${i}@ahmedgrammer.edu.pk`;
      const roleDef = TEACHER_ROLES[(i - 1) % TEACHER_ROLES.length];
      const campus = i % 3 === 0 ? cityCampus : mainCampus;

      if (!existingEmails.has(email)) {
        const doc = {
          school_id: schoolId,
          campus_id: campus._id,
          assigned_campuses: [campus._id],
          name,
          email,
          password: commonPasswordHash,
          role: 'Teacher',
          designation: roleDef.desig,
          department: roleDef.dept,
          employee_code: `EMP-${1000 + i}`,
          phone: `030${i % 10}-${1000000 + i * 2341}`,
          cnic: `35201-${1000000 + i * 1111}-1`,
          basic_salary: 45000 + (i % 8) * 8000,
          joining_date: new Date(2022, (i % 12), 1),
          status: 'Active',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        teachersToInsert.push(doc);
      }
    }

    for (let i = 1; i <= 10; i++) {
      const isFemale = i % 2 === 1;
      const fn = isFemale ? FIRST_NAMES_F[(i + 5) % FIRST_NAMES_F.length] : FIRST_NAMES_M[(i + 7) % FIRST_NAMES_M.length];
      const ln = LAST_NAMES[(i * 5) % LAST_NAMES.length];
      const name = `${fn} ${ln}`;
      const email = `staff${i}@ahmedgrammer.edu.pk`;
      const desig = STAFF_ROLES[i - 1];
      const campus = i % 2 === 0 ? cityCampus : mainCampus;

      if (!existingEmails.has(email)) {
        const doc = {
          school_id: schoolId,
          campus_id: campus._id,
          assigned_campuses: [campus._id],
          name,
          email,
          password: commonPasswordHash,
          role: i === 1 ? 'Admin' : 'Staff',
          designation: desig,
          employee_code: `EMP-${1030 + i}`,
          phone: `032${i % 10}-${2000000 + i * 3421}`,
          cnic: `35202-${2000000 + i * 2222}-2`,
          basic_salary: 50000 + (i % 6) * 10000,
          joining_date: new Date(2021, (i % 12), 1),
          status: 'Active',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        teachersToInsert.push(doc);
      }
    }

    if (teachersToInsert.length > 0) {
      const res = await db.collection('users').insertMany(teachersToInsert);
      console.log(`Inserted ${res.insertedCount} teacher & staff accounts.`);
      Object.keys(res.insertedIds).forEach((idx) => {
        createdTeachers.push({ ...teachersToInsert[idx], _id: res.insertedIds[idx] });
      });
    }

    const allTeachers = await db.collection('users').find({ school_id: schoolId, role: 'Teacher' }).toArray();

    console.log('3. Configuring Academic Grades & Sections...');
    const gradeDocs = [];
    for (let i = 0; i < STANDARD_CLASSES.length; i++) {
      const name = STANDARD_CLASSES[i];
      let existingGrade = await db.collection('grades').findOne({ school_id: schoolId, name });
      const assignedTeacher = allTeachers[i % allTeachers.length];

      if (!existingGrade) {
        const res = await db.collection('grades').insertOne({
          school_id: schoolId,
          campus_id: mainCampus._id,
          name,
          sections: ['A', 'B'],
          class_teacher: assignedTeacher ? assignedTeacher._id : null,
          status: 'Active',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        existingGrade = { _id: res.insertedId, name, sections: ['A', 'B'] };
      } else {
        await db.collection('grades').updateOne(
          { _id: existingGrade._id },
          { $set: { class_teacher: assignedTeacher ? assignedTeacher._id : null, campus_id: mainCampus._id } }
        );
      }
      gradeDocs.push(existingGrade);
    }

    console.log('4. Seeding 300 Real Student Profiles...');
    const currentStudentCount = await db.collection('students').countDocuments({ school_id: schoolId });
    const studentsNeeded = Math.max(0, 300 - currentStudentCount);

    if (studentsNeeded > 0) {
      const studentsToInsert = [];
      const sections = ['A', 'B'];

      for (let i = 1; i <= studentsNeeded; i++) {
        const num = currentStudentCount + i;
        const isFemale = num % 2 === 0;
        const firstName = isFemale ? FIRST_NAMES_F[num % FIRST_NAMES_F.length] : FIRST_NAMES_M[num % FIRST_NAMES_M.length];
        const lastName = LAST_NAMES[num % LAST_NAMES.length];
        const fatherFirstName = FIRST_NAMES_M[(num + 3) % FIRST_NAMES_M.length];
        const fatherName = `${fatherFirstName} ${lastName}`;
        const grade = gradeDocs[num % gradeDocs.length];
        const section = sections[num % sections.length];
        const campus = num % 4 === 0 ? cityCampus : mainCampus;

        const birthYear = 2008 + (num % 10);
        const dob = new Date(birthYear, (num % 12), (num % 28) + 1);

        studentsToInsert.push({
          school_id: schoolId,
          campus_id: campus._id,
          current_grade: grade._id,
          current_section: section,
          gr_number: `GR-${1000 + num}`,
          name: `${firstName} ${lastName}`,
          father_name: fatherName,
          gender: isFemale ? 'Female' : 'Male',
          dob,
          b_form: `35201-${3000000 + num * 7}-1`,
          contact_number: `030${num % 9}-${4000000 + num * 123}`,
          emergency_contact_no: `032${num % 8}-${5000000 + num * 456}`,
          monthly_fee: 3500 + (num % 6) * 600,
          discount: num % 7 === 0 ? 500 : 0,
          admission_date: new Date(2023, 3, 1),
          address: {
            current_address: `House #${(num % 90) + 1}, Street ${(num % 15) + 1}, Lahore`,
            permanent_address: `House #${(num % 90) + 1}, Street ${(num % 15) + 1}, Lahore`
          },
          status: 'Active',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      const res = await db.collection('students').insertMany(studentsToInsert);
      console.log(`Inserted ${res.insertedCount} student records.`);
    }

    console.log('5. Seeding Real Staff Room Chat Messages & Circulars...');
    const existingMsgCount = await db.collection('internalmessages').countDocuments({ school_id: schoolId });
    if (existingMsgCount < 15) {
      const leadTeacher = allTeachers[0] || admin;
      const mathTeacher = allTeachers[1] || admin;
      const scienceTeacher = allTeachers[2] || admin;

      const sampleMessages = [
        {
          school_id: schoolId,
          sender_id: admin._id,
          recipient_id: null,
          channel: 'All_Staff',
          content: 'Assalam-o-Alaikum teachers. Please review the updated term syllabus and submit student evaluation marks by Thursday.',
          is_circular: false,
          is_pinned: true,
          read_by: [admin._id]
        },
        {
          school_id: schoolId,
          sender_id: leadTeacher._id,
          recipient_id: null,
          channel: 'All_Staff',
          content: 'Noted Sir. Class 9 and Class 10 assessment sheets are compiled and ready for review.',
          is_circular: false,
          is_pinned: false,
          read_by: [leadTeacher._id, admin._id]
        },
        {
          school_id: schoolId,
          sender_id: mathTeacher._id,
          recipient_id: null,
          channel: 'All_Staff',
          content: 'Mathematics question paper for the upcoming midterm assessment has been finalized in the Question Bank.',
          is_circular: false,
          is_pinned: false,
          read_by: [mathTeacher._id, admin._id]
        },
        {
          school_id: schoolId,
          sender_id: admin._id,
          recipient_id: null,
          channel: 'All_Staff',
          content: 'Official Circular: Winter School Timings will be 8:15 AM to 1:45 PM starting next Monday. All staff must ensure punctuality.',
          is_circular: true,
          is_pinned: true,
          read_by: [admin._id]
        },
        {
          school_id: schoolId,
          sender_id: scienceTeacher._id,
          recipient_id: admin._id,
          channel: 'Direct',
          content: 'Sir, the science lab requires replenishment of test tubes and optical mirrors for the Class 10 physics experiments.',
          is_circular: false,
          is_pinned: false,
          read_by: [scienceTeacher._id]
        },
        {
          school_id: schoolId,
          sender_id: admin._id,
          recipient_id: scienceTeacher._id,
          channel: 'Direct',
          content: 'Approved. Please coordinate with the store manager to raise the procurement purchase order today.',
          is_circular: false,
          is_pinned: false,
          read_by: [admin._id, scienceTeacher._id]
        }
      ];

      await db.collection('internalmessages').insertMany(sampleMessages.map(m => ({ ...m, createdAt: new Date(), updatedAt: new Date() })));
      console.log('Inserted sample internal messages & circulars.');
    }

    console.log('6. Seeding Today Attendance Records & Fee Challans...');
    const allStudents = await db.collection('students').find({ school_id: schoolId }).limit(80).toArray();
    const todayStr = new Date().toISOString().slice(0, 10);

    const attDocs = allStudents.map((s, idx) => ({
      school_id: schoolId,
      campus_id: s.campus_id,
      grade_id: s.current_grade,
      section: s.current_section || 'A',
      student_id: s._id,
      date: todayStr,
      status: idx % 15 === 0 ? 'A' : idx % 10 === 0 ? 'L' : 'P',
      marked_via: 'Card_Scan',
      marked_by: admin._id,
      scan_time: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    for (const att of attDocs) {
      await db.collection('studentattendances').updateOne(
        { school_id: schoolId, student_id: att.student_id, date: att.date },
        { $setOnInsert: att },
        { upsert: true }
      );
    }

    console.log('Seeding finished successfully for ahmedadmin@gmail.com!');
    const finalCounts = {
      students: await db.collection('students').countDocuments({ school_id: schoolId }),
      teachers: await db.collection('users').countDocuments({ school_id: schoolId, role: 'Teacher' }),
      staff: await db.collection('users').countDocuments({ school_id: schoolId, role: { $in: ['Staff', 'Admin'] } }),
      campuses: await db.collection('campuses').countDocuments({ school_id: schoolId }),
      grades: await db.collection('grades').countDocuments({ school_id: schoolId }),
      messages: await db.collection('internalmessages').countDocuments({ school_id: schoolId })
    };
    console.log('FINAL COUNTS:', finalCounts);
  } catch (err) {
    console.error('SEEDING ERROR:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();

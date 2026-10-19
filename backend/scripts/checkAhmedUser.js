const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;
    const schoolId = new mongoose.Types.ObjectId('6aceb9b854a6ebc8e1147ff7');

    const [students, users, campuses, grades, attendances, invoices, messages] = await Promise.all([
      db.collection('students').countDocuments({ school_id: schoolId }),
      db.collection('users').countDocuments({ school_id: schoolId }),
      db.collection('campuses').countDocuments({ school_id: schoolId }),
      db.collection('grades').countDocuments({ school_id: schoolId }),
      db.collection('studentattendances').countDocuments({ school_id: schoolId }),
      db.collection('feeinvoices').countDocuments({ school_id: schoolId }),
      db.collection('internalmessages').countDocuments({ school_id: schoolId })
    ]);

    console.log('CURRENT DATA FOR AHMED GRAMMER:');
    console.log({ students, users, campuses, grades, attendances, invoices, messages });
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();

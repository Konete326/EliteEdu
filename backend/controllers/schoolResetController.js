const Student = require('../models/Student');
const User = require('../models/User');
const Campus = require('../models/Campus');
const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
const StudentAttendance = require('../models/StudentAttendance');
const StaffAttendance = require('../models/StaffAttendance');
const FeeInvoice = require('../models/FeeInvoice');
const FeePayment = require('../models/FeePayment');
const InternalMessage = require('../models/InternalMessage');
const CampusTransferLog = require('../models/CampusTransferLog');
const Notification = require('../models/Notification');
const CrmLead = require('../models/CrmLead');
const ClassTest = require('../models/ClassTest');
const ExamMark = require('../models/ExamMark');
const Homework = require('../models/Homework');
const TimetableSlot = require('../models/TimetableSlot');
const LeaveRequest = require('../models/LeaveRequest');

const resetSchoolData = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    if (!schoolId) {
      return res.status(400).json({ success: false, message: 'No school association found for this user' });
    }

    const [
      studentsRes,
      usersRes,
      campusesRes,
      gradesRes,
      studentAttRes,
      staffAttRes,
      invoicesRes,
      messagesRes,
      transfersRes
    ] = await Promise.all([
      Student.deleteMany({ school_id: schoolId }),
      User.deleteMany({ school_id: schoolId, _id: { $ne: req.user._id }, role: { $ne: 'SuperAdmin' } }),
      Campus.deleteMany({ school_id: schoolId }),
      Grade.deleteMany({ school_id: schoolId }),
      StudentAttendance.deleteMany({ school_id: schoolId }),
      StaffAttendance.deleteMany({ school_id: schoolId }),
      FeeInvoice.deleteMany({ school_id: schoolId }),
      InternalMessage.deleteMany({ school_id: schoolId }),
      CampusTransferLog.deleteMany({ school_id: schoolId }),
      Subject.deleteMany({ school_id: schoolId }),
      FeePayment.deleteMany({ school_id: schoolId }),
      Notification.deleteMany({ school_id: schoolId }),
      CrmLead.deleteMany({ school_id: schoolId }),
      ClassTest.deleteMany({ school_id: schoolId }),
      ExamMark.deleteMany({ school_id: schoolId }),
      Homework.deleteMany({ school_id: schoolId }),
      TimetableSlot.deleteMany({ school_id: schoolId }),
      LeaveRequest.deleteMany({ school_id: schoolId })
    ]);

    res.status(200).json({
      success: true,
      message: 'All school data has been successfully reset',
      summary: {
        studentsDeleted: studentsRes.deletedCount,
        staffDeleted: usersRes.deletedCount,
        campusesDeleted: campusesRes.deletedCount,
        gradesDeleted: gradesRes.deletedCount,
        invoicesDeleted: invoicesRes.deletedCount,
        messagesDeleted: messagesRes.deletedCount,
        transfersDeleted: transfersRes.deletedCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Reset failed: ' + err.message });
  }
};

module.exports = { resetSchoolData };

const Student = require('../models/Student');
const MarkSheet = require('../models/MarkSheet');
const ClassTest = require('../models/ClassTest');
const StudentAttendance = require('../models/StudentAttendance');
const { GradingPolicy, DEFAULT_POLICIES } = require('../models/GradingPolicy');
const RemarkPolicy = require('../models/RemarkPolicy');
const { getInstitutionHeader, calculateAge } = require('../utils/reportHelpers');

const getStudentReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ _id: studentId, school_id: req.user.school_id })
      .populate('current_grade', 'name')
      .populate('campus_id', 'name contact_number address')
      .lean();
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const [markSheets, classTests, attendanceRecords, gradingDoc, remarkPolicies, header] = await Promise.all([
      MarkSheet.find({ school_id: req.user.school_id, 'marks.student_id': studentId })
        .populate('subject_id', 'name code')
        .populate('exam_id', 'title term year session')
        .populate('exam_category_id', 'name')
        .sort({ exam_date: -1 })
        .lean(),
      ClassTest.find({ school_id: req.user.school_id, 'marks.student_id': studentId })
        .populate('subject_id', 'name code')
        .sort({ test_date: -1 })
        .lean(),
      StudentAttendance.find({ school_id: req.user.school_id, student_id: studentId }).lean(),
      GradingPolicy.findOne({ school_id: req.user.school_id }).lean(),
      RemarkPolicy.find({ school_id: req.user.school_id }).lean(),
      getInstitutionHeader(req.user.school_id, student.campus_id?._id)
    ]);

    const examResults = markSheets.map((ms) => {
      const entry = ms.marks?.find((m) => String(m.student_id) === String(studentId)) || {};
      return {
        id: ms._id,
        exam_title: ms.exam_id?.title || ms.exam_category_id?.name || 'Assessment',
        subject_name: ms.subject_id?.name || 'Subject',
        subject_code: ms.subject_id?.code || '',
        max_marks: ms.max_marks || 100,
        obtained_marks: entry.obtained_marks || 0,
        percentage: entry.percentage || 0,
        grade: entry.grade || 'F',
        status_color: entry.status_color || '#DC2626',
        is_absent: entry.is_absent || false,
        teacher_remarks: entry.teacher_remarks || '',
        principal_remarks: entry.principal_remarks || '',
        exam_date: ms.exam_date ? new Date(ms.exam_date).toISOString().split('T')[0] : ''
      };
    });

    const testResults = classTests.map((ct) => {
      const entry = ct.marks?.find((m) => String(m.student_id) === String(studentId)) || {};
      return {
        id: ct._id,
        title: ct.title,
        subject_name: ct.subject_id?.name || 'Subject',
        total_marks: ct.total_marks || 25,
        obtained_marks: entry.obtained_marks || 0,
        percentage: entry.percentage || 0,
        grade_letter: entry.grade_letter || 'F',
        pass_status: entry.pass_status || 'PASS',
        is_absent: entry.is_absent || false,
        test_date: ct.test_date ? new Date(ct.test_date).toISOString().split('T')[0] : ''
      };
    });

    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter((a) => a.status === 'P' || a.status === 'HD').length;
    const absentDays = attendanceRecords.filter((a) => a.status === 'A').length;
    const leaveDays = attendanceRecords.filter((a) => a.status === 'L' || a.status === 'LT').length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    const totalMax = examResults.reduce((acc, r) => acc + (r.is_absent ? 0 : r.max_marks), 0);
    const totalObtained = examResults.reduce((acc, r) => acc + (r.is_absent ? 0 : r.obtained_marks), 0);
    const overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

    const policies = gradingDoc?.policies?.length ? gradingDoc.policies : DEFAULT_POLICIES;
    const matchedPolicy = policies.find((p) => overallPercentage >= p.from_percent && overallPercentage <= p.to_percent) || policies[policies.length - 1];

    const teacherRemarkObj = remarkPolicies.find((r) => r.type === 'Teacher' && overallPercentage >= r.from_percent && overallPercentage <= r.to_percent);
    const principalRemarkObj = remarkPolicies.find((r) => r.type === 'Principal' && overallPercentage >= r.from_percent && overallPercentage <= r.to_percent);

    return res.status(200).json({
      success: true,
      student: {
        ...student,
        age: calculateAge(student.dob)
      },
      header,
      examResults,
      testResults,
      academicSummary: {
        totalMax,
        totalObtained,
        overallPercentage,
        overallGrade: matchedPolicy?.letter_grade || 'F',
        statusColor: matchedPolicy?.status_color || '#DC2626',
        resultStatus: overallPercentage >= 33 ? 'Passed' : 'Needs Improvement'
      },
      remarks: {
        teacher: teacherRemarkObj?.remark || 'Good effort. Keep progressing.',
        principal: principalRemarkObj?.remark || 'Promoted to the next class.'
      },
      attendance: { totalDays, presentDays, absentDays, leaveDays, attendancePercentage }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStudentReportCard };

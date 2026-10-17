const { createSystemNotification } = require('./notificationDispatcher');

const notifyTeacherAssignedTest = (test, schoolId, creatorId) => {
  if (!test.teacher_id) return;
  createSystemNotification({
    school_id: schoolId,
    campus_id: test.campus_id || null,
    title: 'Class Test Assigned',
    message: `You have been assigned to conduct "${test.title}" for class test date ${new Date(test.test_date).toLocaleDateString()}.`,
    type: 'Academic',
    priority: 'Normal',
    target_audience: 'Specific_User',
    target_user_id: test.teacher_id,
    action_url: '/teacher/class-tests',
    created_by: creatorId
  });
};

const notifyAdminMarksSubmitted = (test, schoolId, teacherUser) => {
  createSystemNotification({
    school_id: schoolId,
    campus_id: test.campus_id || null,
    title: 'Class Test Marks Submitted',
    message: `${teacherUser.name || 'Teacher'} submitted marks for test "${test.title}".`,
    type: 'Academic',
    priority: 'Normal',
    target_audience: 'Admins',
    action_url: '/admin/class-tests/manage',
    created_by: teacherUser._id || teacherUser.id
  });
};

module.exports = { notifyTeacherAssignedTest, notifyAdminMarksSubmitted };

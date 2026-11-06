const { handleStudentOnboarding, handleUserOnboarding } = require('./onboardingHelper');

const completeOnboarding = async (req, res) => {
  try {
    const isStudent = req.user?.role === 'Student';
    const isAdmin = req.user?.role === 'Admin';
    const skip = Boolean(req.body?.skip);

    if (!skip) {
      if (req.body?.new_password) {
        const pass = String(req.body.new_password).trim();
        if (pass.length < 6) {
          return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }
        const confirmPass = req.body.confirm_password !== undefined ? String(req.body.confirm_password).trim() : '';
        if (!confirmPass || pass !== confirmPass) {
          return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
      }
      if (isAdmin && (!req.body?.school_name || !String(req.body.school_name).trim())) {
        return res.status(400).json({ success: false, message: 'Institution / school name is required' });
      }
      if (req.body?.name !== undefined && !String(req.body.name).trim()) {
        return res.status(400).json({ success: false, message: 'Full name is required' });
      }
    }

    if (isStudent) {
      const studentId = req.user.student_id || req.user.id;
      const userPayload = await handleStudentOnboarding(studentId, req.body, skip);
      if (!userPayload) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      return res.status(200).json({
        success: true,
        message: skip ? 'Setup skipped successfully' : 'Student profile setup completed',
        user: userPayload
      });
    }

    const userId = req.user.id;
    const userPayload = await handleUserOnboarding(userId, req.user.school_id, req.body, skip, isAdmin);
    if (!userPayload) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      message: skip ? 'Onboarding skipped successfully' : 'Onboarding profile setup completed successfully',
      user: userPayload
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to complete onboarding' });
  }
};

module.exports = { completeOnboarding };

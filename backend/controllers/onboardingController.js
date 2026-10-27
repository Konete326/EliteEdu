const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const School = require('../models/School');
const { getSchoolMeta } = require('../utils/schoolMeta');
const { resolveEffectivePermissions } = require('../utils/permissionResolver');

const buildUserPayload = (user, meta) => {
  const { effective, appSettings } = resolveEffectivePermissions(user);
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    contact_number: user.contact_number || '',
    photo_url: user.photo_url || '',
    school_id: user.school_id,
    campus_id: user.campus_id,
    last_active_campus: user.last_active_campus || user.campus_id || null,
    assigned_campuses: user.assigned_campuses || [],
    custom_role_id: user.custom_role_id,
    custom_role: user.custom_role_id,
    permissions: user.custom_role_id?.permissions || [],
    effective_permissions: effective,
    dashboard_type: user.custom_role_id?.dashboard_type || (user.role === 'Admin' ? 'AdminDashboard' : 'TeacherDashboard'),
    school_type: meta.school_type,
    school_name: meta.school_name,
    school_logo: meta.school_logo,
    school_slogan: meta.school_slogan,
    theme_settings: meta.theme_settings,
    app_settings: appSettings,
    first_login: false,
    onboarding_completed: true
  };
};

const completeOnboarding = async (req, res) => {
  try {
    const isStudent = req.user?.role === 'Student';
    const isAdmin = req.user?.role === 'Admin';
    const isTeacher = req.user?.role === 'Teacher';
    const skip = Boolean(req.body?.skip);

    if (isStudent) {
      const studentId = req.user.student_id || req.user.id;
      if (skip) {
        const student = await Student.findByIdAndUpdate(
          studentId,
          { $set: { onboarding_completed: true, first_login: false } },
          { new: true }
        ).lean();
        const meta = await getSchoolMeta(student?.school_id);
        return res.status(200).json({
          success: true,
          message: 'Setup skipped successfully',
          user: {
            id: student._id,
            student_id: student._id,
            name: student.name,
            role: 'Student',
            first_login: false,
            onboarding_completed: true,
            school_type: meta.school_type || 'Private'
          }
        });
      }

      const updateData = { onboarding_completed: true, first_login: false };
      if (req.body.blood_group) updateData.blood_group = String(req.body.blood_group).trim();
      if (req.body.gender) updateData.gender = req.body.gender;
      if (req.body.dob) updateData.dob = new Date(req.body.dob);
      if (req.body.contact_number) updateData.contact_number = String(req.body.contact_number).trim();
      if (req.body.emergency_contact_no) updateData.emergency_contact_no = String(req.body.emergency_contact_no).trim();
      if (req.body.address) {
        updateData['address.street_address'] = String(req.body.address).trim();
      }
      if (req.body.city) {
        updateData['address.city'] = String(req.body.city).trim();
      }
      if (req.body.new_password && String(req.body.new_password).trim().length >= 6) {
        const salt = await bcrypt.genSalt(10);
        updateData.portal_password = await bcrypt.hash(String(req.body.new_password).trim(), salt);
        updateData.portal_temp_password = '';
      }

      const updatedStudent = await Student.findByIdAndUpdate(studentId, { $set: updateData }, { new: true }).lean();
      const meta = await getSchoolMeta(updatedStudent?.school_id);
      return res.status(200).json({
        success: true,
        message: 'Student profile setup completed',
        user: {
          id: updatedStudent._id,
          student_id: updatedStudent._id,
          name: updatedStudent.name,
          role: 'Student',
          first_login: false,
          onboarding_completed: true,
          school_type: meta.school_type || 'Private'
        }
      });
    }

    const userId = req.user.id;
    const userDoc = await User.findById(userId);
    if (!userDoc) return res.status(404).json({ success: false, message: 'User not found' });

    if (skip) {
      userDoc.onboarding_completed = true;
      userDoc.first_login = false;
      await userDoc.save();
      const meta = await getSchoolMeta(userDoc.school_id);
      return res.status(200).json({
        success: true,
        message: 'Onboarding skipped successfully',
        user: buildUserPayload(userDoc, meta)
      });
    }

    if (isAdmin && userDoc.school_id) {
      const schoolUpdates = {};
      if (req.body.school_name && req.body.school_name.trim()) schoolUpdates.name = req.body.school_name.trim();
      if (req.body.slogan !== undefined) schoolUpdates.slogan = req.body.slogan.trim();
      if (req.body.board !== undefined) schoolUpdates.board = req.body.board.trim();
      if (req.body.logo_url !== undefined) schoolUpdates.logo_url = req.body.logo_url.trim();
      if (req.body.school_phone !== undefined) schoolUpdates.contact_number = req.body.school_phone.trim();
      if (req.body.school_email !== undefined) schoolUpdates.email = req.body.school_email.trim().toLowerCase();
      if (req.body.school_address !== undefined) schoolUpdates.address = req.body.school_address.trim();
      if (req.body.school_type && ['Private', 'Government'].includes(req.body.school_type)) {
        schoolUpdates.school_type = req.body.school_type;
      }
      if (req.body.currency !== undefined) schoolUpdates.currency = req.body.currency.trim();

      if (Object.keys(schoolUpdates).length > 0) {
        await School.findByIdAndUpdate(userDoc.school_id, { $set: schoolUpdates });
      }
    }

    const userUpdates = {
      onboarding_completed: true,
      first_login: false
    };

    if (req.body.name && req.body.name.trim()) userUpdates.name = req.body.name.trim();
    if (req.body.contact_number !== undefined) userUpdates.contact_number = String(req.body.contact_number).trim();
    if (req.body.whatsapp_number !== undefined) userUpdates.whatsapp_number = String(req.body.whatsapp_number).trim();
    if (req.body.cnic !== undefined) userUpdates.cnic = String(req.body.cnic).trim();
    if (req.body.dob) userUpdates.dob = new Date(req.body.dob);
    if (req.body.gender) userUpdates.gender = req.body.gender;
    if (req.body.photo_url !== undefined) userUpdates.photo_url = req.body.photo_url.trim();
    if (req.body.current_address !== undefined) userUpdates.current_address = String(req.body.current_address).trim();
    if (req.body.city !== undefined) userUpdates.city = String(req.body.city).trim();
    if (req.body.qualification !== undefined) userUpdates.qualification = String(req.body.qualification).trim();
    if (req.body.specialization !== undefined) userUpdates.specialization = String(req.body.specialization).trim();
    if (req.body.experience_years !== undefined) userUpdates.experience_years = Number(req.body.experience_years) || 0;

    if (req.body.emergency_contact_name || req.body.emergency_contact_phone) {
      userUpdates.emergency_contact = {
        name: String(req.body.emergency_contact_name || '').trim(),
        phone: String(req.body.emergency_contact_phone || '').trim(),
        relation: String(req.body.emergency_contact_relation || 'Relative').trim()
      };
    }

    if (req.body.new_password && String(req.body.new_password).trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      userUpdates.password = await bcrypt.hash(String(req.body.new_password).trim(), salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userUpdates },
      { new: true, runValidators: true }
    ).populate('custom_role_id').lean();

    const meta = await getSchoolMeta(updatedUser.school_id);
    return res.status(200).json({
      success: true,
      message: 'Onboarding profile setup completed successfully',
      user: buildUserPayload(updatedUser, meta)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to complete onboarding' });
  }
};

module.exports = { completeOnboarding };

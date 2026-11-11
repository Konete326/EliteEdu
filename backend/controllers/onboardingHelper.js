const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const School = require('../models/School');
const { getSchoolMeta, invalidateSchoolMetaCache } = require('../utils/schoolMeta');
const { resolveEffectivePermissions } = require('../utils/permissionResolver');
const { buildStudentUserPayload } = require('./authStudentHelper');

const buildUserPayload = (user, meta = {}) => {
  const { effective, appSettings } = resolveEffectivePermissions(user);
  return {
    id: user._id, name: user.name, email: user.email, role: user.role,
    contact_number: user.contact_number || '', photo_url: user.photo_url || '',
    school_id: user.school_id, campus_id: user.campus_id,
    last_active_campus: user.last_active_campus || user.campus_id || null,
    assigned_campuses: user.assigned_campuses || [],
    custom_role_id: user.custom_role_id, custom_role: user.custom_role_id,
    permissions: user.custom_role_id?.permissions || [], effective_permissions: effective,
    dashboard_type: user.custom_role_id?.dashboard_type || (user.role === 'Admin' ? 'AdminDashboard' : 'TeacherDashboard'),
    school_type: meta.school_type, school_name: meta.school_name,
    school_logo: meta.school_logo, school_slogan: meta.school_slogan,
    theme_settings: user.theme_settings?.mode ? { ...meta.theme_settings, ...user.theme_settings } : meta.theme_settings,
    app_settings: appSettings, first_login: false,
    onboarding_completed: Boolean(user.onboarding_completed || user.onboarding_status === 'completed'),
    onboarding_skipped: Boolean(user.onboarding_skipped || user.onboarding_status === 'skipped'),
    onboarding_status: user.onboarding_status || (user.onboarding_completed ? 'completed' : user.onboarding_skipped ? 'skipped' : 'pending')
  };
};

const handleStudentOnboarding = async (studentId, body = {}, skip = false) => {
  if (skip) {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { onboarding_completed: true, onboarding_skipped: true, onboarding_status: 'skipped', first_login: false } },
      { returnDocument: 'after' }
    ).populate('school_id').populate('campus_id').populate('current_grade').lean();
    return student ? buildStudentUserPayload(student, await getSchoolMeta(student.school_id?._id || student.school_id)) : null;
  }

  const updateData = { onboarding_completed: true, onboarding_skipped: false, onboarding_status: 'completed', first_login: false };
  if (body.name?.trim()) updateData.name = body.name.trim();
  if (body.blood_group) updateData.blood_group = String(body.blood_group).trim();
  if (['Male', 'Female', 'Other'].includes(body.gender)) updateData.gender = body.gender;
  if (body.dob) {
    const d = new Date(body.dob);
    if (!isNaN(d.getTime())) updateData.dob = d;
  }
  if (body.contact_number) updateData.contact_number = String(body.contact_number).trim();
  if (body.emergency_contact_no) updateData.emergency_contact_no = String(body.emergency_contact_no).trim();
  if (body.photo_url) updateData.photo_url = String(body.photo_url).trim();
  if (body.address || body.current_address) updateData['address.current_address'] = String(body.address || body.current_address).trim();
  if (body.city || body.area) updateData['address.area'] = String(body.city || body.area).trim();
  if (body.new_password?.trim()?.length >= 6) {
    const salt = await bcrypt.genSalt(10);
    updateData.portal_password = await bcrypt.hash(body.new_password.trim(), salt);
    updateData.portal_temp_password = '';
  }

  const updatedStudent = await Student.findByIdAndUpdate(studentId, { $set: updateData }, { returnDocument: 'after' })
    .populate('school_id').populate('campus_id').populate('current_grade').lean();
  return updatedStudent ? buildStudentUserPayload(updatedStudent, await getSchoolMeta(updatedStudent.school_id?._id || updatedStudent.school_id)) : null;
};

const handleUserOnboarding = async (userId, schoolId, body = {}, skip = false, isAdmin = false) => {
  if (skip) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { onboarding_completed: true, onboarding_skipped: true, onboarding_status: 'skipped', first_login: false } },
      { returnDocument: 'after' }
    ).populate('custom_role_id').lean();
    return updatedUser ? buildUserPayload(updatedUser, await getSchoolMeta(updatedUser.school_id || schoolId)) : null;
  }

  const effectiveSchoolId = schoolId || (await User.findById(userId).select('school_id').lean())?.school_id;
  if (isAdmin && effectiveSchoolId) {
    const sUp = {};
    if (body.school_name?.trim()) sUp.name = body.school_name.trim();
    ['slogan', 'board', 'logo_url', 'school_phone', 'currency', 'established_year'].forEach((k) => {
      const field = k === 'school_phone' ? 'contact_number' : k;
      if (body[k] !== undefined) sUp[field] = String(body[k]).trim();
    });
    if (body.school_email !== undefined) sUp.email = String(body.school_email).trim().toLowerCase();
    if (body.school_address !== undefined) sUp.address = String(body.school_address).trim();
    if (body.session || body.academic_session) sUp.academic_session = String(body.session || body.academic_session).trim();
    if (['Private', 'Government'].includes(body.school_type)) sUp.school_type = body.school_type;
    if (Object.keys(sUp).length > 0) {
      await School.findByIdAndUpdate(effectiveSchoolId, { $set: sUp }, { returnDocument: 'after' });
      invalidateSchoolMetaCache(effectiveSchoolId);
    }
  }

  const uUp = { onboarding_completed: true, onboarding_skipped: false, onboarding_status: 'completed', first_login: false };
  if (body.name?.trim()) uUp.name = body.name.trim();
  ['contact_number', 'whatsapp_number', 'cnic', 'current_address', 'city', 'qualification', 'specialization', 'photo_url'].forEach((k) => {
    if (body[k] !== undefined) uUp[k] = String(body[k]).trim();
  });
  if (['Male', 'Female', 'Other'].includes(body.gender)) uUp.gender = body.gender;
  if (body.dob) {
    const d = new Date(body.dob);
    if (!isNaN(d.getTime())) uUp.dob = d;
  }
  if (body.experience_years !== undefined) uUp.experience_years = Math.max(0, Number(body.experience_years) || 0);
  if (body.emergency_contact_name || body.emergency_contact_phone) {
    uUp.emergency_contact = {
      name: String(body.emergency_contact_name || '').trim(),
      phone: String(body.emergency_contact_phone || '').trim(),
      relation: String(body.emergency_contact_relation || 'Relative').trim()
    };
  }
  if (body.new_password?.trim()?.length >= 6) {
    const salt = await bcrypt.genSalt(10);
    uUp.password = await bcrypt.hash(body.new_password.trim(), salt);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, { $set: uUp }, { returnDocument: 'after', runValidators: true })
    .populate('custom_role_id').lean();
  return updatedUser ? buildUserPayload(updatedUser, await getSchoolMeta(updatedUser.school_id || effectiveSchoolId)) : null;
};

module.exports = { buildUserPayload, handleStudentOnboarding, handleUserOnboarding };

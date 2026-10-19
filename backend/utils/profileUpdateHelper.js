const bcrypt = require('bcryptjs');

const sanitizeProfileBody = (body) => {
  const fields = {};
  if (body.name !== undefined) fields.name = String(body.name).trim();
  if (body.email !== undefined && body.email) fields.email = String(body.email).toLowerCase().trim();
  const fatherName = body.father_name !== undefined ? body.father_name : body.father_Or_husband_name;
  if (fatherName !== undefined) fields.father_name = String(fatherName).trim();
  if (body.cnic !== undefined) fields.cnic = String(body.cnic).trim();
  if (body.dob !== undefined) fields.dob = body.dob ? new Date(body.dob) : null;
  if (body.gender !== undefined) fields.gender = body.gender;
  if (body.marital_status !== undefined) fields.marital_status = body.marital_status;
  if (body.blood_group !== undefined) fields.blood_group = String(body.blood_group).trim();
  if (body.religion !== undefined) fields.religion = String(body.religion).trim();
  if (body.nationality !== undefined) fields.nationality = String(body.nationality).trim();
  const photo = body.photo_url !== undefined ? body.photo_url : body.avatar_url;
  if (photo !== undefined) fields.photo_url = photo;

  const phone = body.contact_number !== undefined ? body.contact_number : body.phone;
  if (phone !== undefined) fields.contact_number = String(phone).trim();
  if (body.whatsapp_number !== undefined) fields.whatsapp_number = String(body.whatsapp_number).trim();

  const emergencyName = body.emergency_contact_name || body.emergency_contact?.name;
  const emergencyPhone = body.emergency_contact_phone || body.emergency_contact?.phone;
  const emergencyRelation = body.emergency_contact_relation || body.emergency_contact?.relation;
  if (emergencyName !== undefined || emergencyPhone !== undefined || emergencyRelation !== undefined) {
    fields.emergency_contact = {
      name: emergencyName !== undefined ? String(emergencyName).trim() : '',
      phone: emergencyPhone !== undefined ? String(emergencyPhone).trim() : '',
      relation: emergencyRelation !== undefined ? String(emergencyRelation).trim() : ''
    };
  }

  const addr = body.current_address !== undefined ? body.current_address : body.address;
  if (addr !== undefined) fields.current_address = String(addr).trim();
  if (body.permanent_address !== undefined) fields.permanent_address = String(body.permanent_address).trim();
  if (body.city !== undefined) fields.city = String(body.city).trim();

  if (body.qualification !== undefined) fields.qualification = String(body.qualification).trim();
  if (body.specialization !== undefined) fields.specialization = String(body.specialization).trim();
  if (body.experience_years !== undefined) fields.experience_years = Number(body.experience_years) || 0;

  const bName = body.bank_name || body.bank_details?.bank_name;
  const bTitle = body.account_title || body.bank_details?.account_title;
  const bAcc = body.account_number || body.account_number_Or_iban || body.bank_details?.account_number;
  const bIban = body.iban || body.bank_details?.iban;
  const bBranch = body.branch_code || body.bank_details?.branch_code;
  if (bName !== undefined || bTitle !== undefined || bAcc !== undefined || bIban !== undefined || bBranch !== undefined) {
    fields.bank_details = {
      bank_name: bName !== undefined ? String(bName).trim() : '',
      account_title: bTitle !== undefined ? String(bTitle).trim() : '',
      account_number: bAcc !== undefined ? String(bAcc).trim() : '',
      iban: bIban !== undefined ? String(bIban).trim() : '',
      branch_code: bBranch !== undefined ? String(bBranch).trim() : ''
    };
  }
  return fields;
};

const verifyAndHashPassword = async (user, currentPassword, newPassword) => {
  if (!currentPassword) {
    const err = new Error('Current password is required to set a new password');
    err.status = 400;
    throw err;
  }
  if (!newPassword || String(newPassword).length < 6) {
    const err = new Error('New password must be at least 6 characters long');
    err.status = 400;
    throw err;
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const err = new Error('Current password is incorrect');
    err.status = 400;
    throw err;
  }
  return bcrypt.hash(newPassword, 10);
};

module.exports = { sanitizeProfileBody, verifyAndHashPassword };

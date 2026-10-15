const mongoose = require('mongoose');

const buildApplicantFilter = (query, schoolId) => {
  const { campus_id, status, department, availability, search } = query;
  const filter = { school_id: schoolId };

  if (campus_id && campus_id !== 'all' && mongoose.Types.ObjectId.isValid(campus_id)) {
    filter.campus_id = campus_id;
  }
  if (status && status !== 'all') {
    filter.status = status;
  }
  if (department && department !== 'all') {
    filter.department = department;
  }
  if (availability && availability !== 'all') {
    filter.availability = availability;
  }
  if (search && search.trim()) {
    const q = search.trim();
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { department: { $regex: q, $options: 'i' } },
      { designation: { $regex: q, $options: 'i' } },
      { contact_number: { $regex: q, $options: 'i' } },
      { cnic: { $regex: q, $options: 'i' } }
    ];
  }
  return filter;
};

module.exports = { buildApplicantFilter };

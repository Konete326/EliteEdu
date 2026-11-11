const mongoose = require('mongoose');
const Student = require('../models/Student');

const familyLookup = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const rawCnic = String(req.query.cnic || '').trim();
    const digits = rawCnic.replace(/\D/g, '');
    if (digits.length < 9) {
      return res.status(200).json({ success: true, found: false, message: 'CNIC too short' });
    }

    const formatted = digits.length === 13 ? `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}` : null;
    const targets = [rawCnic, digits];
    if (formatted) targets.push(formatted);

    const filter = {
      school_id: schoolId,
      $or: [
        { 'parents_cnic.father_cnic': { $in: targets } },
        { 'parents_cnic.guardian_cnic': { $in: targets } }
      ]
    };

    const existing = await Student.find(filter)
      .populate('current_grade', 'name')
      .sort({ createdAt: -1 })
      .lean();

    if (!existing || existing.length === 0) {
      return res.status(200).json({ success: true, found: false });
    }

    const primary = existing[0];
    const siblings = existing.map((s) => ({
      _id: s._id,
      name: s.name,
      gr_number: s.gr_number,
      grade_name: s.current_grade?.name || '',
      section: s.current_section || '',
      status: s.status
    }));

    res.status(200).json({
      success: true,
      found: true,
      data: {
        family_number: primary.family_number || '',
        father_name: primary.father_name || '',
        surname: primary.surname || '',
        mother_guardian_name: primary.mother_guardian_name || '',
        contact_number: primary.contact_number || '',
        emergency_contact_no: primary.emergency_contact_no || '',
        address: primary.address || '',
        father_details: primary.father_details || {},
        mother_details: primary.mother_details || {},
        parents_cnic: primary.parents_cnic || {},
        siblings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Family lookup failed', error: error.message });
  }
};

module.exports = { familyLookup };


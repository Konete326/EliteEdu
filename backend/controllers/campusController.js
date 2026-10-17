const Campus = require('../models/Campus');
const resolveSchoolId = require('../utils/schoolResolver');

const getCampuses = async (req, res) => {
  try {
    const schoolId = await resolveSchoolId(req);
    if (!schoolId) return res.status(200).json({ success: true, campuses: [] });

    const campuses = await Campus.find({ school_id: schoolId })
      .populate('school_id', 'name logo_url')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, campuses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch campuses', error: error.message });
  }
};

const createCampus = async (req, res) => {
  try {
    const schoolId = await resolveSchoolId(req);
    if (!schoolId) return res.status(400).json({ message: 'School association required' });

    const { name, email, website, address, contact_number, status, image_url, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Campus name is required' });
    }

    if (status && !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either Active or Inactive' });
    }

    const campus = await Campus.create({
      school_id: schoolId,
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : '',
      website: website ? website.trim() : '',
      address: address ? address.trim() : '',
      contact_number: contact_number ? contact_number.trim() : '',
      image_url: (image_url || image || '').trim(),
      status: status || 'Active'
    });

    res.status(201).json({ success: true, campus });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create campus', error: error.message });
  }
};

const updateCampus = async (req, res) => {
  try {
    const schoolId = await resolveSchoolId(req);
    const { id } = req.params;
    const { name, email, website, address, contact_number, status, image_url, image } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: 'Campus name cannot be empty' });
    }

    if (status && !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either Active or Inactive' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (website !== undefined) updateData.website = website.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (contact_number !== undefined) updateData.contact_number = contact_number.trim();
    if (image_url !== undefined) updateData.image_url = image_url.trim();
    else if (image !== undefined) updateData.image_url = image.trim();
    if (status !== undefined) updateData.status = status;

    const filter = schoolId ? { _id: id, school_id: schoolId } : { _id: id };
    const campus = await Campus.findOneAndUpdate(filter, updateData, { new: true, runValidators: true });

    if (!campus) {
      return res.status(404).json({ message: 'Campus not found or unauthorized' });
    }

    res.status(200).json({ success: true, campus });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update campus', error: error.message });
  }
};

const deleteCampus = async (req, res) => {
  try {
    const schoolId = await resolveSchoolId(req);
    const { id } = req.params;

    const filter = schoolId ? { _id: id, school_id: schoolId } : { _id: id };
    const campus = await Campus.findOneAndDelete(filter);
    if (!campus) {
      return res.status(404).json({ message: 'Campus not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Campus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete campus', error: error.message });
  }
};

module.exports = {
  getCampuses,
  createCampus,
  updateCampus,
  deleteCampus
};

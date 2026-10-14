const School = require('../models/School');
const User = require('../models/User');

const updateSchool = async (req, res) => {
  const { name, school_type, board, contact_number, email, address } = req.body;
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      { name, school_type, board, contact_number, email, address },
      { new: true, runValidators: true }
    );
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ message: 'School updated successfully', school });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update school', error: error.message });
  }
};

const toggleSchoolStatus = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: 'School not found' });
    school.is_active = !school.is_active;
    await school.save();
    res.status(200).json({ message: 'Status updated successfully', is_active: school.is_active });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) return res.status(404).json({ message: 'School not found' });
    await User.deleteMany({ school_id: req.params.id });
    res.status(200).json({ message: 'School and associated accounts deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete school', error: error.message });
  }
};

module.exports = { updateSchool, toggleSchoolStatus, deleteSchool };

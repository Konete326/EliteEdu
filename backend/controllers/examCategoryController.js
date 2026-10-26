const ExamCategory = require('../models/ExamCategory');

const getCategories = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    let categories = await ExamCategory.find({ school_id }).sort({ createdAt: -1 }).lean();
    if (categories.length === 0) {
      const defaultCats = [
        { name: 'Exam', description: 'Standard Term Examination' },
        { name: 'Mid Term', description: 'Mid-Year Comprehensive Assessment' },
        { name: 'Final Term', description: 'Annual Final Examination' },
        { name: 'Monthly Test', description: 'Monthly Class Assessment' }
      ];
      categories = await ExamCategory.insertMany(defaultCats.map(c => ({ ...c, school_id, status: 'Active' })));
    }
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const { name, description, status } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Category name is required' });
    const exists = await ExamCategory.findOne({ school_id, name: name.trim() }).select('_id').lean();
    if (exists) return res.status(400).json({ message: 'Category with this name already exists' });
    const category = await ExamCategory.create({
      school_id, name: name.trim(), description: description || '', status: status || 'Active'
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const category = await ExamCategory.findOneAndUpdate(
      { _id: id, school_id: req.user.school_id },
      { name, description, status },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await ExamCategory.findOneAndDelete({ _id: req.params.id, school_id: req.user.school_id });
    res.json({ success: true, message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

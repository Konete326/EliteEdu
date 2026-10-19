const StoreItem = require('../models/StoreItem');

const SEED_ITEMS = [
  { sku: 'BK-MTH-09', name: 'Grade 9 Mathematics Textbook', category: 'Textbooks', cost_price: 600, sale_price: 850, stock_qty: 45 },
  { sku: 'BK-ENG-08', name: 'Oxford English Reader 8', category: 'Textbooks', cost_price: 700, sale_price: 950, stock_qty: 30 },
  { sku: 'UNF-BLZ-M', name: 'School Monogram Blazer (M)', category: 'Uniform', cost_price: 1800, sale_price: 2400, stock_qty: 25 },
  { sku: 'UNF-TIE-01', name: 'Official School Tie & Belt Set', category: 'Sports & Tie/Belt', cost_price: 300, sale_price: 450, stock_qty: 60 },
  { sku: 'COP-REG-01', name: 'Broad Lines Register (200 Pgs)', category: 'Copies & Registers', cost_price: 110, sale_price: 160, stock_qty: 120 },
  { sku: 'STN-KIT-01', name: 'Geometry & Writing Kit', category: 'Stationery', cost_price: 240, sale_price: 350, stock_qty: 80 }
];

const getItems = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });
    const { category, search, status } = req.query;
    const count = await StoreItem.countDocuments({ school_id: schoolId });
    if (count === 0) {
      const seeds = SEED_ITEMS.map((item) => ({ ...item, school_id: schoolId, status: 'Active' }));
      await StoreItem.insertMany(seeds);
    }
    const query = { school_id: schoolId };
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { sku: { $regex: search, $options: 'i' } }];
    }
    const items = await StoreItem.find(query).populate('grade_id', 'name').sort({ name: 1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { sku, name, category, grade_id, cost_price, sale_price, stock_qty, min_stock_alert } = req.body;
    if (!sku || !name || sale_price === undefined) {
      return res.status(400).json({ message: 'SKU, name, and sale price are required' });
    }
    const existing = await StoreItem.findOne({ school_id: schoolId, sku: String(sku).trim() });
    if (existing) return res.status(400).json({ message: 'Item SKU already exists' });
    const stock = Number(stock_qty) || 0;
    const item = await StoreItem.create({
      school_id: schoolId,
      campus_id: req.body.campus_id || null,
      sku: String(sku).trim(),
      name: String(name).trim(),
      category: category || 'Textbooks',
      grade_id: grade_id || null,
      cost_price: Number(cost_price) || 0,
      sale_price: Number(sale_price),
      stock_qty: stock,
      min_stock_alert: Number(min_stock_alert) || 10,
      status: stock > 0 ? 'Active' : 'Out_Of_Stock'
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { stock_qty } = req.body;
    const payload = { ...req.body };
    if (stock_qty !== undefined) {
      payload.status = Number(stock_qty) > 0 ? 'Active' : 'Out_Of_Stock';
    }
    const item = await StoreItem.findOneAndUpdate({ _id: req.params.id, school_id: schoolId }, { $set: payload }, { new: true });
    if (!item) return res.status(404).json({ message: 'Store item not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    await StoreItem.findOneAndDelete({ _id: req.params.id, school_id: schoolId });
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem };

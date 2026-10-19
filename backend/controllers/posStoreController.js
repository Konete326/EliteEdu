const StoreItem = require('../models/StoreItem');
const PosSale = require('../models/PosSale');
const { checkout } = require('./posCheckoutController');

const SEED_ITEMS = [
  { item_code: 'BK-PAK-01', sku: 'BK-PAK-01', name: 'Complete Textbook Set', category: 'Textbooks', cost_price: 2600, sale_price: 3500, stock_qty: 50, min_stock_alert: 10 },
  { item_code: 'NB-PAK-12', sku: 'NB-PAK-12', name: 'Printed School Notebooks (Pack of 12)', category: 'Notebooks & Copies', cost_price: 1200, sale_price: 1800, stock_qty: 100, min_stock_alert: 15 },
  { item_code: 'UNF-SUM-01', sku: 'UNF-SUM-01', name: 'Summer Uniform Set', category: 'Uniform', cost_price: 1700, sale_price: 2400, stock_qty: 40, min_stock_alert: 8 },
  { item_code: 'UNF-WIN-01', sku: 'UNF-WIN-01', name: 'Winter Blazer / Sweater', category: 'Uniform', cost_price: 2300, sale_price: 3200, stock_qty: 30, min_stock_alert: 5 },
  { item_code: 'ACC-TIE-01', sku: 'ACC-TIE-01', name: 'School Tie, Belt & Badge', category: 'ID Card & Lanyard', cost_price: 420, sale_price: 650, stock_qty: 75, min_stock_alert: 15 },
  { item_code: 'ACC-LAN-01', sku: 'ACC-LAN-01', name: 'Student ID Lanyard & Holder', category: 'ID Card & Lanyard', cost_price: 140, sale_price: 250, stock_qty: 120, min_stock_alert: 20 }
];

const getItems = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    if (!schoolId) return res.status(403).json({ message: 'School ID required' });
    const { category, search, status } = req.query;
    const count = await StoreItem.countDocuments({ school_id: schoolId });
    if (count === 0) {
      await StoreItem.insertMany(SEED_ITEMS.map((i) => ({ ...i, school_id: schoolId, status: 'Active' })));
    }
    const query = { school_id: schoolId };
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { sku: { $regex: search, $options: 'i' } }, { item_code: { $regex: search, $options: 'i' } }];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [items, allItems, todaySales, monthSales] = await Promise.all([
      StoreItem.find(query).populate('grade_id', 'name').sort({ name: 1 }).lean(),
      StoreItem.find({ school_id: schoolId }).select('stock_qty min_stock_alert').lean(),
      PosSale.aggregate([{ $match: { school_id: schoolId, createdAt: { $gte: startOfToday } } }, { $group: { _id: null, total: { $sum: '$net_total' } } }]),
      PosSale.aggregate([{ $match: { school_id: schoolId, createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$net_total' } } }])
    ]);

    const totalItems = allItems.length;
    const lowStockCount = allItems.filter((i) => (i.stock_qty || 0) <= (i.min_stock_alert || 5)).length;
    const todaySalesAmount = todaySales[0]?.total || 0;
    const monthSalesAmount = monthSales[0]?.total || 0;

    res.status(200).json({ success: true, data: items, stats: { totalItems, lowStockCount, todaySalesAmount, monthSalesAmount } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { item_code, sku, name, category, grade_id, cost_price, sale_price, stock_qty, min_stock_alert } = req.body;
    const code = item_code || sku;
    if (!code || !name || sale_price === undefined) return res.status(400).json({ message: 'Code, name, and sale price are required' });
    const stock = Number(stock_qty) || 25;
    const item = await StoreItem.create({
      school_id: schoolId, campus_id: req.body.campus_id || null, item_code: String(code).trim(), sku: String(code).trim(),
      name: String(name).trim(), category: category || 'Textbooks', grade_id: grade_id || null,
      cost_price: Number(cost_price) || 0, sale_price: Number(sale_price), stock_qty: stock,
      min_stock_alert: Number(min_stock_alert) || 5, status: stock > 0 ? 'Active' : 'Out_Of_Stock'
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const payload = { ...req.body };
    if (payload.stock_qty !== undefined) payload.status = Number(payload.stock_qty) > 0 ? 'Active' : 'Out_Of_Stock';
    if (payload.item_code && !payload.sku) payload.sku = payload.item_code;
    const item = await StoreItem.findOneAndUpdate({ _id: req.params.id, school_id: schoolId }, { $set: payload }, { new: true });
    if (!item) return res.status(404).json({ message: 'Store item not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    await StoreItem.findOneAndDelete({ _id: req.params.id, school_id: req.user?.school_id });
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSales = async (req, res) => {
  try {
    const schoolId = req.user?.school_id;
    const { buyer_type, search, from_date, to_date, page = 1, limit = 50 } = req.query;
    const query = { school_id: schoolId };
    if (buyer_type && buyer_type !== 'All') query.buyer_type = buyer_type;
    if (search) query.$or = [{ receipt_no: { $regex: search, $options: 'i' } }, { buyer_name: { $regex: search, $options: 'i' } }];
    if (from_date || to_date) {
      query.createdAt = {};
      if (from_date) query.createdAt.$gte = new Date(from_date);
      if (to_date) query.createdAt.$lte = new Date(new Date(to_date).setHours(23, 59, 59, 999));
    }
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const [sales, total] = await Promise.all([
      PosSale.find(query).populate('student_id', 'name roll_number admission_number').populate('staff_id', 'name employee_code').populate('sold_by', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      PosSale.countDocuments(query)
    ]);
    res.status(200).json({ success: true, data: sales, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem, getSales, checkout };

const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    item_code: { type: String, trim: true },
    sku: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Textbooks', 'Notebooks & Copies', 'Uniform', 'Stationery', 'ID Card & Lanyard', 'Copies & Registers', 'Sports & Tie/Belt', 'Other'],
      default: 'Textbooks',
      index: true
    },
    grade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', default: null },
    cost_price: { type: Number, default: 0 },
    sale_price: { type: Number, required: true, min: 0 },
    stock_qty: { type: Number, required: true, default: 25 },
    min_stock_alert: { type: Number, default: 5 },
    status: { type: String, enum: ['Active', 'Out_Of_Stock'], default: 'Active' }
  },
  { timestamps: true }
);

storeItemSchema.pre('save', function (next) {
  if (this.item_code && !this.sku) this.sku = this.item_code;
  if (this.sku && !this.item_code) this.item_code = this.sku;
  next();
});

module.exports = mongoose.model('StoreItem', storeItemSchema);

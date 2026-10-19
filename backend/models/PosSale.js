const mongoose = require('mongoose');

const posSaleSchema = new mongoose.Schema(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    campus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', default: null },
    receipt_no: { type: String, required: true, index: true },
    buyer_type: { type: String, enum: ['Student', 'Staff', 'Walk_In'], default: 'Student' },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    buyer_name: { type: String, required: true, trim: true },
    items: [
      {
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreItem' },
        name: { type: String, required: true },
        category: { type: String, default: 'Other' },
        qty: { type: Number, required: true, min: 1 },
        unit_price: { type: Number, required: true },
        line_total: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    net_total: { type: Number, required: true },
    payment_mode: {
      type: String,
      enum: ['Cash', 'Bank_Transfer', 'Add_To_Fee_Challan', 'Bank Transfer', 'Online'],
      default: 'Cash'
    },
    sold_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PosSale', posSaleSchema);

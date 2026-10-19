import { useState, useEffect, useCallback } from 'react';
import StoreHeader from '../../components/admin/store/StoreHeader';
import PosItemGrid from '../../components/admin/store/PosItemGrid';
import PosCartPanel from '../../components/admin/store/PosCartPanel';
import StoreInventoryTable from '../../components/admin/store/StoreInventoryTable';
import StoreSalesTable from '../../components/admin/store/StoreSalesTable';
import StoreItemModal from '../../components/admin/store/StoreItemModal';
import PrintableReceiptModal from '../../components/admin/store/PrintableReceiptModal';
import api from '../../services/api';

const PosStorePage = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [sales, setSales] = useState([]);
  const [grades, setGrades] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [printSale, setPrintSale] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, salesRes, gradesRes] = await Promise.all([
        api.get('/store/items'), api.get('/store/sales'), api.get('/grades').catch(() => ({ data: [] }))
      ]);
      setItems(itemsRes.data?.data || []);
      setStats(itemsRes.data?.stats || {});
      setSales(salesRes.data?.data || []);
      setGrades(gradesRes.data?.grades || gradesRes.data || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) return prev.map((i) => (i._id === item._id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleBarcodeScan = (code) => {
    if (!code) return { success: false, message: 'Invalid barcode' };
    const clean = String(code).trim().toLowerCase();
    const item = items.find((i) => (i.item_code || i.sku)?.trim().toLowerCase() === clean);
    if (!item) return { success: false, message: `Product "${code}" not found` };
    if (item.stock_qty <= 0) return { success: false, message: `"${item.name}" is out of stock` };
    handleAddToCart(item);
    return { success: true, item, message: `Added "${item.name}" to cart` };
  };

  const handleUpdateQty = (itemId, qty) => {
    if (qty <= 0) setCart((prev) => prev.filter((i) => i._id !== itemId));
    else setCart((prev) => prev.map((i) => (i._id === itemId ? { ...i, qty } : i)));
  };

  const handleCheckout = async (checkoutData) => {
    setSubmitting(true);
    try {
      const payload = {
        buyer_type: checkoutData.buyerType, buyer_name: checkoutData.buyerName,
        student_id: checkoutData.studentId || null, staff_id: checkoutData.staffId || null,
        items: cart.map((i) => ({
          item_id: i._id, name: i.name, category: i.category || 'Other',
          sku: i.item_code || i.sku, qty: i.qty,
          unit_price: Number(i.sale_price), line_total: Number(i.sale_price) * Number(i.qty)
        })),
        subtotal: checkoutData.subtotal, discount: checkoutData.discount,
        net_total: checkoutData.netTotal, payment_mode: checkoutData.paymentMode
      };
      const res = await api.post('/store/checkout', payload);
      setCart([]);
      loadData();
      if (res.data?.data) setPrintSale(res.data.data);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="w-full space-y-6">
      <StoreHeader activeTab={activeTab} onTabChange={setActiveTab} stats={stats} />
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <PosItemGrid items={items} onAddToCart={handleAddToCart} onBarcodeScan={handleBarcodeScan} loading={loading} grades={grades} />
          </div>
          <div className="lg:col-span-5">
            <PosCartPanel cart={cart} onUpdateQty={handleUpdateQty} onRemove={(id) => setCart((p) => p.filter((i) => i._id !== id))} onClear={() => setCart([])} onCheckout={handleCheckout} submitting={submitting} />
          </div>
        </div>
      )}
      {activeTab === 'inventory' && (
        <StoreInventoryTable items={items} onEdit={(item) => { setEditingItem(item); setShowItemModal(true); }} onDelete={async (id) => { try { await api.delete(`/store/items/${id}`); loadData(); } catch {} }} onAddNew={() => { setEditingItem(null); setShowItemModal(true); }} loading={loading} />
      )}
      {activeTab === 'sales' && (
        <StoreSalesTable sales={sales} onPrint={setPrintSale} loading={loading} />
      )}
      <StoreItemModal isOpen={showItemModal} onClose={() => setShowItemModal(false)} editingItem={editingItem} onSaved={loadData} />
      <PrintableReceiptModal sale={printSale} isOpen={Boolean(printSale)} onClose={() => setPrintSale(null)} />
    </div>
  );
};

export default PosStorePage;

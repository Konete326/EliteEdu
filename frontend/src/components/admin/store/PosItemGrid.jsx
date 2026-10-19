import { useState } from 'react';
import { Plus } from 'lucide-react';
import PosSearchBar from './PosSearchBar';
import CameraScannerModal from '../../common/scanner/CameraScannerModal';

const PosItemGrid = ({ items = [], onAddToCart, onBarcodeScan, loading, grades = [] }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const filtered = items.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory ||
      (activeCategory === 'Notebooks' && (item.category === 'Notebooks & Copies' || item.category === 'Copies & Registers'));
    const matchGrade = !selectedGrade || String(item.grade_id?._id || item.grade_id) === String(selectedGrade);
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(search.toLowerCase())) ||
      (item.item_code && item.item_code.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchGrade && matchSearch;
  });

  const handleBarcodeSubmit = (codeText) => {
    if (!codeText.trim() || !onBarcodeScan) return;
    const res = onBarcodeScan(codeText.trim());
    if (res?.success) setSearch('');
  };

  return (
    <div className="space-y-4">
      <PosSearchBar
        search={search} onSearchChange={setSearch} onSearchSubmit={handleBarcodeSubmit}
        activeCategory={activeCategory} onCategoryChange={setActiveCategory}
        onOpenScanner={() => setShowScanner(true)} grades={grades} selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-ink-muted">Loading POS inventory catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-ink-muted">No items found matching the selected filter.</div>
        ) : (
          filtered.map((item) => {
            const isOutOfStock = item.stock_qty <= 0;
            const isLow = item.stock_qty > 0 && item.stock_qty <= (item.min_stock_alert || 5);
            return (
              <div
                key={item._id}
                onClick={() => !isOutOfStock && onAddToCart(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isOutOfStock
                    ? 'opacity-50 cursor-not-allowed bg-surface-secondary/20 border-line'
                    : 'bg-surface dark:bg-surface-dark border-line hover:border-primary hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-ink-muted">{item.item_code || item.sku}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isOutOfStock ? 'bg-rose-500/10 text-rose-600' : isLow ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {isOutOfStock ? 'Out of Stock' : `${item.stock_qty} in stock`}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-ink dark:text-ink-dark line-clamp-2">{item.name}</h4>
                  <div className="text-[10px] text-ink-muted">{item.category}</div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-line">
                  <span className="font-mono font-black text-sm text-emerald-600">PKR {Number(item.sale_price).toLocaleString()}</span>
                  <button
                    disabled={isOutOfStock}
                    className="p-1 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CameraScannerModal
        isOpen={showScanner} onClose={() => setShowScanner(false)} onScan={onBarcodeScan}
        title="POS Barcode Scanner" subtitle="Scan SKU barcode label via webcam"
      />
    </div>
  );
};

export default PosItemGrid;

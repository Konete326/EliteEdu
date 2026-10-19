import { Plus, Trash2 } from 'lucide-react';

const FeeStructureCustomHeads = ({ heads = [], onChange }) => {
  const handleAdd = () => {
    onChange([...heads, { title: '', amount: 0 }]);
  };

  const handleRemove = (idx) => {
    onChange(heads.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, val) => {
    const list = [...heads];
    list[idx] = { ...list[idx], [field]: field === 'amount' ? Number(val) : val };
    onChange(list);
  };

  return (
    <div className="space-y-1.5 pt-1 border-t border-line">
      <div className="flex items-center justify-between">
        <span className="font-bold text-[11px] text-ink-muted uppercase">Custom Fee Heads</span>
        <button type="button" onClick={handleAdd} className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline">
          <Plus className="w-3 h-3" />
          <span>Add Head</span>
        </button>
      </div>
      {heads.map((head, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Title (e.g. Sports, Library)"
            value={head.title}
            onChange={(e) => handleItemChange(i, 'title', e.target.value)}
            className="flex-1 px-2.5 py-1 rounded-xl border border-line bg-surface text-ink outline-none"
          />
          <input
            type="number"
            placeholder="PKR"
            min="0"
            value={head.amount}
            onChange={(e) => handleItemChange(i, 'amount', e.target.value)}
            className="w-24 px-2.5 py-1 rounded-xl border border-line bg-surface text-ink outline-none font-mono"
          />
          <button type="button" onClick={() => handleRemove(i)} className="p-1 text-ink-muted hover:text-bad">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FeeStructureCustomHeads;

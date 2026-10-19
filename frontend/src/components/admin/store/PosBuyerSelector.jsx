import { useState, useEffect } from 'react';
import { Search, UserCheck } from 'lucide-react';
import api from '../../../services/api';

const PosBuyerSelector = ({ buyerType, setBuyerType, buyerName, setBuyerName, setStudentId, setStaffId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (buyerType !== 'Student' || !query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/students?search=${encodeURIComponent(query.trim())}&limit=6`);
        setResults(res.data?.students || res.data || []);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query, buyerType]);

  const handleSelectStudent = (s) => {
    const label = `${s.name} (GR: ${s.admission_number || s.roll_number || 'N/A'})`;
    setBuyerName(label);
    setStudentId(s._id);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-surface-secondary/50 border border-line text-[10px] font-bold">
        {['Student', 'Staff', 'Walk_In'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => { setBuyerType(type); setStudentId(null); setStaffId(null); setBuyerName(''); setQuery(''); }}
            className={`py-1 rounded-lg transition-all ${buyerType === type ? 'bg-primary text-white shadow-sm' : 'text-ink-muted'}`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="relative">
        <label className="block text-[10px] font-bold text-ink-muted mb-1">
          {buyerType === 'Student' ? 'Search Student (Name or GR / Roll #)' : buyerType === 'Staff' ? 'Staff Member Name' : 'Walk-In Customer Name'}
        </label>
        {buyerType === 'Student' ? (
          <div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={buyerName || query}
                onChange={(e) => { setBuyerName(e.target.value); setQuery(e.target.value); }}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                placeholder="Search by student name or GR number..."
                required
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
              />
            </div>
            {showDropdown && results.length > 0 && (
              <div className="absolute left-0 right-0 z-20 mt-1 bg-surface dark:bg-surface-dark border border-line rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {results.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => handleSelectStudent(s)}
                    className="p-2 text-xs hover:bg-primary/10 cursor-pointer flex items-center justify-between border-b border-line last:border-0"
                  >
                    <div>
                      <p className="font-bold text-ink dark:text-ink-dark">{s.name}</p>
                      <p className="text-[10px] text-ink-muted font-mono">GR: {s.admission_number || s.roll_number || 'N/A'} • {s.current_grade?.name || 'Class'}</p>
                    </div>
                    <UserCheck className="w-3.5 h-3.5 text-primary" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder={buyerType === 'Staff' ? 'e.g. Sir Asad Khan' : 'e.g. Walk-in Guardian'}
            required
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        )}
      </div>
    </div>
  );
};

export default PosBuyerSelector;

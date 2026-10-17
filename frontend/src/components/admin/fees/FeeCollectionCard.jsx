import { useState, useEffect } from 'react';
import { Search, UserCheck, DollarSign, CreditCard, Check, AlertCircle } from 'lucide-react';
import api from '../../../services/api';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const FeeCollectionCard = ({ onPaymentSuccess, preselectedStudent }) => {
  const currentYear = new Date().getFullYear();
  const currentMonthName = MONTHS[new Date().getMonth()];
  const defaultFeeMonth = `${currentMonthName} ${currentYear}`;

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [feeMonth, setFeeMonth] = useState(defaultFeeMonth);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [fine, setFine] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (preselectedStudent) {
      handleSelectStudent(preselectedStudent);
    }
  }, [preselectedStudent]);

  useEffect(() => {
    if (!search.trim() || search.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/fees/students?search=${encodeURIComponent(search.trim())}`);
        if (res.data?.students) {
          setSearchResults(res.data.students);
        }
      } catch {} finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSelectStudent = (st) => {
    setSelectedStudent(st);
    setSearch('');
    setSearchResults([]);
    setError('');
    setSuccessMsg('');
    const base = Number(st.monthly_fee || 0);
    const disc = Number(st.discount || 0);
    const net = Math.max(0, base - disc);
    setPaidAmount(String(net));
  };

  const baseFee = Number(selectedStudent?.monthly_fee || 0);
  const discount = Number(selectedStudent?.discount || 0);
  const netPayable = Math.max(0, baseFee - discount + Number(fine) + Number(otherCharges));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please search and select a student first');
      return;
    }
    if (!paidAmount || Number(paidAmount) < 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/fees/collect', {
        student_id: selectedStudent._id,
        campus_id: selectedStudent.campus_id?._id || selectedStudent.campus_id || null,
        fee_month: feeMonth,
        base_fee: baseFee,
        discount,
        fine: Number(fine),
        other_charges: Number(otherCharges),
        paid_amount: Number(paidAmount),
        payment_method: paymentMethod,
        reference_number: referenceNumber,
        notes
      });

      if (res.data?.success) {
        setSuccessMsg(`Fee successfully collected. Receipt #${res.data.payment.receipt_number}`);
        onPaymentSuccess(res.data.payment);
        setReferenceNumber('');
        setNotes('');
        setFine(0);
        setOtherCharges(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to collect fee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-3xl border border-line dark:border-line-dark shadow-sm overflow-hidden">
      <div className="p-5 border-b border-line dark:border-line-dark flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Fee Collection Counter</h3>
            <p className="text-[11px] text-ink-muted">Quick institutional challan & fee settlement</p>
          </div>
        </div>
        {selectedStudent && (
          <button
            type="button"
            onClick={() => { setSelectedStudent(null); setPaidAmount(''); }}
            className="text-xs text-ink-muted hover:text-bad transition-colors font-medium"
          >
            Clear Selection
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search student by Name, GR Number, or Father's Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs outline-none focus:border-primary transition-colors"
          />
          {searching && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-line dark:divide-line-dark">
              {searchResults.map((st) => (
                <button
                  type="button"
                  key={st._id}
                  onClick={() => handleSelectStudent(st)}
                  className="w-full p-3 text-left hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="font-bold text-xs text-ink dark:text-ink-dark">{st.name}</p>
                    <p className="text-[10px] text-ink-muted">GR: {st.gr_number} • S/O: {st.father_name || '—'} • Class: {st.current_grade?.name || '—'} ({st.current_section || 'A'})</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-primary">Rs. {(st.monthly_fee || 0).toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.payment_status === 'Paid' ? 'bg-good/10 text-good' : 'bg-bad/10 text-bad'}`}>
                      {st.payment_status || 'Unpaid'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedStudent && (
          <div className="p-4 rounded-2xl bg-surface-secondary/30 dark:bg-surface-secondary-dark/30 border border-line dark:border-line-dark flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ink dark:text-ink-dark">{selectedStudent.name}</h4>
                <p className="text-[11px] text-ink-muted font-mono">
                  GR: {selectedStudent.gr_number} • {selectedStudent.current_grade?.name || 'Class'} ({selectedStudent.current_section || 'A'})
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-ink-muted">Net Monthly Due</p>
              <p className="text-base font-black text-primary font-mono">Rs. {netPayable.toLocaleString()}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-bad/10 border border-bad/20 text-bad text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-good/10 border border-good/20 text-good text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Fee Month</label>
              <select
                value={feeMonth}
                onChange={(e) => setFeeMonth(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs outline-none focus:border-primary"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={`${m} ${currentYear}`}>{m} {currentYear}</option>
                ))}
                {MONTHS.map((m) => (
                  <option key={`next-${m}`} value={`${m} ${currentYear + 1}`}>{m} {currentYear + 1}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs outline-none focus:border-primary"
              >
                <option value="Cash">Cash Counter</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Online / Card">Online / Card</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Paid Amount (PKR) *</label>
              <input
                type="number"
                min="0"
                required
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Amount to collect"
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs font-mono font-bold outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Late Fine / Arrears</label>
              <input
                type="number"
                min="0"
                value={fine}
                onChange={(e) => setFine(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs font-mono outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Other / Exam Charges</label>
              <input
                type="number"
                min="0"
                value={otherCharges}
                onChange={(e) => setOtherCharges(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs font-mono outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Ref / Cheque #</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Optional reference"
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1">Collector Notes / Remarks</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid in full at front counter"
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedStudent}
            className="w-full py-2.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Collect Fee & Issue Receipt</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeeCollectionCard;

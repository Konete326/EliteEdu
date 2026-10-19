import { useState } from 'react';
import { Plus, Bus, Trash2, MapPin } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const INITIAL = {
  route_name: '', route_code: 'VAN-01', vehicle_no: '', vehicle_type: 'School Van',
  seating_capacity: 18, driver_name: '', driver_phone: '', driver_cnic: '',
  conductor_name: '', conductor_phone: '', monthly_fee: 3000,
  morning_pickup_time: '07:15 AM', afternoon_drop_time: '02:15 PM',
  stops: [{ stop_name: '', pickup_time: '07:15 AM', fee_amount: 0 }]
};

const TransportRouteForm = ({ onSaved, user }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`tr_draft_${user?.school_id || 'v2'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const handleAddStop = () => {
    setDraft({ ...draft, stops: [...draft.stops, { stop_name: '', pickup_time: '07:15 AM', fee_amount: 0 }] });
  };

  const handleStopChange = (idx, field, val) => {
    const next = [...draft.stops];
    next[idx] = { ...next[idx], [field]: val };
    setDraft({ ...draft, stops: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.route_name || !draft.vehicle_no || !draft.driver_name || !draft.driver_phone) {
      return showToast('Route Name, Vehicle #, and Driver details are required', 'warning');
    }
    setSubmitting(true);
    try {
      const validStops = draft.stops.filter((s) => s.stop_name.trim().length > 0);
      await api.post('/transport/routes', { ...draft, capacity: draft.seating_capacity, stops: validStops });
      showToast('Transport route and vehicle registered successfully', 'success');
      clearDraft();
      onSaved?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save route', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3 h-fit">
      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Bus className="w-4 h-4 text-blue-600" /> Register Route & Van
      </h4>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <input type="text" placeholder="Route Name * (e.g. Route 1)" value={draft.route_name} onChange={(e) => setDraft({ ...draft, route_name: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
        </div>
        <input type="text" placeholder="Code (VAN-01)" value={draft.route_code} onChange={(e) => setDraft({ ...draft, route_code: e.target.value })} className="w-full px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Vehicle No * (KHI-2026)" value={draft.vehicle_no} onChange={(e) => setDraft({ ...draft, vehicle_no: e.target.value })} className="px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
        <select value={draft.vehicle_type} onChange={(e) => setDraft({ ...draft, vehicle_type: e.target.value })} className="px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <option value="School Van">School Van</option>
          <option value="Coaster / Mini Bus">Coaster / Mini Bus</option>
          <option value="School Bus">School Bus</option>
          <option value="Hiace">Hiace</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Driver Name *" value={draft.driver_name} onChange={(e) => setDraft({ ...draft, driver_name: e.target.value })} className="px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
        <input type="text" placeholder="Driver Phone *" value={draft.driver_phone} onChange={(e) => setDraft({ ...draft, driver_phone: e.target.value })} className="px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Driver CNIC" value={draft.driver_cnic} onChange={(e) => setDraft({ ...draft, driver_cnic: e.target.value })} className="px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        <input type="text" placeholder="Conductor Phone" value={draft.conductor_phone} onChange={(e) => setDraft({ ...draft, conductor_phone: e.target.value })} className="px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="number" placeholder="Seats (18)" value={draft.seating_capacity} onChange={(e) => setDraft({ ...draft, seating_capacity: Number(e.target.value) })} className="px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" min={1} />
        <input type="number" placeholder="Monthly Fee (3000)" value={draft.monthly_fee} onChange={(e) => setDraft({ ...draft, monthly_fee: Number(e.target.value) })} className="px-3 py-1.5 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" min={0} />
      </div>
      <div className="space-y-1.5 pt-1 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" /> Route Stops</span>
          <button type="button" onClick={handleAddStop} className="text-blue-600 hover:underline">+ Add Stop</button>
        </div>
        {draft.stops.map((stop, si) => (
          <div key={si} className="flex items-center gap-1.5">
            <input type="text" placeholder="Stop" value={stop.stop_name} onChange={(e) => handleStopChange(si, 'stop_name', e.target.value)} className="flex-1 px-2 py-1 text-xs border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            <input type="text" placeholder="Time" value={stop.pickup_time} onChange={(e) => handleStopChange(si, 'pickup_time', e.target.value)} className="w-20 px-2 py-1 text-xs border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            {draft.stops.length > 1 && (
              <button type="button" onClick={() => setDraft({ ...draft, stops: draft.stops.filter((_, i) => i !== si) })} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
            )}
          </div>
        ))}
      </div>
      <button type="submit" disabled={submitting} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm">
        <Plus className="w-3.5 h-3.5" /> Save Route & Vehicle
      </button>
    </form>
  );
};

export default TransportRouteForm;

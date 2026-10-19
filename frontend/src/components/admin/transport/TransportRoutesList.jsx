import { Bus, Users, Phone, Printer, Trash2, MapPin } from 'lucide-react';

const TransportRoutesList = ({ routes = [], onManageStudents, onPrintManifest, onDeleteRoute }) => {
  if (routes.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
        No transport routes or vehicles registered yet. Use the form on the left to add your first route.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {routes.map((rt) => {
        const studentCount = rt.assigned_students?.length || 0;
        const capacity = rt.seating_capacity || rt.capacity || 18;
        const fillPct = Math.min(100, Math.round((studentCount / capacity) * 100));

        return (
          <div key={rt._id} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-blue-50 text-blue-700 dark:bg-blue-900/30 flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5" /> {rt.route_code || 'VAN'} • {rt.vehicle_no}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {rt.vehicle_type}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">PKR {rt.monthly_fee}/month</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm mt-1">{rt.route_name}</h4>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => onManageStudents(rt)}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" /> Students ({studentCount})
                </button>
                <button
                  type="button"
                  onClick={() => onPrintManifest(rt)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Manifest
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteRoute(rt._id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-2.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Driver:</span> {rt.driver_name}
                <span className="flex items-center gap-1 text-gray-400 font-mono"><Phone className="w-3 h-3" /> {rt.driver_phone}</span>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-bold">
                  <span>Occupancy</span><span>{studentCount} / {capacity} seats ({fillPct}%)</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${fillPct > 90 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${fillPct}%` }} />
                </div>
              </div>
            </div>

            {rt.stops?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                <span className="font-bold text-gray-400 flex items-center gap-0.5"><MapPin className="w-3 h-3 text-red-500" /> Stops:</span>
                {rt.stops.map((s, idx) => (
                  <span key={idx} className="bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium">
                    {s.stop_name} ({s.pickup_time})
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TransportRoutesList;

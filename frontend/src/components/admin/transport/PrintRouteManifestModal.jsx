import { Printer, X } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintRouteManifestModal = ({ route, isOpen, onClose }) => {
  if (!isOpen || !route) return null;
  const passengers = route.assigned_students || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:max-h-none print:rounded-none">
        <div className="p-4 border-b flex items-center justify-between print:hidden">
          <h3 className="font-bold text-gray-800">Print Preview: Vehicle Passenger Manifest</h3>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:bg-blue-700">
              <Printer className="w-4 h-4" /> Print Manifest
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto print:p-4 space-y-6 text-gray-900">
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-black uppercase tracking-wider text-blue-900">Official Transport & Fleet Manifest</h2>
            <p className="text-sm font-semibold text-gray-700 mt-1">{route.route_name}</p>
            <p className="text-xs text-gray-500">Vehicle: {route.vehicle_no} ({route.vehicle_type}) • Driver: {route.driver_name} ({route.driver_phone})</p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 border rounded-lg text-xs">
            <div><span className="font-bold">Total Capacity:</span> {route.capacity} seats</div>
            <div><span className="font-bold">Assigned Passengers:</span> {passengers.length} students</div>
            <div><span className="font-bold">Monthly Fee:</span> PKR {route.monthly_fee}</div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-600 mb-2">Registered Passengers Roster</h4>
            <table className="w-full text-xs border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-left">
                  <th className="p-2 border border-gray-300 w-10 text-center">#</th>
                  <th className="p-2 border border-gray-300">GR #</th>
                  <th className="p-2 border border-gray-300">Student Name</th>
                  <th className="p-2 border border-gray-300">Father Name</th>
                  <th className="p-2 border border-gray-300">Class & Section</th>
                </tr>
              </thead>
              <tbody>
                {passengers.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-400">No passengers assigned yet.</td></tr>
                ) : (
                  passengers.map((st, idx) => (
                    <tr key={st._id || idx} className="border-b border-gray-300">
                      <td className="p-2 border border-gray-300 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border border-gray-300 font-mono font-bold">{st.gr_number || '-'}</td>
                      <td className="p-2 border border-gray-300 font-medium">{st.name}</td>
                      <td className="p-2 border border-gray-300">{st.father_name}</td>
                      <td className="p-2 border border-gray-300">{st.current_grade?.name || 'Class'} ({st.current_section || 'A'})</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-4">
            <OfficialSignatureStampBlock
              signatureTitle="Transport Incharge"
              stampTitle="Fleet Supervisor Stamp"
              compact={true}
            />
          </div>

          <div className="pt-4 flex items-center justify-between text-[11px] text-gray-400 border-t">
            <span>Generated on {new Date().toLocaleDateString()}</span>
            <span className="font-semibold text-blue-600">Powered by EliteEdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintRouteManifestModal;

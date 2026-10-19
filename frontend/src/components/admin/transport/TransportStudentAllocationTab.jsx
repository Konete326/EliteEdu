import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import TransportStudentAllocationRow from './TransportStudentAllocationRow';

const TransportStudentAllocationTab = ({ routes = [], onUpdated }) => {
  const { showToast } = useToast();
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [students, setStudents] = useState([]);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    if (routes.length && !selectedRouteId) setSelectedRouteId(routes[0]._id);
    api.get('/grades').then((res) => {
      const gList = res.data?.grades || res.data?.data || res.data || [];
      setGrades(gList);
      if (gList.length) setSelectedGradeId(gList[0]._id);
    }).catch(() => {});
  }, [routes]);

  const loadStudents = async () => {
    if (!selectedGradeId) return;
    try {
      const res = await api.get(`/students?grade_id=${selectedGradeId}&status=Active`);
      setStudents(res.data?.students || res.data || []);
    } catch {
      showToast('Failed to load class roster', 'error');
    }
  };

  useEffect(() => { loadStudents(); }, [selectedGradeId]);

  const activeRoute = routes.find((r) => r._id === selectedRouteId) || routes[0];

  const handleToggleAssign = async (student, isAssigned) => {
    if (!activeRoute) return;
    setActionLoading(student._id);
    try {
      await api.post('/transport/assign-student', {
        route_id: activeRoute._id,
        student_id: student._id,
        action: isAssigned ? 'unassign' : 'assign'
      });
      showToast(isAssigned ? 'Student removed from transport' : 'Student enrolled in transport route', 'success');
      loadStudents();
      onUpdated?.();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update transport allocation', 'error');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Route:</span>
            <select value={selectedRouteId} onChange={(e) => setSelectedRouteId(e.target.value)} className="px-3 py-1.5 border rounded-xl text-xs font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              {routes.map((r) => <option key={r._id} value={r._id}>{r.route_name} ({r.vehicle_no})</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Class:</span>
            <select value={selectedGradeId} onChange={(e) => setSelectedGradeId(e.target.value)} className="px-3 py-1.5 border rounded-xl text-xs font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>
        </div>
        {activeRoute && (
          <div className="text-xs text-gray-500 flex items-center gap-2 font-mono">
            <span className="font-bold text-blue-600 dark:text-blue-400">PKR {activeRoute.monthly_fee}/mo</span> •
            <span>{activeRoute.assigned_students?.length || 0} / {activeRoute.seating_capacity || activeRoute.capacity || 18} Seats</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 font-black">
                <th className="p-3 w-12 text-center">Roll</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Father Name</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {students.map((st) => (
                <TransportStudentAllocationRow
                  key={st._id}
                  student={st}
                  isAssigned={(activeRoute?.assigned_students || []).some((s) => String(s._id || s) === String(st._id)) || st.transport_route === activeRoute?.route_name}
                  onOther={!((activeRoute?.assigned_students || []).some((s) => String(s._id || s) === String(st._id)) || st.transport_route === activeRoute?.route_name) && Boolean(st.transport_route)}
                  activeRoute={activeRoute}
                  onToggle={handleToggleAssign}
                  loading={actionLoading === st._id}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransportStudentAllocationTab;

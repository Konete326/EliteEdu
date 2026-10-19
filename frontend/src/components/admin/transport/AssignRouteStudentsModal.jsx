import { useState, useEffect } from 'react';
import { X, Search, Plus, Trash2, Users, Loader2 } from 'lucide-react';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';

const AssignRouteStudentsModal = ({ route, isOpen, onClose, onUpdated }) => {
  const { showToast } = useToast();
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api.get('/students?status=Active')
      .then((res) => setAllStudents(res.data?.students || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen || !route) return null;

  const assigned = route.assigned_students || [];
  const assignedIds = new Set(assigned.map((s) => String(s._id || s)));

  const handleAssign = async (studentId) => {
    try {
      await api.post(`/transport/routes/${route._id}/assign-student`, { student_id: studentId });
      showToast('Student assigned to route', 'success');
      onUpdated();
    } catch {
      showToast('Failed to assign student', 'error');
    }
  };

  const handleUnassign = async (studentId) => {
    try {
      await api.delete(`/transport/routes/${route._id}/unassign-student/${studentId}`);
      showToast('Student unassigned from route', 'success');
      onUpdated();
    } catch {
      showToast('Failed to unassign', 'error');
    }
  };

  const filtered = allStudents.filter((st) => {
    const q = search.toLowerCase();
    const nameMatch = (st.name || '').toLowerCase().includes(q) || (st.father_name || '').toLowerCase().includes(q);
    const grMatch = (st.gr_number || '').toLowerCase().includes(q);
    return nameMatch || grMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{route.route_name} - Passengers</h3>
            <p className="text-xs text-gray-500">Vehicle: {route.vehicle_no} • Assigned: {assigned.length} / {route.capacity} seats</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student by name or GR # to assign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 divide-y divide-gray-100 dark:divide-gray-700">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
          ) : (
            filtered.slice(0, 15).map((st) => {
              const isAssigned = assignedIds.has(String(st._id));
              return (
                <div key={st._id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-semibold text-xs text-gray-900 dark:text-gray-100">{st.name} s/o {st.father_name}</h5>
                    <p className="text-[11px] text-gray-400 font-mono">GR: {st.gr_number} • Class: {st.current_grade?.name || 'Class'} ({st.current_section || 'A'})</p>
                  </div>
                  {isAssigned ? (
                    <button onClick={() => handleUnassign(st._id)} className="px-2.5 py-1 bg-red-50 text-red-600 dark:bg-red-900/30 rounded text-xs font-semibold flex items-center gap-1 hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  ) : (
                    <button onClick={() => handleAssign(st._id)} className="px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 rounded text-xs font-semibold flex items-center gap-1 hover:bg-blue-100">
                      <Plus className="w-3.5 h-3.5" /> Assign
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignRouteStudentsModal;

import { useState, useEffect } from 'react';
import { Bus, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import TransportKpiCards from '../../components/admin/transport/TransportKpiCards';
import TransportRouteForm from '../../components/admin/transport/TransportRouteForm';
import TransportRoutesList from '../../components/admin/transport/TransportRoutesList';
import TransportStudentAllocationTab from '../../components/admin/transport/TransportStudentAllocationTab';
import AssignRouteStudentsModal from '../../components/admin/transport/AssignRouteStudentsModal';
import PrintRouteManifestModal from '../../components/admin/transport/PrintRouteManifestModal';

const TransportManagementPage = () => {
  const { user } = useAuth();
  const { selectedCampus } = useCampus();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('routes');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [kpis, setKpis] = useState({});
  const [managingRoute, setManagingRoute] = useState(null);
  const [manifestRoute, setManifestRoute] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const q = selectedCampus ? `?campus_id=${selectedCampus}` : '';
      const res = await api.get(`/transport/routes${q}`);
      setRoutes(res.data?.routes || []);
      setKpis(res.data?.kpis || {});
      if (managingRoute) {
        const updated = (res.data?.routes || []).find((r) => r._id === managingRoute._id);
        if (updated) setManagingRoute(updated);
      }
    } catch {
      showToast('Failed to load transport fleet', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedCampus]);

  const handleDeleteRoute = async (id) => {
    try {
      await api.delete(`/transport/routes/${id}`);
      showToast('Route deleted successfully', 'success');
      loadData();
    } catch {
      showToast('Failed to delete route', 'error');
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">
              School Transport &amp; Fleet Management
            </h1>
            <p className="text-xs font-semibold text-ink-muted">Fleet planning, vehicle registry, student van allocation, and transport fee sync</p>
          </div>
        </div>
        <div className="bg-surface-secondary/70 p-1 rounded-xl flex border border-line">
          <button
            type="button"
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'routes' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Bus className="w-3.5 h-3.5" /> Routes, Vehicles & Drivers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('allocation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'allocation' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Student Allocation & Roster
          </button>
        </div>
      </div>

      <TransportKpiCards kpis={kpis} />

      {activeTab === 'routes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4">
            <TransportRouteForm onSaved={loadData} user={user} />
          </div>
          <div className="lg:col-span-8">
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : (
              <TransportRoutesList routes={routes} onManageStudents={setManagingRoute} onPrintManifest={setManifestRoute} onDeleteRoute={handleDeleteRoute} />
            )}
          </div>
        </div>
      ) : (
        <TransportStudentAllocationTab routes={routes} onUpdated={loadData} />
      )}

      <AssignRouteStudentsModal route={managingRoute} isOpen={Boolean(managingRoute)} onClose={() => setManagingRoute(null)} onUpdated={loadData} />
      <PrintRouteManifestModal route={manifestRoute} isOpen={Boolean(manifestRoute)} onClose={() => setManifestRoute(null)} />
    </div>
  );
};

export default TransportManagementPage;

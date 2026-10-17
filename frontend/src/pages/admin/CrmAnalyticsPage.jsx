import React, { useState, useEffect } from 'react';
import { BarChart3, Printer } from 'lucide-react';
import api from '../../services/api';
import CrmAnalyticsKpis from '../../components/admin/crm/analytics/CrmAnalyticsKpis';
import CrmPipelineFunnelChart from '../../components/admin/crm/analytics/CrmPipelineFunnelChart';
import CrmSourcePerformanceChart from '../../components/admin/crm/analytics/CrmSourcePerformanceChart';
import CrmGradeDemandTable from '../../components/admin/crm/analytics/CrmGradeDemandTable';

export default function CrmAnalyticsPage() {
  const [data, setData] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const campusParam = selectedCampus !== 'all' ? `?campus_id=${selectedCampus}` : '';
      const res = await api.get(`/crm/analytics${campusParam}`);
      if (res.data?.success) setData(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/campuses').then((r) => setCampuses(r.data.campuses || r.data || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchAnalytics(); }, [selectedCampus]);

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-line dark:border-line-dark">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Lead & Conversion Analytics
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time enrollment funnels, acquisition sources, and class-wise inquiry intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary outline-hidden"
          >
            <option value="all">All Campuses</option>
            {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark hover:bg-hover text-text-secondary text-xs font-semibold cursor-pointer"
          >
            <Printer size={13} /> Print Report
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="py-20 text-center text-xs text-text-muted">Loading CRM analytics...</div>
      ) : (
        <div className="space-y-5">
          <CrmAnalyticsKpis kpis={data?.kpis} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CrmPipelineFunnelChart funnel={data?.pipelineFunnel} totalLeads={data?.kpis?.totalLeads} />
            <CrmSourcePerformanceChart sources={data?.sourcePerformance} />
          </div>
          <CrmGradeDemandTable gradeDemand={data?.gradeDemand} />
        </div>
      )}
    </div>
  );
}

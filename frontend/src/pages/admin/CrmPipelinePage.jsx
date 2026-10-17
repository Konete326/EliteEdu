import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Kanban, UserPlus, Filter } from 'lucide-react';
import api from '../../services/api';
import CrmPipelineBoard from '../../components/admin/crm/pipeline/CrmPipelineBoard';
import CrmConvertModal from '../../components/admin/crm/leads/CrmConvertModal';

export default function CrmPipelinePage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [campuses, setCampuses] = useState([]);
  const [convertLead, setConvertLead] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const campusParam = selectedCampus !== 'all' ? `&campus_id=${selectedCampus}` : '';
      const res = await api.get(`/crm/leads?limit=300${campusParam}`);
      if (res.data?.success) setLeads(res.data.leads || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/campuses').then((r) => setCampuses(r.data.campuses || r.data || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchLeads(); }, [selectedCampus]);

  const handleMoveStage = async (leadId, newStage) => {
    try {
      await api.patch(`/crm/leads/${leadId}/stage`, { lead_status: newStage });
      setLeads((prev) => prev.map((l) => (l._id === leadId ? { ...l, lead_status: newStage } : l)));
    } catch {}
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-line dark:border-line-dark">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2">
            <Kanban className="w-6 h-6 text-primary" /> Admissions Pipeline
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Visual stage progression from initial walk-in inquiry to confirmed student enrollment.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={() => navigate('/admin/crm/inquiries/new')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <UserPlus size={14} /> + New Inquiry
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-text-muted">Loading pipeline board...</div>
      ) : (
        <CrmPipelineBoard
          leads={leads}
          onMoveStage={handleMoveStage}
          onConvert={(lead) => setConvertLead(lead)}
        />
      )}

      <CrmConvertModal
        isOpen={Boolean(convertLead)}
        lead={convertLead}
        onClose={() => setConvertLead(null)}
        onConverted={() => fetchLeads()}
      />
    </div>
  );
}

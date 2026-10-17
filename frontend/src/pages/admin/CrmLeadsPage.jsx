import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CrmLeadsHeader from '../../components/admin/crm/leads/CrmLeadsHeader';
import CrmLeadsFilterBar from '../../components/admin/crm/leads/CrmLeadsFilterBar';
import CrmLeadsTable from '../../components/admin/crm/leads/CrmLeadsTable';
import CrmConvertModal from '../../components/admin/crm/leads/CrmConvertModal';
import CrmFollowUpModal from '../../components/admin/crm/leads/CrmFollowUpModal';
import CrmDeleteModal from '../../components/admin/crm/leads/CrmDeleteModal';
import CrmSettingsModal from '../../components/admin/crm/leads/CrmSettingsModal';
import CrmQrInquiryModal from '../../components/admin/crm/leads/CrmQrInquiryModal';

const INITIAL_FILTERS = {
  search: '', campus_id: 'all', grade_id: 'all', lead_status: 'all', lead_source: 'all',
  priority: 'all', show_converted: false, follow_up_filter: 'all', page: 1, limit: 15
};

export default function CrmLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [badges, setBadges] = useState({ totalLeads: 0, convertedLeads: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [modals, setModals] = useState({
    convert: null, followUp: null, deleteLead: null, settings: false, qr: false
  });

  const loadPrereqs = async () => {
    try {
      const [cRes, gRes] = await Promise.all([api.get('/campuses'), api.get('/grades')]);
      setCampuses(cRes.data.campuses || cRes.data || []);
      setGrades(gRes.data.grades || gRes.data || []);
    } catch {}
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== 'all') params.append(k, v); });
      const res = await api.get(`/crm/leads?${params.toString()}`);
      if (res.data?.success) {
        setLeads(res.data.leads || []);
        setBadges(res.data.badges || { totalLeads: 0, convertedLeads: 0 });
        setTotalPages(res.data.totalPages || 1);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPrereqs(); }, []);
  useEffect(() => { fetchLeads(); }, [filters]);

  const handleTogglePin = async (id) => {
    try {
      await api.patch(`/crm/leads/${id}/pin`);
      fetchLeads();
    } catch {}
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await api.delete(`/crm/leads/${id}`);
      setModals((p) => ({ ...p, deleteLead: null }));
      fetchLeads();
    } catch {}
  };

  return (
    <div className="w-full space-y-4">
      <CrmLeadsHeader badges={badges} onOpenSettings={() => setModals((p) => ({ ...p, settings: true }))} />
      <CrmLeadsFilterBar filters={filters} campuses={campuses} grades={grades} onChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v, page: 1 }))} onReset={() => setFilters(INITIAL_FILTERS)} onOpenQr={() => setModals((p) => ({ ...p, qr: true }))} />
      <CrmLeadsTable leads={leads} loading={loading} page={filters.page} totalPages={totalPages} onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} onTogglePin={handleTogglePin} onOpenFollowUp={(l) => setModals((p) => ({ ...p, followUp: l }))} onOpenConvert={(l) => setModals((p) => ({ ...p, convert: l }))} onOpenDelete={(l) => setModals((p) => ({ ...p, deleteLead: l }))} />
      <CrmConvertModal isOpen={Boolean(modals.convert)} lead={modals.convert} onClose={() => setModals((p) => ({ ...p, convert: null }))} onConverted={() => fetchLeads()} />
      <CrmFollowUpModal isOpen={Boolean(modals.followUp)} lead={modals.followUp} onClose={() => setModals((p) => ({ ...p, followUp: null }))} onSaved={() => fetchLeads()} />
      <CrmDeleteModal isOpen={Boolean(modals.deleteLead)} lead={modals.deleteLead} onClose={() => setModals((p) => ({ ...p, deleteLead: null }))} onConfirm={handleDeleteConfirm} />
      <CrmSettingsModal isOpen={modals.settings} onClose={() => setModals((p) => ({ ...p, settings: false }))} />
      <CrmQrInquiryModal isOpen={modals.qr} onClose={() => setModals((p) => ({ ...p, qr: false }))} />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { PhoneCall } from 'lucide-react';
import api from '../../services/api';
import CrmFollowUpQueue from '../../components/admin/crm/followups/CrmFollowUpQueue';
import CrmFollowUpDetailPane from '../../components/admin/crm/followups/CrmFollowUpDetailPane';

export default function CrmFollowUpsPage() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeFilter, setActiveFilter] = useState('today');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/crm/leads?follow_up_filter=${activeFilter}&search=${search}&limit=100`);
      if (res.data?.success) {
        const list = res.data.leads || [];
        setLeads(list);
        if (list.length > 0 && !selectedLead) setSelectedLead(list[0]);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [activeFilter, search]);

  const handleFollowUpLogged = (updated) => {
    setSelectedLead(updated);
    fetchLeads();
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-line dark:border-line-dark">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-primary" /> Follow-ups Action Center
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Prioritized daily communication queue with instant call and WhatsApp logging.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7">
          <CrmFollowUpQueue
            leads={leads}
            selectedLeadId={selectedLead?._id}
            onSelectLead={(l) => setSelectedLead(l)}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
          />
        </div>
        <div className="lg:col-span-5 sticky top-4">
          <CrmFollowUpDetailPane
            lead={selectedLead}
            onFollowUpLogged={handleFollowUpLogged}
          />
        </div>
      </div>
    </div>
  );
}

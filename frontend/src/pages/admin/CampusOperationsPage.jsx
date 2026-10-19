import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import OperationsHeader from '../../components/admin/operations/OperationsHeader';
import OperationsForm from '../../components/admin/operations/OperationsForm';
import OperationsList from '../../components/admin/operations/OperationsList';
import OperationsTabNav from '../../components/admin/operations/OperationsTabNav';
import PrintableOperationModal from '../../components/admin/operations/PrintableOperationModal';
import api from '../../services/api';

const resolveRecordType = (pathname, defaultModule) => {
  if (defaultModule) return defaultModule;
  if (pathname.includes('/complaints')) return 'Complaint';
  if (pathname.includes('/counseling')) return 'Counseling';
  if (pathname.includes('/consent')) return 'Consent_Letter';
  if (pathname.includes('/lost-and-found')) return 'Lost_Found';
  if (pathname.includes('/news-feed')) return 'News_Circular';
  return 'Complaint';
};

const CampusOperationsPage = ({ defaultModule }) => {
  const location = useLocation();
  const recordType = resolveRecordType(location.pathname, defaultModule);
  const [records, setRecords] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    api.get('/grades').then((res) => setGrades(res.data?.grades || res.data || [])).catch(() => {});
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/operations/records', { params: { category: recordType } });
      setRecords(res.data?.data || []);
    } catch {}
    finally { setLoading(false); }
  }, [recordType]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/operations/records/${id}/status`, { status });
      loadData();
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/operations/records/${id}`);
      loadData();
    } catch {}
  };

  const activeCount = records.filter((r) => ['Open', 'In_Review'].includes(r.status)).length;
  const resolvedCount = records.filter((r) => ['Resolved', 'Approved', 'Claimed'].includes(r.status)).length;

  return (
    <div className="w-full space-y-5">
      <OperationsHeader
        recordType={recordType}
        stats={{ total: records.length, active: activeCount, resolved: resolvedCount }}
      />
      <OperationsTabNav currentType={recordType} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 xl:col-span-4">
          <OperationsForm recordType={recordType} onSaved={loadData} grades={grades} />
        </div>
        <div className="lg:col-span-7 xl:col-span-8">
          <OperationsList
            records={records}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onPrint={setSelectedRecord}
            loading={loading}
          />
        </div>
      </div>
      <PrintableOperationModal
        record={selectedRecord}
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};

export default CampusOperationsPage;

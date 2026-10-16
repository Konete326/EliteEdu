import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSystemLogs } from '../../hooks/useSystemLogs';
import LogsHeaderBar from '../../components/common/telemetry/LogsHeaderBar';
import LogsKpiGrid from '../../components/common/telemetry/LogsKpiGrid';
import LogsFilterBar from '../../components/common/telemetry/LogsFilterBar';
import LogsTable from '../../components/common/telemetry/LogsTable';
import LogInspectorPanel from '../../components/common/telemetry/LogInspectorPanel';
import LogsModals from '../../components/common/telemetry/LogsModals';

const SystemLogsPage = () => {
  const { user } = useAuth();
  const {
    logs, loading, refreshing, error, page, setPage, totalPages, total, summary,
    category, setCategory, severity, setSeverity, search, setSearch,
    selectedSchoolId, setSelectedSchoolId, schools, selectedLog, setSelectedLog,
    livePolling, setLivePolling, fetchLogs, deleteLog, clearAllLogs
  } = useSystemLogs(user);

  const [logToDelete, setLogToDelete] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const isSuperAdmin = user?.role === 'SuperAdmin';

  const handleConfirmDelete = async () => {
    if (!logToDelete) return;
    try {
      await deleteLog(logToDelete._id);
    } finally {
      setLogToDelete(null);
    }
  };

  const handleConfirmClear = async () => {
    try {
      await clearAllLogs();
    } finally {
      setShowClearModal(false);
    }
  };

  return (
    <div className="w-full space-y-4 pb-12">
      <LogsHeaderBar
        user={user}
        livePolling={livePolling}
        setLivePolling={setLivePolling}
        refreshing={refreshing}
        onRefresh={fetchLogs}
        onOpenClearModal={() => setShowClearModal(true)}
      />

      <LogsKpiGrid summary={summary} />

      <LogsFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        severity={severity}
        setSeverity={setSeverity}
        selectedSchoolId={selectedSchoolId}
        setSelectedSchoolId={setSelectedSchoolId}
        schools={schools}
        isSuperAdmin={isSuperAdmin}
        onResetPage={() => setPage(1)}
      />

      {error && (
        <div className="p-3 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-7 space-y-4">
          <LogsTable
            logs={logs}
            loading={loading}
            selectedLog={selectedLog}
            onSelectLog={setSelectedLog}
            onDeleteLog={(l) => setLogToDelete(l)}
            isSuperAdmin={isSuperAdmin}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            total={total}
          />
        </div>

        <div className="xl:col-span-5">
          <LogInspectorPanel
            log={selectedLog}
            onDeleteLog={(l) => setLogToDelete(l)}
            isSuperAdmin={isSuperAdmin}
          />
        </div>
      </div>

      <LogsModals
        logToDelete={logToDelete}
        onCloseDelete={() => setLogToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
        showClearModal={showClearModal}
        onCloseClear={() => setShowClearModal(false)}
        onConfirmClear={handleConfirmClear}
      />
    </div>
  );
};

export default SystemLogsPage;

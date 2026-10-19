import { useStudentAttendance } from '../../hooks/useStudentAttendance';
import StudentAttendanceHeader from '../../components/admin/attendance/StudentAttendanceHeader';
import StudentAttendanceKpiStrip from '../../components/admin/attendance/StudentAttendanceKpiStrip';
import AttendanceControlDock from '../../components/admin/attendance/AttendanceControlDock';
import ManualAttendanceSheet from '../../components/admin/attendance/ManualAttendanceSheet';
import CardScannerTerminal from '../../components/admin/attendance/CardScannerTerminal';

const StudentAttendancePage = () => {
  const {
    mode, setMode, date, setDate, grades, selectedGradeId, setSelectedGradeId,
    sections, selectedSection, setSelectedSection, filteredRecords, summary, search, setSearch,
    loading, saving, scanning, lastScanned, scanHistory, feedback,
    handleStatusChange, handleRemarksChange, handleMarkAll, handleSave, handleScanCode
  } = useStudentAttendance();

  return (
    <div className="w-full space-y-6 pb-12">
      <StudentAttendanceHeader
        mode={mode}
        onModeChange={setMode}
        summary={summary}
        saving={saving}
        onSave={handleSave}
        hasGrade={Boolean(selectedGradeId)}
      />

      <StudentAttendanceKpiStrip summary={summary} />

      {feedback.error && (
        <div className="p-3.5 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs font-semibold">
          {feedback.error}
        </div>
      )}

      {feedback.success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
          {feedback.success}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-4">
          <AttendanceControlDock
            date={date}
            setDate={setDate}
            grades={grades}
            selectedGradeId={selectedGradeId}
            setSelectedGradeId={setSelectedGradeId}
            sections={sections}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            summary={summary}
            totalStudents={summary.total || filteredRecords.length}
            loading={loading}
          />
        </div>

        <div className="xl:col-span-8">
          {mode === 'manual' ? (
            <ManualAttendanceSheet
              search={search}
              setSearch={setSearch}
              filteredRecords={filteredRecords}
              onStatusChange={handleStatusChange}
              onRemarksChange={handleRemarksChange}
              onMarkAll={handleMarkAll}
              onSave={handleSave}
              saving={saving}
              loading={loading}
              hasGrade={Boolean(selectedGradeId)}
            />
          ) : (
            <CardScannerTerminal
              onScanCode={handleScanCode}
              scanning={scanning}
              lastScanned={lastScanned}
              scanHistory={scanHistory}
              onOverrideStatus={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendancePage;

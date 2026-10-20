import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CampusProvider } from './context/CampusContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ComingSoonProvider } from './context/ComingSoonContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import NotificationsPage from './pages/common/NotificationsPage';
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './components/common/UnauthorizedPage';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import SchoolsList from './pages/superadmin/SchoolsList';
import SchoolsPage from './pages/superadmin/SchoolsPage';
import NotFoundPage from './pages/common/NotFoundPage';
import MyProfilePage from './pages/common/MyProfilePage';
import SystemLogsPage from './pages/common/SystemLogsPage';
import StudentEmergencyVerifyPage from './pages/public/StudentEmergencyVerifyPage';
import StaffServiceVerifyPage from './pages/public/StaffServiceVerifyPage';
import CertificateVerifyPage from './pages/public/CertificateVerifyPage';
import TeacherPortalDashboard from './pages/teacher/TeacherPortalDashboard';
import TeacherStudentsRosterPage from './pages/teacher/TeacherStudentsRosterPage';
import TeacherSalaryPage from './pages/teacher/TeacherSalaryPage';
import TeacherTimetablePage from './pages/teacher/TeacherTimetablePage';
import RootRedirect from './components/common/RootRedirect';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';
import InternalMessengerPage from './pages/common/InternalMessengerPage';
import { Agentation } from 'agentation';
import './utils/telemetryAgent';
import {
  AdminDashboard, TeachersList, AddTeacherPage, CampusPage, SubjectsPage, GradesPage, StudentsList, AddStudentPage,
  StaffApplicantsList, AddStaffApplicantPage, GradingPoliciesPage, AdmissionLetterPage, StudentIdCardsPage,
  TeacherIdCardsPage, ThemeSettingsPage, GeneralSettingsPage, UserManagementPage, PromoteStudentsPage,
  GeneralSignaturesPage, StudentAttendancePage, EmployeeAttendancePage, ExamsListPage, ExamWizardPage,
  ManageClassTestsPage, ClassTestResultsPage, FeeManagementPage,
  FeeCollectionPage, FeeStructurePage, FeeDefaultersPage, FeeConcessionsPage, FeeReportsPage,
  ExamCategoriesPage, RemarksPolicyPage,
  ManageRemarksPage, DatesheetsListPage, NewDatesheetPage, MarkSheetsPage, QuestionPapersPage,
  MasterReportsHubPage, StudentAdmissionReportPage, ParentContactReportPage, StudentReportCardPage,
  StaffInfoReportPage, CertificatesPage, LeaveRequestPage, AttendanceReportPage,
  CrmLeadsPage, CrmLeadFormPage, CrmPipelinePage, CrmFollowUpsPage, CrmAnalyticsPage,
  AccountsSuitePage, StaffPayrollPage, LmsSuitePage, TimetablePage,
  PosStorePage, StorePosPage, BehaviorSkillsPage, CampusTransferPage, CampusOperationsHubPage,
  CampusOperationsPage, PlannersAndEventsPage, BulkMigrationPage, BulkDataImportPage, TransportManagementPage,
  MessagingStudioPage, ZoomSettingsPage
} from './pages/admin';
import StudentPortalPage from './pages/student/StudentPortalPage';

function App() {
  return (
    <AuthProvider>
      <CampusProvider>
        <ThemeProvider>
          <ToastProvider>
            <ComingSoonProvider>
            <BrowserRouter>
              <PwaInstallPrompt />
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/verify/student/:id" element={<StudentEmergencyVerifyPage />} />
                <Route path="/verify/staff/:id" element={<StaffServiceVerifyPage />} />
                <Route path="/verify/certificate/:certNo" element={<CertificateVerifyPage />} />
                <Route element={<DashboardLayout />}>
                  <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
                    <Route path="/superadmin" element={<SuperAdminDashboard />} />
                    <Route path="/superadmin/schools" element={<SchoolsList />} />
                    <Route path="/superadmin/schools/new" element={<SchoolsPage />} />
                    <Route path="/superadmin/logs" element={<SystemLogsPage />} />
                    <Route path="/superadmin/notifications" element={<NotificationsPage />} />
                    <Route path="/superadmin/profile" element={<MyProfilePage />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={['Admin', 'Teacher']} />}>
                    <Route path="/admin/students" element={<StudentsList />} />
                    <Route path="/admin/students/new" element={<AddStudentPage />} />
                    <Route path="/admin/students/:id/edit" element={<AddStudentPage />} />
                    <Route path="/admin/students/admission-letter" element={<AdmissionLetterPage />} />
                    <Route path="/admin/students/id-cards" element={<StudentIdCardsPage />} />
                    <Route path="/admin/students/promote" element={<PromoteStudentsPage />} />
                    <Route path="/admin/control-panel/class-transfer" element={<PromoteStudentsPage />} />
                    <Route path="/admin/attendance/students" element={<StudentAttendancePage />} />
                    <Route path="/admin/attendance/staff" element={<EmployeeAttendancePage />} />
                    <Route path="/admin/attendance/employees" element={<EmployeeAttendancePage />} />
                    <Route path="/admin/attendance/leave-request" element={<LeaveRequestPage />} />
                    <Route path="/admin/attendance/report" element={<AttendanceReportPage />} />
                    <Route path="/admin/exam-management/exams" element={<ExamsListPage />} />
                    <Route path="/admin/exams/schedules" element={<ExamsListPage />} />
                    <Route path="/admin/exams/date-sheets" element={<ExamsListPage />} />
                    <Route path="/admin/exams/marks" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/exams/new" element={<ExamWizardPage />} />
                    <Route path="/admin/exam-management/exams/:id/edit" element={<ExamWizardPage />} />
                    <Route path="/admin/exam-management/categories" element={<ExamCategoriesPage />} />
                    <Route path="/admin/exam-management/remarks-policy" element={<RemarksPolicyPage />} />
                    <Route path="/admin/exam-management/schedule" element={<DatesheetsListPage />} />
                    <Route path="/admin/exam-management/schedule/new" element={<NewDatesheetPage />} />
                    <Route path="/admin/exam-management/manage-remarks" element={<ManageRemarksPage />} />
                    <Route path="/admin/exam-management/mark-sheets" element={<MarkSheetsPage />} />
                    <Route path="/admin/exam-management/results" element={<MarkSheetsPage />} />
                    <Route path="/admin/question-papers" element={<QuestionPapersPage />} />
                    <Route path="/admin/class-tests/manage" element={<ManageClassTestsPage />} />
                    <Route path="/admin/class-tests/results" element={<ClassTestResultsPage />} />
                    <Route path="/teacher/exams" element={<ExamsListPage />} />
                    <Route path="/teacher/examination" element={<ExamsListPage />} />
                    <Route path="/teacher/datesheet" element={<DatesheetsListPage />} />
                    <Route path="/teacher/mark-sheets" element={<MarkSheetsPage />} />
                    <Route path="/teacher/question-papers" element={<QuestionPapersPage />} />
                    <Route path="/teacher/class-tests" element={<ManageClassTestsPage />} />
                    <Route path="/admin/reports" element={<MasterReportsHubPage />} />
                    <Route path="/admin/reports/academic" element={<MasterReportsHubPage />} />
                    <Route path="/admin/reports/report-cards" element={<StudentReportCardPage />} />
                    <Route path="/admin/reports/student-info" element={<StudentAdmissionReportPage />} />
                    <Route path="/admin/reports/parent-info" element={<ParentContactReportPage />} />
                    <Route path="/admin/reports/staff-info" element={<StaffInfoReportPage />} />
                    <Route path="/admin/reports/attendance-report" element={<AttendanceReportPage />} />
                    <Route path="/admin/reports/attendance" element={<AttendanceReportPage />} />
                    <Route path="/admin/certificates" element={<CertificatesPage />} />
                    <Route path="/admin/certificates/templates" element={<CertificatesPage defaultTab="templates" />} />
                    <Route path="/admin/crm/inquiries" element={<CrmLeadsPage />} />
                    <Route path="/admin/crm/leads" element={<CrmLeadsPage />} />
                    <Route path="/admin/crm/inquiries/new" element={<CrmLeadFormPage />} />
                    <Route path="/admin/crm/inquiries/:id/edit" element={<CrmLeadFormPage />} />
                    <Route path="/admin/crm/admissions" element={<CrmPipelinePage />} />
                    <Route path="/admin/crm/follow-ups" element={<CrmFollowUpsPage />} />
                    <Route path="/admin/crm/analytics" element={<CrmAnalyticsPage />} />
                    <Route path="/admin/lms/courses" element={<LmsSuitePage />} />
                    <Route path="/admin/lms/syllabus" element={<LmsSuitePage />} />
                    <Route path="/admin/lms/assignments" element={<LmsSuitePage />} />
                    <Route path="/admin/lms/material" element={<LmsSuitePage />} />
                    <Route path="/admin/lms/live" element={<LmsSuitePage />} />
                    <Route path="/admin/online-classes" element={<LmsSuitePage />} />
                    <Route path="/admin/timetable" element={<TimetablePage />} />
                    <Route path="/admin/academics/timetable" element={<TimetablePage />} />
                    <Route path="/admin/planners/timetable" element={<TimetablePage />} />
                    <Route path="/admin/planners" element={<PlannersAndEventsPage />} />
                    <Route path="/admin/planners/academic-calendar" element={<PlannersAndEventsPage />} />
                    <Route path="/admin/planners/lesson-plans" element={<PlannersAndEventsPage />} />
                    <Route path="/admin/planners/activity-planner" element={<PlannersAndEventsPage />} />
                    <Route path="/admin/planners/*" element={<PlannersAndEventsPage />} />
                    <Route path="/admin/student-portal-preview" element={<StudentPortalPage />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={['Admin']} requiredModule="fees" />}>
                    <Route path="/admin/fees" element={<FeeCollectionPage />} />
                    <Route path="/admin/fees/collection" element={<FeeCollectionPage />} />
                    <Route path="/admin/fees/structure" element={<FeeStructurePage />} />
                    <Route path="/admin/fees/defaulters" element={<FeeDefaultersPage />} />
                    <Route path="/admin/fees/reports" element={<FeeReportsPage />} />
                    <Route path="/admin/fees/concession" element={<FeeConcessionsPage />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/campus" element={<CampusPage />} />
                    <Route path="/admin/grades" element={<GradesPage />} />
                    <Route path="/admin/subjects" element={<SubjectsPage />} />
                    <Route path="/admin/teachers" element={<TeachersList />} />
                    <Route path="/admin/teachers/new" element={<AddTeacherPage />} />
                    <Route path="/admin/teachers/:id/edit" element={<AddTeacherPage />} />
                    <Route path="/admin/teachers/id-cards" element={<TeacherIdCardsPage />} />
                    <Route path="/admin/staff-applicants" element={<StaffApplicantsList />} />
                    <Route path="/admin/staff-applicants/new" element={<AddStaffApplicantPage />} />
                    <Route path="/admin/staff-applicants/:id/edit" element={<AddStaffApplicantPage />} />
                    <Route path="/admin/exam-management/grading-policies" element={<GradingPoliciesPage />} />
                    <Route path="/admin/exams/grading-policies" element={<GradingPoliciesPage />} />
                    <Route path="/admin/settings/general" element={<GeneralSettingsPage />} />
                    <Route path="/admin/settings/integrations/zoom" element={<ZoomSettingsPage />} />
                    <Route path="/admin/general-settings/signatures" element={<GeneralSignaturesPage />} />
                    <Route path="/admin/settings/signatures" element={<GeneralSignaturesPage />} />
                    <Route path="/admin/settings/appearance" element={<ThemeSettingsPage />} />
                    <Route path="/admin/control-panel/branding" element={<ThemeSettingsPage />} />
                    <Route path="/admin/control-panel/user-management" element={<UserManagementPage defaultTab="users" />} />
                    <Route path="/admin/settings/roles" element={<UserManagementPage defaultTab="roles" />} />
                    <Route path="/admin/notifications" element={<NotificationsPage />} />
                    <Route path="/admin/messaging/notifications" element={<NotificationsPage />} />
                    <Route path="/admin/messaging" element={<MessagingStudioPage />} />
                    <Route path="/admin/messaging/messages" element={<MessagingStudioPage />} />
                    <Route path="/admin/messaging/internal" element={<MessagingStudioPage />} />
                    <Route path="/admin/messages" element={<MessagingStudioPage />} />
                    <Route path="/admin/messaging/chat" element={<InternalMessengerPage defaultTab="chat" />} />
                    <Route path="/admin/messaging/sms" element={<InternalMessengerPage defaultTab="sms" />} />
                    <Route path="/admin/messaging/whatsapp" element={<InternalMessengerPage defaultTab="whatsapp" />} />
                    <Route path="/admin/messaging/email" element={<InternalMessengerPage defaultTab="email" />} />
                    <Route path="/admin/circular" element={<InternalMessengerPage defaultTab="circular" />} />
                    <Route path="/admin/settings/backup" element={<SystemLogsPage />} />
                    <Route path="/admin/van/routes" element={<TransportManagementPage />} />
                    <Route path="/admin/van/vehicles" element={<TransportManagementPage />} />
                    <Route path="/admin/van/drivers" element={<TransportManagementPage />} />
                    <Route path="/admin/van/allocation" element={<TransportManagementPage />} />
                    <Route path="/admin/reports/audit-logs" element={<SystemLogsPage />} />
                    <Route path="/admin/profile" element={<MyProfilePage />} />
                    <Route path="/admin/settings/profile" element={<MyProfilePage />} />
                    <Route path="/admin/accounts" element={<AccountsSuitePage />} />
                    <Route path="/admin/accounts/chart" element={<AccountsSuitePage />} />
                    <Route path="/admin/accounts/income" element={<AccountsSuitePage />} />
                    <Route path="/admin/accounts/expenses" element={<AccountsSuitePage />} />
                    <Route path="/admin/accounts/transactions" element={<AccountsSuitePage />} />
                    <Route path="/admin/accounts/balance-sheet" element={<AccountsSuitePage />} />
                    <Route path="/admin/payroll" element={<StaffPayrollPage />} />
                    <Route path="/admin/store" element={<PosStorePage />} />
                    <Route path="/admin/pos" element={<PosStorePage />} />
                    <Route path="/admin/online-store" element={<PosStorePage />} />
                    <Route path="/admin/behavior" element={<BehaviorSkillsPage />} />
                    <Route path="/admin/behavior-skills" element={<BehaviorSkillsPage />} />
                    <Route path="/admin/campus-transfer" element={<CampusTransferPage />} />
                    <Route path="/admin/events" element={<PlannersAndEventsPage />} />
                    <Route path="/admin/news-feed" element={<CampusOperationsPage />} />
                    <Route path="/admin/complaints" element={<CampusOperationsPage />} />
                    <Route path="/admin/consent" element={<CampusOperationsPage />} />
                    <Route path="/admin/lost-and-found" element={<CampusOperationsPage />} />
                    <Route path="/admin/counseling" element={<CampusOperationsPage />} />
                    <Route path="/admin/operations" element={<CampusOperationsPage />} />
                    <Route path="/admin/operations/*" element={<CampusOperationsPage />} />
                    <Route path="/admin/control-panel/bulk-import" element={<BulkDataImportPage />} />
                    <Route path="/admin/bulk-import" element={<BulkDataImportPage />} />
                    <Route path="/admin/data-migration" element={<BulkMigrationPage />} />
                    <Route path="/admin/transport" element={<TransportManagementPage />} />
                    <Route path="/admin/general-settings/transport" element={<TransportManagementPage />} />
                    <Route path="/admin/van-management" element={<TransportManagementPage />} />
                    <Route path="/admin/van-management/*" element={<TransportManagementPage />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={['Teacher']} />}>
                    <Route path="/teacher" element={<TeacherPortalDashboard />} />
                    <Route path="/teacher/students" element={<TeacherStudentsRosterPage />} />
                    <Route path="/teacher/my-students" element={<TeacherStudentsRosterPage />} />
                    <Route path="/teacher/attendance" element={<StudentAttendancePage />} />
                    <Route path="/teacher/leaves" element={<LeaveRequestPage />} />
                    <Route path="/teacher/attendance-report" element={<AttendanceReportPage />} />
                    <Route path="/teacher/homework" element={<LmsSuitePage />} />
                    <Route path="/teacher/timetable" element={<TeacherTimetablePage />} />
                    <Route path="/teacher/quizzes" element={<LmsSuitePage />} />
                    <Route path="/teacher/lectures" element={<LmsSuitePage />} />
                    <Route path="/teacher/online-classes" element={<LmsSuitePage />} />
                    <Route path="/teacher/salary" element={<TeacherSalaryPage />} />
                    <Route path="/teacher/behavior" element={<BehaviorSkillsPage />} />
                    <Route path="/teacher/behavior-skills" element={<BehaviorSkillsPage />} />
                    <Route path="/teacher/events" element={<PlannersAndEventsPage />} />
                    <Route path="/teacher/complaints" element={<CampusOperationsPage />} />
                    <Route path="/teacher/counseling" element={<CampusOperationsPage />} />
                    <Route path="/teacher/planner" element={<PlannersAndEventsPage />} />
                    <Route path="/teacher/lost-and-found" element={<CampusOperationsPage />} />
                    <Route path="/teacher/notifications" element={<NotificationsPage />} />
                    <Route path="/teacher/profile" element={<MyProfilePage />} />
                    <Route path="/teacher/messages" element={<MessagingStudioPage />} />
                    <Route path="/teacher/chat" element={<InternalMessengerPage />} />
                    <Route path="/teacher/circular" element={<InternalMessengerPage defaultTab="circular" />} />
                    <Route path="/teacher/feedback" element={<CampusOperationsPage />} />
                    <Route path="/teacher/my-profile" element={<MyProfilePage />} />
                    <Route path="/teacher/update-picture" element={<MyProfilePage />} />
                    <Route path="/teacher/*" element={<TeacherPortalDashboard />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={['Student', 'Admin', 'Teacher']} />}>
                    <Route path="/student" element={<StudentPortalPage />} />
                    <Route path="/student/dashboard" element={<StudentPortalPage />} />
                    <Route path="/student/messages" element={<MessagingStudioPage />} />
                    <Route path="/student/*" element={<StudentPortalPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
            {import.meta.env.DEV && <Agentation />}
            </ComingSoonProvider>
          </ToastProvider>
        </ThemeProvider>
      </CampusProvider>
    </AuthProvider>
  );
}

export default App;

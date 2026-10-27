import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CampusProvider } from './context/CampusContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ComingSoonProvider } from './context/ComingSoonContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import PageLoader from './components/common/PageLoader';
import RootRedirect from './components/common/RootRedirect';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';
import { Agentation } from 'agentation';
import './utils/telemetryAgent';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const UnauthorizedPage = lazy(() => import('./components/common/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('./pages/common/NotFoundPage'));
const NotificationsPage = lazy(() => import('./pages/common/NotificationsPage'));
const MyProfilePage = lazy(() => import('./pages/common/MyProfilePage'));
const SystemLogsPage = lazy(() => import('./pages/common/SystemLogsPage'));
const InternalMessengerPage = lazy(() => import('./pages/common/InternalMessengerPage'));
const StudentEmergencyVerifyPage = lazy(() => import('./pages/public/StudentEmergencyVerifyPage'));
const StaffServiceVerifyPage = lazy(() => import('./pages/public/StaffServiceVerifyPage'));
const CertificateVerifyPage = lazy(() => import('./pages/public/CertificateVerifyPage'));

const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));
const SchoolsList = lazy(() => import('./pages/superadmin/SchoolsList'));
const SchoolsPage = lazy(() => import('./pages/superadmin/SchoolsPage'));

const TeacherPortalDashboard = lazy(() => import('./pages/teacher/TeacherPortalDashboard'));
const TeacherStudentsRosterPage = lazy(() => import('./pages/teacher/TeacherStudentsRosterPage'));
const TeacherSalaryPage = lazy(() => import('./pages/teacher/TeacherSalaryPage'));
const TeacherTimetablePage = lazy(() => import('./pages/teacher/TeacherTimetablePage'));

const StudentPortalPage = lazy(() => import('./pages/student/StudentPortalPage'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const TeachersList = lazy(() => import('./pages/admin/TeachersList'));
const AddTeacherPage = lazy(() => import('./pages/admin/AddTeacherPage'));
const CampusPage = lazy(() => import('./pages/admin/CampusPage'));
const SubjectsPage = lazy(() => import('./pages/admin/SubjectsPage'));
const GradesPage = lazy(() => import('./pages/admin/GradesPage'));
const StudentsList = lazy(() => import('./pages/admin/StudentsList'));
const AddStudentPage = lazy(() => import('./pages/admin/AddStudentPage'));
const StaffApplicantsList = lazy(() => import('./pages/admin/StaffApplicantsList'));
const AddStaffApplicantPage = lazy(() => import('./pages/admin/AddStaffApplicantPage'));
const GradingPoliciesPage = lazy(() => import('./pages/admin/GradingPoliciesPage'));
const AdmissionLetterPage = lazy(() => import('./pages/admin/AdmissionLetterPage'));
const StudentIdCardsPage = lazy(() => import('./pages/admin/StudentIdCardsPage'));
const TeacherIdCardsPage = lazy(() => import('./pages/admin/TeacherIdCardsPage'));
const ThemeSettingsPage = lazy(() => import('./pages/admin/ThemeSettingsPage'));
const GeneralSettingsPage = lazy(() => import('./pages/admin/GeneralSettingsPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const PromoteStudentsPage = lazy(() => import('./pages/admin/PromoteStudentsPage'));
const GeneralSignaturesPage = lazy(() => import('./pages/admin/GeneralSignaturesPage'));
const StudentAttendancePage = lazy(() => import('./pages/admin/StudentAttendancePage'));
const EmployeeAttendancePage = lazy(() => import('./pages/admin/EmployeeAttendancePage'));
const ExamsListPage = lazy(() => import('./pages/admin/ExamsListPage'));
const ExamWizardPage = lazy(() => import('./pages/admin/ExamWizardPage'));
const ManageClassTestsPage = lazy(() => import('./pages/admin/ManageClassTestsPage'));
const ClassTestResultsPage = lazy(() => import('./pages/admin/ClassTestResultsPage'));
const FeeCollectionPage = lazy(() => import('./pages/admin/fees/FeeCollectionPage'));
const FeeStructurePage = lazy(() => import('./pages/admin/fees/FeeStructurePage'));
const FeeDefaultersPage = lazy(() => import('./pages/admin/fees/FeeDefaultersPage'));
const FeeConcessionsPage = lazy(() => import('./pages/admin/fees/FeeConcessionsPage'));
const FeeReportsPage = lazy(() => import('./pages/admin/fees/FeeReportsPage'));
const ExamCategoriesPage = lazy(() => import('./pages/admin/ExamCategoriesPage'));
const RemarksPolicyPage = lazy(() => import('./pages/admin/RemarksPolicyPage'));
const ManageRemarksPage = lazy(() => import('./pages/admin/ManageRemarksPage'));
const DatesheetsListPage = lazy(() => import('./pages/admin/DatesheetsListPage'));
const NewDatesheetPage = lazy(() => import('./pages/admin/NewDatesheetPage'));
const MarkSheetsPage = lazy(() => import('./pages/admin/MarkSheetsPage'));
const QuestionPapersPage = lazy(() => import('./pages/admin/QuestionPapersPage'));
const MasterReportsHubPage = lazy(() => import('./pages/admin/MasterReportsHubPage'));
const StudentAdmissionReportPage = lazy(() => import('./pages/admin/StudentAdmissionReportPage'));
const ParentContactReportPage = lazy(() => import('./pages/admin/ParentContactReportPage'));
const StudentReportCardPage = lazy(() => import('./pages/admin/StudentReportCardPage'));
const StaffInfoReportPage = lazy(() => import('./pages/admin/StaffInfoReportPage'));
const CertificatesPage = lazy(() => import('./pages/admin/CertificatesPage'));
const LeaveRequestPage = lazy(() => import('./pages/admin/LeaveRequestPage'));
const AttendanceReportPage = lazy(() => import('./pages/admin/AttendanceReportPage'));
const CrmLeadsPage = lazy(() => import('./pages/admin/CrmLeadsPage'));
const CrmLeadFormPage = lazy(() => import('./pages/admin/CrmLeadFormPage'));
const CrmPipelinePage = lazy(() => import('./pages/admin/CrmPipelinePage'));
const CrmFollowUpsPage = lazy(() => import('./pages/admin/CrmFollowUpsPage'));
const CrmAnalyticsPage = lazy(() => import('./pages/admin/CrmAnalyticsPage'));
const AccountsSuitePage = lazy(() => import('./pages/admin/AccountsSuitePage'));
const StaffPayrollPage = lazy(() => import('./pages/admin/StaffPayrollPage'));
const LmsSuitePage = lazy(() => import('./pages/admin/LmsSuitePage'));
const TimetablePage = lazy(() => import('./pages/admin/TimetablePage'));
const PosStorePage = lazy(() => import('./pages/admin/PosStorePage'));
const BehaviorSkillsPage = lazy(() => import('./pages/admin/BehaviorSkillsPage'));
const CampusTransferPage = lazy(() => import('./pages/admin/CampusTransferPage'));
const CampusOperationsPage = lazy(() => import('./pages/admin/CampusOperationsPage'));
const PlannersAndEventsPage = lazy(() => import('./pages/admin/PlannersAndEventsPage'));
const BulkMigrationPage = lazy(() => import('./pages/admin/BulkMigrationPage'));
const BulkDataImportPage = lazy(() => import('./pages/admin/BulkDataImportPage'));
const TransportManagementPage = lazy(() => import('./pages/admin/TransportManagementPage'));
const MessagingStudioPage = lazy(() => import('./pages/admin/MessagingStudioPage'));
const ZoomSettingsPage = lazy(() => import('./pages/admin/ZoomSettingsPage'));

function App() {
  return (
    <AuthProvider>
      <CampusProvider>
        <ThemeProvider>
          <ToastProvider>
            <ComingSoonProvider>
            <BrowserRouter>
              <PwaInstallPrompt />
              <Suspense fallback={<PageLoader text="Loading section..." />}>
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
                    <Route path="/admin/exam-management/exams/new" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/exams/:id/edit" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/categories" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/remarks-policy" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/schedule" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/schedule/new" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/manage-remarks" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/mark-sheets" element={<ExamsListPage />} />
                    <Route path="/admin/exam-management/results" element={<ExamsListPage />} />
                    <Route path="/admin/question-papers" element={<ExamsListPage />} />
                    <Route path="/admin/class-tests/manage" element={<ExamsListPage />} />
                    <Route path="/admin/class-tests/results" element={<ExamsListPage />} />
                    <Route path="/teacher/exams" element={<ExamsListPage />} />
                    <Route path="/teacher/examination" element={<ExamsListPage />} />
                    <Route path="/teacher/datesheet" element={<ExamsListPage />} />
                    <Route path="/teacher/mark-sheets" element={<ExamsListPage />} />
                    <Route path="/teacher/question-papers" element={<ExamsListPage />} />
                    <Route path="/teacher/class-tests" element={<ExamsListPage />} />
                    <Route path="/admin/reports" element={<MasterReportsHubPage />} />
                    <Route path="/admin/reports/academic" element={<MasterReportsHubPage />} />
                    <Route path="/admin/reports/report-cards" element={<StudentReportCardPage />} />
                    <Route path="/admin/reports/student-info" element={<StudentAdmissionReportPage />} />
                    <Route path="/admin/reports/parent-info" element={<ParentContactReportPage />} />
                    <Route path="/admin/reports/staff-info" element={<StaffInfoReportPage />} />
                    <Route path="/admin/reports/attendance-report" element={<AttendanceReportPage />} />
                    <Route path="/admin/reports/attendance" element={<AttendanceReportPage />} />
                    <Route path="/admin/certificates" element={<CertificatesPage key="generate" defaultTab="generate" />} />
                    <Route path="/admin/certificates/templates" element={<CertificatesPage key="templates" defaultTab="templates" />} />
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
                    <Route path="/admin/exam-management/grading-policies" element={<ExamsListPage />} />
                    <Route path="/admin/exams/grading-policies" element={<ExamsListPage />} />
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
                    <Route path="/teacher/profile" element={<Navigate to="/teacher/dashboard" replace />} />
                    <Route path="/teacher/messages" element={<MessagingStudioPage />} />
                    <Route path="/teacher/chat" element={<InternalMessengerPage />} />
                    <Route path="/teacher/circular" element={<InternalMessengerPage defaultTab="circular" />} />
                    <Route path="/teacher/feedback" element={<CampusOperationsPage />} />
                    <Route path="/teacher/my-profile" element={<Navigate to="/teacher/dashboard" replace />} />
                    <Route path="/teacher/update-picture" element={<Navigate to="/teacher/dashboard" replace />} />
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
            </Suspense>
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

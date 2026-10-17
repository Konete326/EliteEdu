import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ComingSoonProvider } from './context/ComingSoonContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
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
import TeacherPortalDashboard from './pages/teacher/TeacherPortalDashboard';
import RootRedirect from './components/common/RootRedirect';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';
import { getAllAdminRoutes } from './config/adminNavConfig';
import { Agentation } from 'agentation';
import './utils/telemetryAgent';
import {
  AdminDashboard, TeachersList, AddTeacherPage, CampusPage, SubjectsPage, GradesPage,
  StudentsList, AddStudentPage, StaffApplicantsList, AddStaffApplicantPage, GradingPoliciesPage,
  AdmissionLetterPage, StudentIdCardsPage, TeacherIdCardsPage, ThemeSettingsPage, GeneralSettingsPage,
  UserManagementPage, PromoteStudentsPage, GeneralSignaturesPage, StudentAttendancePage,
  StaffAttendancePage, EmployeeAttendancePage, ComingSoonPage
} from './pages/admin';

const adminDynamicRoutes = getAllAdminRoutes();

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ComingSoonProvider>
          <BrowserRouter>
            <PwaInstallPrompt />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/verify/student/:id" element={<StudentEmergencyVerifyPage />} />
              <Route path="/verify/staff/:id" element={<StaffServiceVerifyPage />} />
              <Route element={<DashboardLayout />}>
                <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
                  <Route path="/superadmin" element={<SuperAdminDashboard />} />
                  <Route path="/superadmin/schools" element={<SchoolsList />} />
                  <Route path="/superadmin/schools/new" element={<SchoolsPage />} />
                  <Route path="/superadmin/logs" element={<SystemLogsPage />} />
                  <Route path="/superadmin/profile" element={<MyProfilePage />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['Admin', 'Teacher']} />}>
                  <Route path="/admin/students/promote" element={<PromoteStudentsPage />} />
                  <Route path="/admin/control-panel/class-transfer" element={<PromoteStudentsPage />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/campus" element={<CampusPage />} />
                  <Route path="/admin/grades" element={<GradesPage />} />
                  <Route path="/admin/subjects" element={<SubjectsPage />} />
                  <Route path="/admin/teachers" element={<TeachersList />} />
                  <Route path="/admin/teachers/new" element={<AddTeacherPage />} />
                  <Route path="/admin/teachers/:id/edit" element={<AddTeacherPage />} />
                  <Route path="/admin/teachers/id-cards" element={<TeacherIdCardsPage />} />
                  <Route path="/admin/students" element={<StudentsList />} />
                  <Route path="/admin/students/new" element={<AddStudentPage />} />
                  <Route path="/admin/students/:id/edit" element={<AddStudentPage />} />
                  <Route path="/admin/staff-applicants" element={<StaffApplicantsList />} />
                  <Route path="/admin/staff-applicants/new" element={<AddStaffApplicantPage />} />
                  <Route path="/admin/staff-applicants/:id/edit" element={<AddStaffApplicantPage />} />
                  <Route path="/admin/exam-management/grading-policies" element={<GradingPoliciesPage />} />
                  <Route path="/admin/exams/grading-policies" element={<GradingPoliciesPage />} />
                  <Route path="/admin/students/admission-letter" element={<AdmissionLetterPage />} />
                  <Route path="/admin/students/id-cards" element={<StudentIdCardsPage />} />
                  <Route path="/admin/attendance/students" element={<StudentAttendancePage />} />
                  <Route path="/admin/attendance/staff" element={<EmployeeAttendancePage />} />
                  <Route path="/admin/attendance/employees" element={<EmployeeAttendancePage />} />
                  <Route path="/admin/settings/general" element={<GeneralSettingsPage />} />
                  <Route path="/admin/general-settings/signatures" element={<GeneralSignaturesPage />} />
                  <Route path="/admin/settings/signatures" element={<GeneralSignaturesPage />} />
                  <Route path="/admin/settings/appearance" element={<ThemeSettingsPage />} />
                  <Route path="/admin/control-panel/branding" element={<ThemeSettingsPage />} />
                  <Route path="/admin/control-panel/user-management" element={<UserManagementPage defaultTab="users" />} />
                  <Route path="/admin/settings/roles" element={<UserManagementPage defaultTab="roles" />} />
                  <Route path="/admin/control-panel/roles" element={<UserManagementPage defaultTab="roles" />} />
                  <Route path="/admin/roles" element={<UserManagementPage defaultTab="roles" />} />
                  <Route path="/admin/reports/audit-logs" element={<SystemLogsPage />} />
                  <Route path="/admin/profile" element={<MyProfilePage />} />
                  {adminDynamicRoutes.map((r) => (
                    <Route key={r.path} path={r.path} element={<ComingSoonPage title={r.name} />} />
                  ))}
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['Teacher']} />}>
                  <Route path="/teacher" element={<TeacherPortalDashboard />} />
                  <Route path="/teacher/students" element={<TeacherPortalDashboard />} />
                  <Route path="/teacher/attendance" element={<StudentAttendancePage />} />
                  <Route path="/teacher/profile" element={<MyProfilePage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
          {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
        </ComingSoonProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

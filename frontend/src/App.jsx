import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComingSoonProvider } from './context/ComingSoonContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import SchoolsList from './pages/superadmin/SchoolsList';
import SchoolsPage from './pages/superadmin/SchoolsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeachersList from './pages/admin/TeachersList';
import AddTeacherPage from './pages/admin/AddTeacherPage';
import CampusPage from './pages/admin/CampusPage';
import SubjectsPage from './pages/admin/SubjectsPage';
import GradesPage from './pages/admin/GradesPage';
import StudentsList from './pages/admin/StudentsList';
import AddStudentPage from './pages/admin/AddStudentPage';
import StaffApplicantsList from './pages/admin/StaffApplicantsList';
import AddStaffApplicantPage from './pages/admin/AddStaffApplicantPage';
import ComingSoonPage from './pages/admin/ComingSoonPage';
import NotFoundPage from './pages/common/NotFoundPage';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';
import { getAllAdminRoutes } from './config/adminNavConfig';
import { Agentation } from 'agentation';

const TeacherDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">Teacher Portal</h1>
    <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">Mark student attendance and view class timetables.</p>
  </div>
);

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark text-ink dark:text-ink-dark">
    <div className="p-6 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl text-center">
      <h2 className="text-xl font-bold text-bad">Access Denied</h2>
      <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1">You do not have permission to view this page.</p>
    </div>
  </div>
);

const adminDynamicRoutes = getAllAdminRoutes();

function App() {
  return (
    <AuthProvider>
      <ComingSoonProvider>
        <BrowserRouter>
          <PwaInstallPrompt />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route element={<DashboardLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
                <Route path="/superadmin" element={<SuperAdminDashboard />} />
                <Route path="/superadmin/schools" element={<SchoolsList />} />
                <Route path="/superadmin/schools/new" element={<SchoolsPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/campus" element={<CampusPage />} />
                <Route path="/admin/grades" element={<GradesPage />} />
                <Route path="/admin/subjects" element={<SubjectsPage />} />
                <Route path="/admin/teachers" element={<TeachersList />} />
                <Route path="/admin/teachers/new" element={<AddTeacherPage />} />
                <Route path="/admin/teachers/:id/edit" element={<AddTeacherPage />} />
                <Route path="/admin/students" element={<StudentsList />} />
                <Route path="/admin/students/new" element={<AddStudentPage />} />
                <Route path="/admin/students/:id/edit" element={<AddStudentPage />} />
                <Route path="/admin/staff-applicants" element={<StaffApplicantsList />} />
                <Route path="/admin/staff-applicants/new" element={<AddStaffApplicantPage />} />
                <Route path="/admin/staff-applicants/:id/edit" element={<AddStaffApplicantPage />} />
                {adminDynamicRoutes.map((r) => (
                  <Route key={r.path} path={r.path} element={<ComingSoonPage title={r.name} />} />
                ))}
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['Teacher']} />}>
                <Route path="/teacher" element={<TeacherDashboard />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
      </ComingSoonProvider>
    </AuthProvider>
  );
}

export default App;

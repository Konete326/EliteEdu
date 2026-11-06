export const ROLE_DASHBOARD_ROUTES = {
  SuperAdmin: '/superadmin',
  Teacher: '/teacher',
  Student: '/student/dashboard',
  Admin: '/admin'
};

export const getDefaultDashboardRoute = (role) => {
  if (!role) return '/login';
  return ROLE_DASHBOARD_ROUTES[role] || '/admin';
};

export const getProfileRoute = (role) => {
  if (role === 'SuperAdmin') return '/superadmin/profile';
  if (role === 'Teacher') return '/teacher/profile';
  return '/admin/profile';
};

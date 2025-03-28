import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';

// Pages
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Waitlist from './pages/Waitlist';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AuthCallback from './pages/auth/AuthCallback';
import RoleSelection from './pages/signup/RoleSelection';
import PlanSelection from './pages/signup/PlanSelection';
import Setup from './pages/signup/Setup';
import Complete from './pages/signup/Complete';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import RoleManagement from './pages/admin/RoleManagement';
import UserPermissions from './pages/admin/UserPermissions';
import UserManagement from './pages/admin/UserManagement';
import EditUser from './pages/admin/users/EditUser';
import ResetUserPassword from './pages/admin/users/ResetPassword';
import ManagePermissions from './pages/admin/users/ManagePermissions';
import NewUser from './pages/admin/users/NewUser';
import Overview from './pages/admin/analytics/Overview';
import Performance from './pages/admin/analytics/Performance';
import Logs from './pages/admin/analytics/Logs';
import ContentManager from './pages/admin/content/ContentManager';
import SecuritySettings from './pages/admin/security/SecuritySettings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<Layout requireAuth />}>
        <Route path="/signup/role" element={
          <AuthGuard>
            <RoleSelection />
          </AuthGuard>
        } />
        <Route path="/signup/plan" element={
          <AuthGuard>
            <PlanSelection />
          </AuthGuard>
        } />
        <Route path="/signup/setup" element={
          <AuthGuard>
            <Setup />
          </AuthGuard>
        } />
        <Route path="/signup/complete" element={
          <AuthGuard>
            <Complete />
          </AuthGuard>
        } />
        <Route path="/dashboard/*" element={
          <AuthGuard requireSubscription>
            <Dashboard />
          </AuthGuard>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminDashboard />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="users/new" element={<NewUser />} />
          <Route path="users/:userId/edit" element={<EditUser />} />
          <Route path="users/:userId/reset-password" element={<ResetUserPassword />} />
          <Route path="users/:userId/permissions" element={<ManagePermissions />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="permissions" element={<UserPermissions />} />
          <Route path="analytics" element={<Overview />} />
          <Route path="analytics/performance" element={<Performance />} />
          <Route path="analytics/logs" element={<Logs />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="security" element={<SecuritySettings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
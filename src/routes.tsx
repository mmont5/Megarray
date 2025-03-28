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
        <Route path="/admin/*" element={
          <AuthGuard allowedRoles={['admin', 'super_admin']}>
            <AdminDashboard />
          </AuthGuard>
        } />
        <Route path="/admin/roles" element={
          <AuthGuard 
            allowedRoles={['admin', 'super_admin']}
            requiredPermissions={['manage_roles']}
          >
            <RoleManagement />
          </AuthGuard>
        } />
        <Route path="/admin/permissions" element={
          <AuthGuard 
            allowedRoles={['admin', 'super_admin']}
            requiredPermissions={['manage_permissions']}
          >
            <UserPermissions />
          </AuthGuard>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
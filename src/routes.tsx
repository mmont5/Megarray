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
      <Route element={<AuthGuard><Layout /></AuthGuard>}>
        <Route path="/signup/role" element={<RoleSelection />} />
        <Route path="/signup/plan" element={<PlanSelection />} />
        <Route path="/signup/setup" element={<Setup />} />
        <Route path="/signup/complete" element={<Complete />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
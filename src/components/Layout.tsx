import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIAssistant from './AIAssistant';
import { useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  // Check if we're in a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Only show Navbar on non-dashboard routes */}
      {!isDashboardRoute && <Navbar />}
      
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Only show Footer on non-dashboard routes */}
      {!isDashboardRoute && <Footer />}
      
      <AIAssistant onAction={(action, params) => {
        console.log('AI Assistant Action:', action, params);
      }} />
    </div>
  );
};

export default Layout;
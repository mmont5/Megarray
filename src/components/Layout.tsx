import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import AIAssistant from './AIAssistant';

interface LayoutProps {
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ requireAuth = false }) => {
  const { loading } = useAuth();

  if (loading && requireAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AIAssistant onAction={(action, params) => {
        console.log('AI Assistant Action:', action, params);
      }} />
    </div>
  );
};

export default Layout;
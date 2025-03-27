import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Waitlist from './pages/Waitlist';
import RoleSelection from './pages/signup/RoleSelection';
import PlanSelection from './pages/signup/PlanSelection';
import Setup from './pages/signup/Setup';
import Complete from './pages/signup/Complete';
import AIAssistant from './components/AIAssistant';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const handleAssistantAction = (action: string, params: any) => {
    switch (action) {
      case 'schedule':
        console.log('Scheduling post:', params);
        break;
      default:
        console.log('Unknown action:', action, params);
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/signup" element={<RoleSelection />} />
            <Route path="/signup/plan" element={<PlanSelection />} />
            <Route path="/signup/setup" element={<Setup />} />
            <Route path="/signup/complete" element={<Complete />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <AIAssistant onAction={handleAssistantAction} />
      </div>
    </Router>
  );
}

export default App;
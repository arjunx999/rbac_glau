import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 pt-16 relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className={`flex-1 transition-all duration-500 p-8 overflow-y-auto ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

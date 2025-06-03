import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNavbar from './TopNavbar.jsx';

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-gradient-to-br bg-slate-700">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden p-1 pt-0">
        <TopNavbar toggleSidebar={toggleSidebar} />

        {/* Dynamic content based on route */}
        <main className="flex-1 mt-1 bg-gradient-to-br from-[#f6f9fc] to-[#e5edf5] min-h-screen overflow-y-auto transition-all ">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

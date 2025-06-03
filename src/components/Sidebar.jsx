import { Home, BarChart, Settings, FileText, X } from 'lucide-react'; // Import icons from lucide-react
import { Link, useLocation } from 'react-router-dom'; // For navigation links and current route detection

// Sidebar component accepts two props:
//  - isOpen: boolean controlling whether sidebar is visible (for mobile)
//  - onClose: function to call when closing sidebar (mobile only)
export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation(); // Get current route location to highlight active link

  // Function to compute the CSS classes for each nav link
  // Highlights the link if the current path matches the link's path
  const navLinkStyle = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      location.pathname === path
        ? 'bg-[#d1d9e6] shadow-inner text-indigo-700 font-semibold' // Active link styles
        : 'hover:shadow-md hover:bg-[#f1f3f6] text-gray-700'           // Inactive link styles with hover effect
    }`;

  return (
    // Sidebar container
    <aside
      className={`min-h-screen bg-gradient-to-br from-cyan-600 via-teal-400 border border-r-slate-500 w-64 p-6 fixed lg:relative z-30 transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}  // Slide in/out from left on mobile based on isOpen
        lg:translate-x-0 `}                              // Always visible on large screens (lg+)
    >
      {/* Mobile Close Button */}
      <div className="flex justify-between items-center lg:hidden mb-6">
        {/* App name/logo */}
        <h2 className="text-3xl font-extrabold text-indigo-700">FinanceBuddy</h2>
        {/* Close button only visible on mobile */}
        <button
          onClick={onClose}
          className="text-indigo-700 hover:text-red-500 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={26} />
        </button>
      </div>

      {/* Desktop Logo (hidden on mobile) */}
      <div className="hidden lg:block mb-8">
        <h2 className="text-3xl font-extrabold text-indigo-700">FinanceBuddy</h2>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col gap-4 text-md">
        {/* Dashboard link with home icon */}
        <Link to="/dashboard" className={navLinkStyle('/dashboard')}>
          <Home size={20} /> Dashboard
        </Link>

        {/* Transactions link with file-text icon */}
        <Link to="/transactions" className={navLinkStyle('/transactions')}>
          <FileText size={20} /> Transactions
        </Link>

        {/* Reports link with bar-chart icon */}
        <Link to="/reports" className={navLinkStyle('/reports')}>
          <BarChart size={20} /> Reports
        </Link>

        {/* You can add more links here as needed */}
      </nav>
    </aside>
  );
}

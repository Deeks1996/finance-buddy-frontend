import { useNavigate } from 'react-router-dom';          // For navigation after logout
import { Menu, Bell, User } from 'lucide-react';         // Icons from lucide-react library
import { useUser, useClerk } from '@clerk/clerk-react';  // Hooks for user info and auth from Clerk
import { FiPower } from 'react-icons/fi';                 // Logout icon

export default function TopNavbar({ toggleSidebar }) {
  const navigate = useNavigate();  // Hook to programmatically navigate
  const { user } = useUser();      // Get current authenticated user object from Clerk
  const { signOut } = useClerk();  // signOut function to log out the user

  // Function to handle user logout:
  // Calls Clerk's signOut then redirects to home page ('/')
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    // Navbar container with gradient background, padding,
    // flexbox layout with items centered and space between left and right sections
    <header className="bg-gradient-to-br from-cyan-600 via-teal-400 px-6 py-3 flex items-center justify-between">
      
      {/* Sidebar toggle button visible only on small (mobile) screens (hidden on lg and above) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-gray-300 hover:text-indigo-600 transition-all"
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />  {/* Hamburger menu icon */}
      </button>

      {/* Right side actions container */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Show user info and logout button only if user is authenticated */}
        {user && (
          <div className="flex items-center gap-4 bg-[#f1f3f6] px-4 py-2 rounded-full">
            
            {/* User icon and full name */}
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <User className="text-indigo-600" size={18} />
              <span>{user.fullName}</span>
            </div>

            {/* Logout button with power icon */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-500 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <FiPower size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

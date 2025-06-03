// Import necessary components and functions from React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import individual pages and components
import Signup from './Signup.jsx'; // User registration page
import Login from './Login.jsx'; // User login page
import LandingPage from './LandingPage.jsx'; // Public homepage
import PrivateRoute from './components/PrivateRoute.jsx'; // Wrapper for protected routes
import Dashboard from './pages/Dashboard.jsx'; // Dashboard view after login
import TransactionsPage from './pages/TransactionsPage.jsx'; // Page to manage/view transactions
import Layout from './components/Layout.jsx'; // Layout with shared UI elements (e.g., sidebar, navbar)
import ResetPassword from './ResetPassword.jsx'; // Password reset form
import Reports from './pages/Reports.jsx'; // Reports view for the user

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />          {/* Home/Landing Page */}
        <Route path="/signup" element={<Signup />} />          {/* Signup Page */}
        <Route path="/login" element={<Login />} />            {/* Login Page */}
        <Route path="/reset-password" element={<ResetPassword />} /> {/* Password Reset Page */}

        {/* Protected Routes: accessible only to authenticated users */}
        <Route
          element={
            <PrivateRoute> {/* Wrap routes in auth guard */}
              <Layout />    {/* Layout for dashboard and internal pages */}
            </PrivateRoute>
          }
        >
          {/* Nested protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />        {/* User Dashboard */}
          <Route path="/transactions" element={<TransactionsPage />} /> {/* Transactions Page */}
          <Route path="/reports" element={<Reports />} />            {/* Reports Page */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

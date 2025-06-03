// Import authentication and user state hooks from Clerk
import { useSignIn, useUser } from '@clerk/clerk-react';
// Import React hooks for state and side-effects
import { useEffect, useState } from 'react';
// Import navigation and routing helpers
import { useNavigate, Link } from 'react-router-dom';
// Import animation utility from Framer Motion
import { motion } from 'framer-motion';
// Import toast notifications
import toast, { Toaster } from 'react-hot-toast';
// Import password visibility icons
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function Login() {
  // Clerk hook to manage sign-in
  const { signIn, isLoaded } = useSignIn();
  // Clerk hook to check if the user is already signed in
  const { isSignedIn } = useUser();
  // React Router navigation hook
  const navigate = useNavigate();

  // State variables for form inputs and password visibility toggle
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isSignedIn) {
      window.location.href = '/dashboard';
    }
  }, [isSignedIn, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if Clerk sign-in is ready
    if (!isLoaded) {
      toast.error('Sign-in not ready yet');
      return;
    }

    try {
      // Attempt sign-in using email and password
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in is complete, redirect to dashboard
      if (signInAttempt.status === 'complete') {
        toast.success('Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        // If 2FA or other verification is needed
        toast.error('Additional verification required');
      }
    } catch (error) {
      // Show error from Clerk or generic fallback
      toast.error(error.errors?.[0]?.message || 'Login failed');
      console.error('Login error:', error);
    }
  };

  return (
    <>
      {/* Toaster for showing login success/failure messages */}
      <Toaster position="top-center" />

      {/* Main container with gradient background */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 via-teal-500 to-cyan-700 px-6 relative overflow-hidden">
        
        {/* Animated login form container */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative z-10 bg-gray-900 bg-opacity-90 backdrop-blur-lg border border-gray-700 max-w-md w-full rounded-3xl shadow-2xl p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Heading and subtitle */}
          <h2 className="text-4xl font-extrabold mb-2 text-gray-200 text-center">Welcome Back</h2>
          <p className="text-gray-400 mb-8 text-center">Login to your Finance Buddy account</p>

          {/* Email input with floating label */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="email"
              name="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent focus:bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
              autoComplete="off"
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                         peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                         peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-teal-400"
            >
              Email
            </label>
          </div>

          {/* Password input with show/hide toggle */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer"
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                         peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                         peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-teal-400"
            >
              Password
            </label>

            {/* Toggle password visibility icon */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-3 text-gray-400 hover:text-teal-400"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 shadow-lg hover:shadow-teal-700 text-white font-semibold py-3 rounded-full transition-transform transform hover:scale-105"
          >
            Login
          </button>

          {/* Forgot password link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="text-sm text-teal-400 hover:text-teal-600 focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-4 text-center text-gray-200">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-teal-400 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </motion.form>
      </div>
    </>
  );
}

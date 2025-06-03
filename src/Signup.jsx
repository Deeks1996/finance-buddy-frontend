import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';

export default function Signup() {
  // Hook to programmatically navigate after signup success
  const navigate = useNavigate();

  // State variables for user input fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to toggle visibility of password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for password strength and password matching status
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // State to hold validation error messages for full name and email
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
  });

  // Effect to check password strength on password change
  useEffect(() => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    let strength = 0;
    // Check password length >= 8
    if (password.length >= 8) strength++;
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength++;
    // Check for digits
    if (/[0-9]/.test(password)) strength++;
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Determine strength label based on number of criteria met
    switch (strength) {
      case 0:
      case 1:
        setPasswordStrength('Weak');
        break;
      case 2:
        setPasswordStrength('Moderate');
        break;
      case 3:
      case 4:
        setPasswordStrength('Strong');
        break;
      default:
        setPasswordStrength('');
    }
  }, [password]);

  // Effect to check if password and confirm password match
  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true); // Don't show mismatch error if confirm password is empty
    }
  }, [password, confirmPassword]);

  // Validate full name: required, letters and spaces only, minimum length 2
  const validateFullName = (name) => {
    if (!name.trim()) return 'Full Name is required';
    if (!/^[A-Za-z\s]+$/.test(name)) return 'Only letters and spaces allowed';
    if (name.trim().length < 2) return 'Full Name must be at least 2 characters';
    return '';
  };

  // Validate email with basic regex and required check
  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before sending request
    const nameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    setErrors({ fullName: nameError, email: emailError });

    // Stop submission if validation errors exist
    if (nameError || emailError) return;

    // Stop submission if passwords don't match
    if (!passwordsMatch) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      // Send signup data to backend API
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      // Parse JSON response
      const data = await res.json();

      if (res.ok) {
        // On success, show success toast and redirect to login after 2 seconds
        toast.success('Signup successful!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Show error message from backend or default message
        toast.error('Signup failed');
      }
    } catch (error) {
      // Catch network or unexpected errors
      toast.error('Something went wrong. Try again.');
    }
  };

  // Map password strength labels to Tailwind CSS background colors
  const strengthColor = {
    Weak: 'bg-red-500',
    Moderate: 'bg-yellow-400',
    Strong: 'bg-green-500',
  };

  return (
    <>
      {/* Toaster container for toast notifications */}
      <Toaster position="top-center" />

      {/* Main container with background gradient and animated circles */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 via-teal-500 to-cyan-700 px-6 relative overflow-hidden">
        
        {/* Decorative blurred animated circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Form container with framer-motion animations */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative z-10 bg-gray-900 bg-opacity-90 backdrop-blur-lg border border-gray-700 max-w-md w-full rounded-3xl shadow-2xl p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* User icon above the form title */}
          <div className="flex justify-center mb-4">
            <FaUserCircle size={60} className="text-teal-400" />
          </div>

          {/* Form title and subtitle */}
          <h2 className="text-4xl font-extrabold mb-2 text-gray-100 text-center tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-400 mb-8 text-center">
            Sign up for Finance Buddy
          </p>

          {/* Full Name input field with floating label */}
          <div className="relative z-0 w-full mb-4 group">
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder=" "
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() =>
                setErrors({ ...errors, fullName: validateFullName(fullName) })
              }
              className={`block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 autofill:bg-transparent ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-teal-400'
              } peer`}
              required
              autoComplete="off"
            />
            <label
              htmlFor="fullName"
              className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-teal-400"
            >
              Full Name
            </label>
            {/* Display validation error if any */}
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email input field with floating label */}
          <div className="relative z-0 w-full mb-4 group">
            <input
              type="email"
              name="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setErrors({ ...errors, email: validateEmail(email) })}
              className={`block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-600 focus:border-teal-400'
              } peer`}
              required
              autoComplete="off"
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-teal-400"
            >
              Email Address
            </label>
            {/* Display validation error if any */}
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password input field with toggle visibility button */}
          <div className="relative z-0 w-full mb-4 group">
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    id="password"
    placeholder=" "
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="block py-2.5 pr-10 pl-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-600 focus:border-teal-400 appearance-none focus:outline-none focus:ring-0 peer"
    required
  />
  <label
    htmlFor="password"
    className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
              peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-teal-400"
  >
    Password
  </label>

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 top-2 text-gray-400 hover:text-teal-400"
    tabIndex={-1}
  >
    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
  </button>

  {password && (
    <div className="mt-2 flex items-center space-x-3">
      <div
        className={`h-2 w-24 rounded-full ${strengthColor[passwordStrength]}`}
        title={`Password strength: ${passwordStrength}`}
      />
      <span className={`text-sm font-medium ${
        passwordStrength === 'Weak' ? 'text-red-500' :
        passwordStrength === 'Moderate' ? 'text-yellow-400' :
        'text-green-500'
      }`}>
        {passwordStrength}
      </span>
    </div>
  )}
</div>


          {/* Confirm Password input with visibility toggle and mismatch warning */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              id="confirmPassword"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`block py-2.5 px-0 w-full text-sm ${
                passwordsMatch ? 'text-gray-100' : 'text-red-400'
              } bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer`}
              required
            />
            <label
              htmlFor="confirmPassword"
              className={`absolute text-sm ${
                passwordsMatch ? 'text-gray-400' : 'text-red-400'
              } duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                        peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-teal-400`}
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-2/4 transform -translate-y-2/4 p-2 text-gray-400 hover:text-teal-400"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <AiFillEye size={20} />
              )}
            </button>

            {/* Show error if passwords don't match */}
            {!passwordsMatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 transition rounded-full py-3 text-white font-bold text-lg"
          >
            Create Account
          </button>

          {/* Link to login page */}
          <p className="text-gray-400 mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-teal-400 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
            >
              Login
            </Link>
          </p>
        </motion.form>
      </div>
    </>
  );
}

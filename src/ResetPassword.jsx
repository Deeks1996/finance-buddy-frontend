import { useSignIn, useClerk } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPassword() {
  const { signIn, isLoaded } = useSignIn();
  const clerk = useClerk();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!isLoaded) {
      toast.error('Clerk not ready yet');
      return;
    }

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await signIn.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });
      toast.success('Reset code sent! Check your email');
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error(err.errors?.[0]?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isLoaded) {
      toast.error('Clerk not ready yet');
      return;
    }

    if (!code || !newPassword) {
      toast.error('Enter the reset code and new password');
      return;
    }

    try {
      setLoading(true);

      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        // Use clerk instance to set active session
        await clerk.setActive({ session: result.createdSessionId });

        toast.success('Password reset successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.error('Reset not completed. Try again.');
        console.warn('Unexpected result:', result);
      }
    } catch (err) {
      console.error('Password reset error:', err);

      const message = err.errors?.[0]?.message;
      if (message?.includes('data breach')) {
        toast.error('That password is insecure. Try a stronger one.');
      } else if (message?.includes('session already exists')) {
        toast.success('Already signed in. Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.error(message || 'Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 via-teal-500 to-cyan-700 px-6">
      <Toaster position="top-center" />
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-100 mb-6 text-center">
          Reset Your Password
        </h2>

        {step === 1 && (
          <>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-full"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-gray-400 text-sm mb-2">Reset Code</label>
            <input
              type="text"
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code from your email"
            />

            <label className="block text-gray-400 text-sm mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-2 mb-6 rounded bg-gray-800 text-white border border-gray-600"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-full"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

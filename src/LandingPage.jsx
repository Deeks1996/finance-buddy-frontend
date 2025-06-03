import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const transitionProps = {
  duration: 0.9,
  ease: [0.25, 0.1, 0.25, 1] // cubic-bezier for smoother motion
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-500 via-teal-400 to-cyan-600 text-white flex items-center justify-center px-6 md:px-20 py-16">

      {/* --- Background Glow Effects --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[300px] h-[300px] bg-cyan-300 opacity-20 rounded-full blur-[120px] top-[-100px] left-[-100px]" />
        <div className="absolute w-[280px] h-[280px] bg-teal-300 opacity-20 rounded-full blur-[100px] bottom-[-80px] right-[-100px]" />
      </div>

      {/* --- Content Wrapper --- */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl">

        {/* --- Text Content --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitionProps}
          className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left"
        >
          <h2 className="text-sm uppercase tracking-widest text-teal-100 font-medium mb-2">Welcome to</h2>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-md">
            Finance <span className="text-teal-200">Buddy</span>
          </h1>
          <p className="text-lg md:text-xl text-cyan-100 mt-4 md:mt-6 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
            Track your spending, plan your savings, and take full control of your money.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionProps, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-teal-600 px-6 py-3 rounded-full font-semibold text-base shadow-md hover:bg-gray-100 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-transparent text-white px-6 py-3 rounded-full font-semibold text-base border border-white shadow-md hover:bg-white hover:text-teal-600 transition-all"
            >
              Sign Up
            </button>
          </motion.div>
        </motion.div>

        {/* --- Image Content (Hidden on Mobile) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transitionProps, delay: 0.4 }}
          className="hidden md:block w-full md:w-1/2"
        >
          <div className="relative bg-white/10 border border-white/10 rounded-3xl p-4 shadow-2xl backdrop-blur-lg w-full max-w-[480px] mx-auto">
            <img
              src="/finance-illustration.jpg"
              alt="Finance App"
              className="rounded-2xl w-full h-[450px] object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* --- Animated Waves --- */}
      <div className="absolute bottom-0 left-0 w-full z-0 overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-full h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.74,22,98.44,29,148,17.84C255.73,44.13,317.24-10.37,381,4.16c87.35,19.15,172,97.69,258,91.38,65.35-4.94,127.49-59,190-76.89C899.52,5.23,961.66,16.94,1025,30.19c56.92,11.88,112.45,27.69,175,29.87V0Z"
            opacity=".2"
            fill="#ffffff"
          />
          <path
            d="M0,0V15.81C47.42,36,103.19,58.8,161,63.24c71.59,5.52,136.7-31.9,207-46.47C438.35-1.61,512.86,2.82,583,24.91c68.35,21.57,133.59,59.3,204,55.4,59.88-3.41,113.8-39.33,172-57.18,66.5-20.59,136.36-19.24,203,1.52V0Z"
            opacity=".5"
            fill="#ffffff"
          />
          <path
            d="M0,0V5.63C54.64,30.21,119.53,56,181,49.84c63.76-6.37,119.14-47.71,182-53.16,60.51-5.23,120.89,22.9,181,42.66C623.41,65.46,684.77,72.44,743,60.14c60.35-12.64,113.72-45.7,174-54.68,52.55-7.63,108.49,1.25,159,19.32V0Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </div>
  );
};

export default LandingPage;

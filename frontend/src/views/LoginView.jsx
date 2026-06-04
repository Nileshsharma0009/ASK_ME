// frontend/src/views/LoginView.jsx
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdShield } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { env } from '../config/env';

export default function LoginView() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 1. .env se base URL uthaya (e.g., http://localhost:4000/api)
      const baseUrl = import.meta.env.VITE_BACKEND_URL; 
      
      // 2. Direct full dynamic URL par POST request bhej di
     const { data } = await api.post(`${baseUrl}/auth/login`, {
  email: username,
  password,
});

      
      auth.login(data.user, data.token, { persist: rememberMe });
      if (env.postLoginPath) {
        navigate(env.postLoginPath, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 16 },
    },
  };

  return (
    <div className="min-h-screen relative bg-indigo-50 flex items-center justify-center p-4 antialiased overflow-hidden">
      
      {/* Soft Clinical Violet Background Ambient Orbs */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-violet-400/20 blur-[100px] pointer-events-none" />

      {/* Aesthetic Plus Healthcare Vectors */}
      <div className="absolute top-[15%] left-[10%] text-primary/15 font-light text-7xl select-none hidden md:block">+</div>
      <div className="absolute top-[40%] right-[8%] text-primary/10 font-light text-8xl select-none hidden md:block">+</div>
      <div className="absolute bottom-[20%] left-[7%] text-primary/15 font-light text-6xl select-none hidden md:block">+</div>

      {/* Decorative Mock-up Hospital Vector Substrate Illustration */}
      <div className="absolute top-[4%] inset-x-0 flex justify-center opacity-[0.07] pointer-events-none">
        <svg width="280" height="140" viewBox="0 0 300 150" className="text-primary">
          <rect x="70" y="20" width="160" height="130" fill="currentColor" rx="8" />
          <rect x="90" y="40" width="25" height="25" fill="white" rx="3" />
          <rect x="135" y="40" width="25" height="25" fill="white" rx="3" />
          <rect x="180" y="40" width="25" height="25" fill="white" rx="3" />
          <rect x="90" y="85" width="25" height="25" fill="white" rx="3" />
          <rect x="135" y="85" width="25" height="25" fill="white" rx="3" />
          <rect x="180" y="85" width="25" height="25" fill="white" rx="3" />
        </svg>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[440px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Centered Floating Location Badge */}
        <motion.div className="mb-5 flex justify-center" variants={itemVariants}>
          <div className="bg-primary px-7 py-2 rounded-xl text-white text-sm font-bold tracking-wide shadow-md">
            Login Page
          </div>
        </motion.div>

        {/* Clean White Clinical Interface Card Base */}
        <div className="bg-card-bg rounded-modal p-8 border border-border-default/80 shadow-modal">
          
          {/* Brand Signature System Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <motion.div
                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-card"
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative flex items-center justify-center">
                  <MdShield className="w-11 h-11 text-primary" />
                  <span className="absolute text-white font-bold text-base pb-0.5">+</span>
                </div>
              </motion.div>
            </div>
            <h1 className="text-3xl font-extrabold text-heading tracking-tight mb-1">
              ASK<span className="text-primary">_ME</span>
            </h1>
            <p className="text-xs font-semibold tracking-wide text-secondary/90">
              AI Assistant for Healthcare
            </p>
          </div>

          {/* Operational Greeting Labels */}
          <motion.h2 className="text-2xl font-bold text-heading text-center mb-1" variants={itemVariants}>
            Welcome Back!
          </motion.h2>
          <motion.p className="text-center text-secondary text-sm mb-7" variants={itemVariants}>
            Sign in to continue to ASK_ME
          </motion.p>

          {/* Error Message Container */}
          {error && (
            <motion.div
              className="mb-5 p-3.5 bg-error/10 border border-error/20 text-error rounded-input text-xs font-semibold flex items-center gap-2"
              variants={itemVariants}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
              {error}
            </motion.div>
          )}

          {/* Core Access Input Forms */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Identity Field Wrapper */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-heading mb-1.5">
                Username
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-3.5 text-secondary/70 group-focus-within:text-primary transition-colors duration-150 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-border-default rounded-input text-sm text-body placeholder-placeholder/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-150 font-medium shadow-sm"
                />
              </div>
            </motion.div>

            {/* Cryptographic Access Password Field Wrapper */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-heading mb-1.5">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-3.5 text-secondary/70 group-focus-within:text-primary transition-colors duration-150 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 bg-white border border-border-default rounded-input text-sm text-body placeholder-placeholder/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-150 font-medium tracking-wide shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-secondary/60 hover:text-primary transition-colors duration-150 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me Configuration Row */}
            <motion.div className="flex items-center justify-between pt-1" variants={itemVariants}>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border-default text-primary focus:ring-primary/10 focus:ring-offset-0 cursor-pointer accent-primary"
                />
                <span className="text-sm text-body font-semibold">Remember me</span>
              </label>
              <Link to="#" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors duration-150">
                Forgot password?
              </Link>
            </motion.div>

            {/* Action Executive Trigger Execution Button */}
            <motion.button
              type="submit"
              disabled={loading}
              variants={itemVariants}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-button shadow-card hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-base mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </form>

          {/* Micro-Structuring Separator Core Element */}
          <motion.div className="my-5 flex items-center gap-3" variants={itemVariants}>
            <div className="flex-1 h-px bg-border-default" />
            <span className="text-xs uppercase font-bold tracking-widest text-secondary/60">or</span>
            <div className="flex-1 h-px bg-border-default" />
          </motion.div>

          {/* Onboarding Alternate Paths Core Link */}
          <motion.p className="text-center text-sm text-body font-medium" variants={itemVariants}>
            Don&apos;t have an account?{' '}
            <Link
              to={env.routes.register}
              className="text-primary hover:text-primary-dark font-bold transition-colors duration-150 ml-0.5"
            >
              Create one
            </Link>
          </motion.p>
        </div>

        {/* Security Trust Profile Compliance Infrastructure Footnote */}
        <motion.div
          className="mt-5 bg-slate-100/60 border border-border-default/40 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center gap-1 shadow-sm"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center space-x-2 text-primary">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
              <MdShield className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-heading">Secure & Confidential</span>
          </div>
          <p className="text-xs text-secondary font-medium leading-relaxed max-w-xs">
            Your data is encrypted and safe with us.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
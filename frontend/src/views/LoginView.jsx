// frontend/src/views/LoginView.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdShield } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password,
      });
      if (rememberMe) localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 antialiased overflow-hidden">
      
      {/* Designer Background Fluid Ambient Light Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Subtle Digital Grid Substrate Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hospital Structural Aesthetic Element Integrated Subtly */}
      {/* <div className="absolute top-12 right-12 opacity-[0.03] text-white hidden md:block pointer-events-none">
        <svg width="240" height="240" viewBox="0 0 300 300">
          <rect x="50" y="80" width="200" height="150" fill="currentColor" />
          <rect x="70" y="100" width="30" height="30" fill="black" />
          <rect x="110" y="100" width="30" height="30" fill="black" />
          <rect x="150" y="100" width="30" height="30" fill="black" />
          <rect x="190" y="100" width="30" height="30" fill="black" />
          <rect x="70" y="150" width="30" height="30" fill="black" />
          <rect x="110" y="150" width="30" height="30" fill="black" />
          <rect x="150" y="150" width="30" height="30" fill="black" />
          <rect x="190" y="150" width="30" height="30" fill="black" />
        </svg>
      </div> */}

      {/* Card Wrapper */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Floating View Category Badge */}
        <motion.div className="mb-6 flex justify-center" variants={itemVariants}>
          <div className="bg-slate-800/60 backdrop-blur-md px-4 py-1.5 rounded-full text-slate-300 text-xs font-semibold tracking-wide border border-slate-700/50 shadow-inner">
            Login Page
          </div>
        </motion.div>

        {/* Core Glassmorphism Interface Container Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-800/80 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)]">
          
          {/* Main Context Branding Signature Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/20"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <MdShield className="w-7 h-7 text-white" />
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              ASK<span className="text-indigo-400 font-light">_ME</span>
            </h1>
            <p className="text-xs font-medium tracking-wider uppercase text-slate-500">AI Assistant for Healthcare</p>
          </div>

          {/* Core Greeting Presentation Section */}
          <motion.h2 className="text-xl font-bold text-white text-center mb-1" variants={itemVariants}>
            Welcome Back!
          </motion.h2>
          <motion.p className="text-center text-slate-400 text-xs mb-8" variants={itemVariants}>
            Sign in to continue to ASK_ME
          </motion.p>

          {/* System Warnings / Operational Error Messages */}
          {error && (
            <motion.div
              className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium flex items-center gap-2.5"
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </motion.div>
          )}

          {/* Interactive Form Field Pipeline */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Identity Username Block Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 font-medium"
                />
              </div>
            </motion.div>

            {/* Access Security Password Block Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 font-medium tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Persistence & Account Recovery Control Row */}
            <motion.div className="flex items-center justify-between pt-1" variants={itemVariants}>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500/20 focus:ring-offset-0 cursor-pointer accent-indigo-500"
                />
                <span className="text-xs text-slate-400 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors duration-200">
                Forgot password?
              </a>
            </motion.div>

            {/* Action Executive Execution Submission Button */}
            <motion.button
              type="submit"
              disabled={loading}
              variants={itemVariants}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-950/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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

          {/* Structural Design Anchor Divider Separator */}
          <motion.div className="my-6 flex items-center gap-3" variants={itemVariants}>
            <div className="flex-1 h-px bg-slate-800/60" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">or</span>
            <div className="flex-1 h-px bg-slate-800/60" />
          </motion.div>

          {/* Application Onboarding Route Configuration Link */}
          <motion.p className="text-center text-xs text-slate-400" variants={itemVariants}>
            Don't have an account?{' '}
            <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-150 ml-0.5">
              Create one
            </a>
          </motion.p>
        </div>

        {/* Security Attributions Compliance Infrastructure Footer */}
        <motion.div className="mt-6 text-center space-y-1.5 opacity-40" variants={itemVariants}>
          <div className="flex items-center justify-center space-x-1.5 text-slate-400">
            <MdShield className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wide">Secure & Confidential</span>
          </div>
          <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
            Your data is encrypted and safe with us. All connection logs auto-expire under network resource parameters.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
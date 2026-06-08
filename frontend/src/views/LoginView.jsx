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

  //   const handleLogin = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);
  //     setError('');

  //     const cleanEmail = username.trim();

  //     /* ==========================================================================
  //        STRICT SECURITY CHECK: COMPLIANCE INPUT VALIDATION ENGINE
  //        ========================================================================== */
  //     if (cleanEmail.length >= 30) {
  //       setError('Username/Email must be less than 30 characters');
  //       setLoading(false);
  //       return;
  //     }

  //     if (password.length >= 12) {
  //       setError('Password must be less than 12 characters');
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       /* ==========================================================================
  //          CRITICAL HANDSHAKE: FLUSH OLD SESSION ON CLEAN AUTHENTICATION
  //          Explicitly purges any saved session keys BEFORE logging in new user profile.
  //          ========================================================================== */
  //       sessionStorage.removeItem('VANI_session_compliance_viewed');

  //       const baseUrl = import.meta.env.VITE_BACKEND_URL; 

  //       console.log("Backend URL:", baseUrl);
  // console.log("Login URL:", `${baseUrl}/auth/login`);

  //       const { data } = await api.post(`${baseUrl}/auth/login`, {
  //         email: cleanEmail,
  //         password,
  //       });

  //       auth.login(data.user, data.token, { persist: rememberMe });
  //       if (env.postLoginPath) {
  //         navigate(env.postLoginPath, { replace: true });
  //       }
  //     } catch (err) {
  //       setError(err.response?.data?.message || 'Login failed');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      sessionStorage.removeItem('VANI_session_compliance_viewed');

      // CORRECT: Use relative path. 
      // Axios will automatically use the baseURL defined in api.js
      const { data } = await api.post("/auth/login", {
        email: username.trim(),
        password: password,
      });

      auth.login(data.user, data.token, { persist: rememberMe });
      if (env.postLoginPath) {
        navigate(env.postLoginPath, { replace: true });
      }
    } catch (err) {
      // This logs exactly what the backend rejected
      console.error("Full Error:", err.response?.data);
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
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        onMouseMove={(e) => {
          const { currentTarget, clientX, clientY } = e;
          const { left, top, width, height } = currentTarget.getBoundingClientRect();
          const x = (clientX - left - width / 2) / (width / 2);
          const y = (clientY - top - height / 2) / (height / 2);
          currentTarget.style.setProperty('--mouse-x', `${x * 12}px`);
          currentTarget.style.setProperty('--mouse-y', `${y * 12}px`);
        }}
        style={{ '--mouse-x': '0px', '--mouse-y': '0px', pointerEvents: 'auto' }}
      >
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(6, 182, 212, 0.16) 1.5px, transparent 1.5px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.16) 1.5px, transparent 1.5px)
            `,
            backgroundSize: '30px 30px',
            transform: 'translate(var(--mouse-x), var(--mouse-y)) scale(1.02)',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)'
          }}
        />
        <div className="absolute w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[120px] transition-all duration-500 ease-out mix-blend-screen" style={{ left: 'calc(50% - 200px)', top: 'calc(50% - 200px)', transform: 'translate(calc(var(--mouse-x) * 2.5), calc(var(--mouse-y) * 2.5))' }} />
      </div>

      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-violet-400/20 blur-[100px] pointer-events-none -z-10" />

      <motion.div className="relative z-10 w-full max-w-[440px]" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="mb-5 flex justify-center" variants={itemVariants}>
          <div className="bg-primary px-7 py-2 rounded-xl text-white text-sm font-bold tracking-wide shadow-md">Login page</div>
        </motion.div>

        <div className="bg-card-bg rounded-modal p-8 border border-border-default/80 shadow-modal">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <motion.div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-2 border-primary/20 shadow-card overflow-hidden" whileHover={{ scale: 1.03 }}>
                <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white">
                  <img src="/logo2.png" alt="Hospital Logo" className="w-full h-full object-contain" />
                </div>
              </motion.div>
            </div>
            <h1 className="text-3xl font-extrabold text-heading tracking-tight mb-1">VA<span className="text-primary">NI</span></h1>
            <p className="text-xs font-semibold tracking-wide text-secondary/90">AI Assistant for Healthcare</p>
          </div>

          {error && (
            <motion.div className="mb-5 p-3.5 bg-error/10 border border-error/20 text-error rounded-input text-xs font-semibold flex items-center gap-2" variants={itemVariants} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-heading mb-1.5">Username/Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-3.5 text-secondary/70 group-focus-within:text-primary transition-colors duration-150 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-border-default rounded-input text-sm text-body placeholder-placeholder/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-150 font-medium shadow-sm"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-heading mb-1.5">Password</label>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-secondary/60 hover:text-primary transition-colors duration-150 focus:outline-none" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-border-default text-primary focus:ring-primary/10 focus:ring-offset-0 cursor-pointer accent-primary" />
                <span className="text-sm text-body font-semibold">Remember me</span>
              </label>
              <Link to="#" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors duration-150">Forgot password?</Link>
            </div>

            <motion.button type="submit" disabled={loading} variants={itemVariants} whileTap={{ scale: 0.99 }} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-button shadow-card hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-base mt-6">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  <span>Signing in...</span>
                </div>
              ) : <span>Sign In</span>}
            </motion.button>
          </form>

          <motion.div className="my-5 flex items-center gap-3" variants={itemVariants}>
            <div className="flex-1 h-px bg-border-default" />
            <span className="text-xs uppercase font-bold tracking-widest text-secondary/60">or</span>
            <div className="flex-1 h-px bg-border-default" />
          </motion.div>

          <motion.p className="text-center text-sm text-body font-medium" variants={itemVariants}>
            Don&apos;t have an account? <Link to={env.routes.register} className="text-primary hover:text-primary-dark font-bold transition-colors duration-150 ml-0.5">Create one</Link>
          </motion.p>
        </div>

        <motion.div className="mt-5 bg-slate-100/60 border border-border-default/40 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center gap-1 shadow-sm" variants={itemVariants}>
          <div className="flex items-center justify-center space-x-2 text-primary">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center"><MdShield className="w-4 h-4 text-primary" /></div>
            <span className="text-sm font-bold text-heading">Secure & Confidential</span>
          </div>
          <p className="text-xs text-secondary font-medium leading-relaxed max-w-xs">Your data is encrypted and safe with us.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
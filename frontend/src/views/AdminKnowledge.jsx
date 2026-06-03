import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdShield } from 'react-icons/md';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function RegisterView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-muted to-primary-dark relative overflow-hidden flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full opacity-5 blur-3xl"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"
        animate={{
          y: [0, -30, 0],
          x: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Card Container */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Label Badge */}
        <motion.div
          className="mb-6 flex justify-center"
          variants={itemVariants}
        >
          <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-white border-opacity-20">
            Create Account
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-card-bg rounded-modal shadow-modal p-8"
          variants={itemVariants}
          whileHover={{ boxShadow: '0px 20px 50px rgba(108, 77, 255, 0.2)' }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo & Title */}
          <motion.div
            className="text-center mb-8"
            variants={itemVariants}
          >
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdShield className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold text-heading mb-1">
              ASK<span className="text-primary">_ME</span>
            </h1>
            <p className="text-sm text-secondary">AI Assistant for Healthcare</p>
          </motion.div>

          {/* Greeting */}
          <motion.h2
            className="text-2xl font-bold text-heading text-center mb-1"
            variants={itemVariants}
          >
            Join ASK_ME
          </motion.h2>
          <motion.p
            className="text-center text-secondary text-sm mb-8"
            variants={itemVariants}
          >
            Create your account to get started
          </motion.p>

          {/* Messages */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-error bg-opacity-10 border border-error rounded-input text-error text-sm"
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="mb-6 p-4 bg-success bg-opacity-10 border border-success rounded-input text-success text-sm"
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {success}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-heading mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-3.5 text-secondary w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-border-default rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition bg-app-bg"
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-heading mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-secondary w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-border-default rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition bg-app-bg"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-heading mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-secondary w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-border-default rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition bg-app-bg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-secondary hover:text-primary transition"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-heading mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-secondary w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-border-default rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition bg-app-bg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-secondary hover:text-primary transition"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Sign Up Button */}
            <motion.button
              type="submit"
              disabled={loading}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 rounded-button hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            className="my-6 flex items-center"
            variants={itemVariants}
          >
            <div className="flex-1 border-t border-border-default" />
            <span className="px-3 text-sm text-secondary">or</span>
            <div className="flex-1 border-t border-border-default" />
          </motion.div>

          {/* Login Link */}
          <motion.p
            className="text-center text-sm text-body"
            variants={itemVariants}
          >
            Already have an account?{' '}
            <a href="/" className="text-primary hover:text-primary-dark font-semibold transition">
              Sign in
            </a>
          </motion.p>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          className="mt-6 flex items-center justify-center space-x-2 text-white"
          variants={itemVariants}
        >
          <MdShield className="w-5 h-5" />
          <span className="text-sm">Secure & Confidential</span>
        </motion.div>
        <motion.p
          className="text-center text-white text-xs opacity-80 mt-1"
          variants={itemVariants}
        >
          Your data is encrypted and safe with us.
        </motion.p>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

export default function PlaceholderPanel({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card-bg rounded-card border border-border-default p-12 shadow-sm text-center max-w-xl mx-auto mt-12 flex flex-col items-center"
    >
      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm">
        <FiAlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-extrabold text-heading mb-2">{title}</h3>
      <p className="text-xs text-secondary font-medium leading-relaxed">{description}</p>
      {/* === BACKEND (later) === wire upload/history APIs here */}
    </motion.div>
  );
}

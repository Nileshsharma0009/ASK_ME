// frontend/src/components/ComplianceModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiXCircle, FiGlobe, FiCheck, FiLoader } from 'react-icons/fi';
import api from '../../services/api';

export default function ComplianceModal({ isOpen, onClose }) {
  // 1. Core State Managers
  const [currentLang, setCurrentLang] = useState('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [remindPreference, setRemindPreference] = useState('session');
  
  // Asynchronous API Config Registries
  const [backendConfig, setBackendConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // 2. Fetch and Reset Lifecycles
  useEffect(() => {
    if (!isOpen) {
      // Clear legacy visual selections on close to keep next mounts clean
      setIsLangMenuOpen(false);
      return;
    }
    
    const fetchComplianceConfig = async () => {
      try {
        setLoadingConfig(true);
        const { data } = await api.get('/system/compliance-config');
        setBackendConfig(data);
      } catch (err) {
        console.error("Failed to load clinical compliance properties:", err);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchComplianceConfig();
  }, [isOpen]);

  // Resolve data points dynamically from the backend state array
  const languagesList = backendConfig?.languagesList || [];
  const text = backendConfig?.contentLedger?.[currentLang];
  const activeLangNative = languagesList.find(l => l.code === currentLang)?.native;

  const handleAcceptAndClose = () => {
    if (remindPreference === 'never') {
      localStorage.setItem('ask_me_dismiss_compliance', 'true');
      sessionStorage.removeItem('ask_me_session_compliance_viewed');
    } else {
      localStorage.removeItem('ask_me_dismiss_compliance');
      sessionStorage.setItem('ask_me_session_compliance_viewed', 'true');
    }
    onClose();
  };

  // 3. Animation Presets
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 260, damping: 26, staggerChildren: 0.04 } 
    },
    exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.18 } }
  };

  const contentBlockVariants = {
    hidden: { opacity: 0, x: -6 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 22 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 perspective-[1000px]">
          
          {/* BACKGROUND BLUR OVERLAY */}
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleAcceptAndClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-lg"
          />

          {/* WINDOW COMPONENT INTERFACE SHEET */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white border border-border-default/90 w-full max-w-2xl rounded-[32px] shadow-modal shadow-primary/5 relative z-10 overflow-hidden flex flex-col min-h-[320px] max-h-[85vh] transform-gpu selection:bg-primary/20"
          >
            {loadingConfig ? (
              /* LOADING SKELETON LAYER */
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-secondary">
                <FiLoader className="w-8 h-8 text-primary animate-spin" />
                <span className="text-xs font-bold tracking-wide font-sans">Syncing Security Matrix Parameters...</span>
              </div>
            ) : !text ? (
              /* ERROR BOUNDARY ENVELOPE */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-error">
                <FiAlertTriangle className="w-8 h-8 mb-2 animate-bounce" />
                <span className="text-sm font-black font-sans">Configuration Sync Error Encountered.</span>
              </div>
            ) : (
              /* NATIVE DATA CONSOLE CANVAS */
              <>
                {/* HEADER ELEMENT COMPARTMENT */}
                <div className="p-6 bg-gradient-to-r from-primary/5 via-transparent to-transparent border-b border-border-default flex items-center justify-between gap-4 shrink-0 relative z-20">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-primary text-white rounded-2xl flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                      <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-heading tracking-tight mb-1 font-sans">{text.title}</h2>
                      <p className="text-xs font-bold text-secondary/80 tracking-wide font-sans">{text.subtitle}</p>
                    </div>
                  </div>

                  {/* SELECT DROP-DOWN ELEMENT TRIGGER */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      className="flex items-center gap-2 bg-indigo-50/60 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-xs font-black text-primary border border-border-default select-none shadow-sm cursor-pointer font-sans"
                    >
                      <FiGlobe className="w-4 h-4 text-primary animate-[spin_20s_linear_infinite]" />
                      <span>{activeLangNative}</span>
                    </motion.button>

                    <AnimatePresence>
                      {isLangMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          className="absolute right-0 mt-2 w-44 bg-white border border-border-default rounded-2xl shadow-xl p-1.5 z-50 overflow-hidden"
                        >
                          {languagesList.map((lang) => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => {
                                setCurrentLang(lang.code);
                                setIsLangMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-black rounded-xl text-left transition-all cursor-pointer font-sans ${
                                currentLang === lang.code ? 'bg-primary/10 text-primary' : 'text-body hover:bg-slate-50'
                              }`}
                            >
                              <span>{lang.native}</span>
                              {currentLang === lang.code && <FiCheck className="w-4 h-4 text-primary stroke-[3]" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* SCROLLABLE INTERIOR SUBSTRATE SHEET */}
                <div className="p-6 overflow-y-auto space-y-6 text-sm text-body font-medium leading-relaxed bg-white custom-scrollbar">
                  <motion.div variants={contentBlockVariants} className="space-y-1.5 group">
                    <div className="flex items-center gap-2.5 text-heading font-black text-xs uppercase tracking-widest font-sans">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/40" />
                      <span>{text.purposeTitle}</span>
                    </div>
                    <p className="text-[13px] leading-7 text-body pl-4 border-l-2 border-slate-100 group-hover:border-emerald-400 transition-colors duration-300">{text.purposeDesc}</p>
                  </motion.div>

                  <motion.div variants={contentBlockVariants} className="bg-indigo-50/30 border border-border-default p-5 rounded-[24px] space-y-3 relative overflow-hidden">
                    <div className="flex items-center gap-2 text-heading font-black text-xs uppercase tracking-widest font-sans">
                      <span className="text-primary font-black text-sm">⚡</span>
                      <span>{text.powersTitle}</span>
                    </div>
                    <ul className="space-y-2 text-[13px]">
                      {[text.power1, text.power2, text.power3].map((power, i) => (
                        <li key={i} className="flex items-start gap-2.5 leading-6 text-body">
                          <span className="text-primary font-bold shrink-0 select-none">✓</span>
                          <span>{power}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div variants={contentBlockVariants} className="space-y-1.5 group">
                    <div className="flex items-center gap-2.5 text-heading font-black text-xs uppercase tracking-widest font-sans">
                      <div className="w-2 h-2 rounded-full bg-amber-500 shadow-md shadow-amber-500/40" />
                      <span>{text.limitTitle}</span>
                    </div>
                    <p className="text-[13px] leading-7 text-body pl-4 border-l-2 border-slate-100 group-hover:border-amber-400 transition-colors duration-300">{text.limitDesc}</p>
                  </motion.div>

                  <motion.div variants={contentBlockVariants} className="space-y-2 bg-rose-50 border border-rose-100 p-5 rounded-[24px] relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-rose-500" />
                    <div className="flex items-center gap-2 text-rose-700 font-black text-xs uppercase tracking-widest pl-1 font-sans">
                      <FiXCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{text.restrictTitle}</span>
                    </div>
                    <p className="text-[13px] text-rose-900/90 leading-7 pl-1 font-semibold">{text.restrictDesc}</p>
                  </motion.div>
                </div>

                {/* FOOTER CONTROLS BASE PANEL */}
                <div className="p-6 border-t border-border-default bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-5 shrink-0 relative z-20">
                  <div className="flex flex-col gap-2.5 w-full md:w-auto">
                    <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-bold text-secondary group">
                      <input type="radio" name="compliance-pref-sheet" checked={remindPreference === 'never'} onChange={() => setRemindPreference('never')} className="sr-only" />
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${remindPreference === 'never' ? 'border-primary bg-primary/10' : 'border-slate-300 bg-white'}`}>
                        {remindPreference === 'never' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="group-hover:text-heading transition-colors duration-100 font-semibold font-sans">{text.optNever}</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-bold text-secondary group">
                      <input type="radio" name="compliance-pref-sheet" checked={remindPreference === 'session'} onChange={() => setRemindPreference('session')} className="sr-only" />
                      <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${remindPreference === 'session' ? 'border-primary bg-primary/10' : 'border-slate-300 bg-white'}`}>
                        {remindPreference === 'session' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <span className="group-hover:text-heading transition-colors duration-100 font-semibold font-sans">{text.optSession}</span>
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, boxShadow: "0 8px 20px -6px rgba(6, 182, 212, 0.4)" }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={handleAcceptAndClose}
                    className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-extrabold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all duration-150 cursor-pointer text-center shrink-0 border border-white/10 font-sans"
                  >
                    {text.btnText}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
// frontend/src/views/SettingsView.jsx (Or inline inside ChatDashboard.jsx)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SettingsView() {
  // ─── STATE FIELDS INITIALIZATION ───
  // Note: Initial states are set to standard baseline metrics.
  // When integrating the backend, pull the logged-in staff configuration record here.
  const [themeSetting, setThemeSetting] = useState('Light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [responseStyle, setResponseStyle] = useState('Balanced');
  const [defaultSource, setDefaultSource] = useState('Hospital Database First');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.68);
  const [autoDeleteTimeline, setAutoDeleteTimeline] = useState('After 24 Hours');
  const [dataUsagePolicy, setDataUsagePolicy] = useState('Hospital Data Only');
  
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // ─── HOOK: BACKEND PROFILE METRICS FETCH ───
  useEffect(() => {
    /* =================================────────────────=========================
       === 📝 BACKEND INTEGRATION NOTE: FETCH OPERATIONAL PREFERENCES ===
       ==========================================================================
       const loadSystemPreferences = async () => {
         try {
           const response = await api.get('/auth/settings/me', {
             headers: { Authorization: `Bearer ${localStorage.getItem('kendra_token')}` }
           });
           const { settings } = response.data;
           
           // Dynamically hydrate your component state fields with database parameters:
           setThemeSetting(settings.theme || 'Light');
           setNotificationsEnabled(settings.notificationsEnabled ?? true);
           setResponseStyle(settings.responseStyle || 'Balanced');
           setDefaultSource(settings.defaultSource || 'Hospital Database First');
           setConfidenceThreshold(settings.confidenceThreshold || 0.68);
           setAutoDeleteTimeline(settings.autoDeleteTimeline || 'After 24 Hours');
           setDataUsagePolicy(settings.dataUsagePolicy || 'Hospital Data Only');
         } catch (err) {
           console.error("Failed to recover operational settings from MongoDB cluster:", err);
         }
       };

       loadSystemPreferences();
    ========================================================================== */
  }, []);

  // ─── TRANSACTION HANDLER: SAVE CHANGES ───
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSyncStatus('');

    try {
      /* =================================────────────────=========================
         === 📝 BACKEND INTEGRATION NOTE: DISPATCH MUTATION PAYLOAD TO MONGODB ===
         ==========================================================================
         const payload = {
           theme: themeSetting,
           notificationsEnabled,
           responseStyle,
           defaultSource,
           confidenceThreshold, // Pass the numeric value directly to your query engine middleware
           autoDeleteTimeline,  // Syncs your chat log schema TTL constraints
           dataUsagePolicy
         };

         await api.patch('/auth/settings/update', payload, {
           headers: { Authorization: `Bearer ${localStorage.getItem('kendra_token')}` }
         });
         
         // Sync local state configurations if required for structural layers
         localStorage.setItem('kendra_ui_theme', themeSetting);
         localStorage.setItem('kendra_rag_threshold', confidenceThreshold.toString());
      ========================================================================== */

      // Simulated local pipeline callback success state response
      setTimeout(() => {
        setIsSaving(false);
        setSyncStatus('Parameters pushed to database context lines successfully.');
        setTimeout(() => setSyncStatus(''), 3000);
      }, 800);

    } catch (err) {
      setIsSaving(false);
      setSyncStatus('Operational mutation request dropped by system cluster pipeline.');
    }
  };

  // --- ANIMATION SCHEMATICS (SPRING HOOKS) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="max-w-2xl mx-auto space-y-5 text-left pb-12 antialiased"
    >
      <div>
        <h3 className="text-xl font-extrabold text-heading tracking-tight">Settings</h3>
        <p className="text-xs font-semibold text-secondary mt-0.5">Manage your preferences and app settings</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4">
        
        {/* Dynamic State Update Logs Feedback Banner Component */}
        {syncStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-xl flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {syncStatus}
          </motion.div>
        )}

        {/* BLOCK 1: APPEARANCE SELECTION ENVIRONMENT CONTAINER */}
        <motion.div variants={itemVariants} className="bg-card-bg rounded-card border border-border-default p-5 shadow-card group">
          <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Appearance</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-border-default flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 17a5 5 0 100-10 5 5 0 000 10z" /></svg>
              </div>
              <span className="text-sm font-bold text-heading">Theme</span>
            </div>
            <select 
              value={themeSetting} 
              onChange={(e) => setThemeSetting(e.target.value)}
              className="bg-slate-50 border border-border-default px-3 py-1.5 rounded-xl text-xs font-bold text-heading outline-none focus:border-primary transition-all cursor-pointer min-w-[95px]"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System</option>
            </select>
          </div>
        </motion.div>

        {/* BLOCK 2: NOTIFICATIONS SLIDER SWITCH TRIGGER ELEMENT */}
        <motion.div variants={itemVariants} className="bg-card-bg rounded-card border border-border-default p-5 shadow-card group">
          <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Notifications</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-border-default flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <span className="text-sm font-bold text-heading">Enable notifications</span>
            </div>
            <button 
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 outline-none shrink-0 ${notificationsEnabled ? 'bg-primary' : 'bg-slate-300'}`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </motion.div>

        {/* BLOCK 3: INTEL CORE PREFERENCES & MODEL PARAMETERS GRID CONFIG */}
        <motion.div variants={itemVariants} className="bg-card-bg rounded-card border border-border-default p-5 shadow-card space-y-4">
          <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">AI Preferences</h4>
          
          {/* Row 1: Model Execution Verbosity Selection */}
          <div className="flex items-center justify-between border-b border-border-default/50 pb-3.5 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-secondary flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
              <span className="text-sm font-bold text-heading">Response Style</span>
            </div>
            <select value={responseStyle} onChange={(e) => setResponseStyle(e.target.value)} className="bg-transparent text-xs font-bold text-heading outline-none border-none text-right cursor-pointer min-w-[125px]">
              <option value="Balanced">Balanced</option>
              <option value="Strict Clinical">Strict Clinical</option>
              <option value="Creative/Research">Creative/Research</option>
            </select>
          </div>

          {/* Row 2: Primordial System Target Path Selector */}
          <div className="flex items-center justify-between border-b border-border-default/50 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-secondary flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
              <span className="text-sm font-bold text-heading">Default Source</span>
            </div>
            <select value={defaultSource} onChange={(e) => setDefaultSource(e.target.value)} className="bg-transparent text-xs font-bold text-heading outline-none border-none text-right cursor-pointer min-w-[185px]">
              <option value="Hospital Database First">Hospital Database First</option>
              <option value="Global Dataset Core">Global Dataset Core</option>
            </select>
          </div>

          {/* Row 3: Math Vector Search Filter Configuration Slider Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-secondary flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9 7V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg></div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-heading">Confidence Threshold</span>
                <span className="text-[10px] font-semibold text-secondary">Minimum confidence for hospital data</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="range" min="0.50" max="0.95" step="0.01" 
                value={confidenceThreshold} 
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-24 md:w-32 accent-primary cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
              />
              <span className="text-xs font-extrabold text-heading bg-slate-50 border border-border-default/80 px-2 py-0.5 rounded-md shadow-sm select-none w-10 text-center">{confidenceThreshold}</span>
            </div>
          </div>
        </motion.div>

        {/* BLOCK 4: RETENTION POLICIES & SECURITY RULES CONTEXT PANELS */}
        <motion.div variants={itemVariants} className="bg-card-bg rounded-card border border-border-default p-5 shadow-card space-y-4">
          <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">Data & Privacy</h4>
          
          {/* Row 1: Retention Expiration Rules Constraint Drop-down */}
          <div className="flex items-center justify-between border-b border-border-default/50 pb-3.5 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-secondary flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
              <span className="text-sm font-bold text-heading">Auto-delete history</span>
            </div>
            <select value={autoDeleteTimeline} onChange={(e) => setAutoDeleteTimeline(e.target.value)} className="bg-transparent text-xs font-bold text-heading outline-none border-none text-right cursor-pointer min-w-[125px]">
              <option value="After 24 Hours">After 24 Hours</option>
              <option value="After 7 Days">After 7 Days</option>
              <option value="Never Retain Logs">Never Retain Logs</option>
            </select>
          </div>

          {/* Row 2: Purge Thread Core Database Operation Button Anchor */}
          <div className="flex items-center justify-between border-b border-border-default/50 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-secondary flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
              <span className="text-sm font-bold text-heading">Clear All History</span>
            </div>
            <button 
              type="button"
              onClick={() => {
                /* =================================────────────────=========================
                   === 📝 BACKEND INTEGRATION NOTE: DISPATCH EXPLICIT DELETION FOR LOGS ===
                   ==========================================================================
                   if (window.confirm("Purge chat memory? This clears MongoDB cluster lines.")) {
                     await api.delete('/chat/clear-history', {
                       headers: { Authorization: `Bearer ${localStorage.getItem('kendra_token')}` }
                     });
                   }
                ========================================================================== */
              }}
              className="border border-rose-200 bg-rose-50 text-error hover:bg-rose-100 px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Row 3: Data Transmission Domain Boundary Selector */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 text-secondary flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
              <span className="text-sm font-bold text-heading">Data Usage</span>
            </div>
            <select value={dataUsagePolicy} onChange={(e) => setDataUsagePolicy(e.target.value)} className="bg-transparent text-xs font-bold text-heading outline-none border-none text-right cursor-pointer min-w-[165px]">
              <option value="Hospital Data Only">Hospital Data Only</option>
              <option value="Anonymized Aggregates">Anonymized Aggregates</option>
            </select>
          </div>
        </motion.div>

        {/* GLOBAL EXECUTIVE CONTROL MUTATION TRIGGER ACTIONS BUTTON BAR */}
        <motion.button
          type="submit"
          disabled={isSaving}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-button shadow-card hover:shadow-lg transition-all text-sm mt-2 flex items-center justify-center"
        >
          {isSaving ? 'Pushing Configurations to Cluster Nodes...' : 'Save Changes'}
        </motion.button>

      </form>
    </motion.div>
  );
}
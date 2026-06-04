import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function SettingsView() {
  const { themeSetting, setThemeSetting, resolvedTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [responseStyle, setResponseStyle] = useState('Balanced');
  const [defaultSource, setDefaultSource] = useState('Hospital Database First');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.68);
  const [autoDeleteTimeline, setAutoDeleteTimeline] = useState('After 24 Hours');
  const [dataUsagePolicy, setDataUsagePolicy] = useState('Hospital Data Only');
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const handleSaveSettings = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSyncStatus('');

    setTimeout(() => {
      setIsSaving(false);
      setSyncStatus('Preferences saved successfully.');
      setTimeout(() => setSyncStatus(''), 2500);
    }, 600);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-5 pb-12 text-left antialiased text-body"
    >
      <div>
        <h3 className="text-xl font-extrabold tracking-tight text-heading">Settings</h3>
        <p className="mt-0.5 text-xs font-semibold text-secondary">Manage your preferences and app settings</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4">
        {syncStatus && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 p-3.5 text-xs font-bold text-primary"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            {syncStatus}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="rounded-card border border-border-default bg-card-bg p-5 shadow-card group">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-secondary">Appearance</h4>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-default bg-app-bg text-secondary transition-colors group-hover:text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 17a5 5 0 100-10 5 5 0 000 10z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold text-heading">Theme</span>
                <p className="text-[11px] font-medium text-secondary">Current appearance: {resolvedTheme}</p>
              </div>
            </div>

            <select
              value={themeSetting}
              onChange={(event) => setThemeSetting(event.target.value)}
              className="min-w-[110px] rounded-xl border border-border-default bg-app-bg px-3 py-1.5 text-xs font-bold text-heading outline-none transition-all focus:border-primary"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System</option>
            </select>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-card border border-border-default bg-card-bg p-5 shadow-card group">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-secondary">Notifications</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-heading">Enable notifications</span>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`h-6 w-11 rounded-full p-0.5 transition-colors ${notificationsEnabled ? 'bg-primary' : 'bg-slate-300'}`}
            >
              <div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 rounded-card border border-border-default bg-card-bg p-5 shadow-card">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">AI Preferences</h4>

          <div className="flex items-center justify-between border-b border-border-default/60 pb-3.5 pt-1">
            <span className="text-sm font-bold text-heading">Response Style</span>
            <select value={responseStyle} onChange={(event) => setResponseStyle(event.target.value)} className="min-w-[125px] bg-transparent text-right text-xs font-bold text-heading outline-none">
              <option value="Balanced">Balanced</option>
              <option value="Strict Clinical">Strict Clinical</option>
              <option value="Creative/Research">Creative/Research</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-b border-border-default/60 pb-3.5">
            <span className="text-sm font-bold text-heading">Default Source</span>
            <select value={defaultSource} onChange={(event) => setDefaultSource(event.target.value)} className="min-w-[185px] bg-transparent text-right text-xs font-bold text-heading outline-none">
              <option value="Hospital Database First">Hospital Database First</option>
              <option value="Global Dataset Core">Global Dataset Core</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-sm font-bold text-heading">Confidence Threshold</span>
              <p className="text-[10px] font-semibold text-secondary">Minimum confidence for hospital data</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.01"
                value={confidenceThreshold}
                onChange={(event) => setConfidenceThreshold(parseFloat(event.target.value))}
                className="h-1.5 w-24 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary md:w-32"
              />
              <span className="w-10 select-none rounded-md border border-border-default bg-app-bg px-2 py-0.5 text-center text-xs font-extrabold text-heading shadow-sm">
                {confidenceThreshold}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 rounded-card border border-border-default bg-card-bg p-5 shadow-card">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">Data & Privacy</h4>

          <div className="flex items-center justify-between border-b border-border-default/60 pb-3.5 pt-1">
            <span className="text-sm font-bold text-heading">Auto-delete history</span>
            <select value={autoDeleteTimeline} onChange={(event) => setAutoDeleteTimeline(event.target.value)} className="min-w-[125px] bg-transparent text-right text-xs font-bold text-heading outline-none">
              <option value="After 24 Hours">After 24 Hours</option>
              <option value="After 7 Days">After 7 Days</option>
              <option value="Never Retain Logs">Never Retain Logs</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-b border-border-default/60 pb-3.5">
            <span className="text-sm font-bold text-heading">Clear All History</span>
            <button
              type="button"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-bold text-error transition-colors hover:bg-rose-100"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-heading">Data Usage</span>
            <select value={dataUsagePolicy} onChange={(event) => setDataUsagePolicy(event.target.value)} className="min-w-[165px] bg-transparent text-right text-xs font-bold text-heading outline-none">
              <option value="Hospital Data Only">Hospital Data Only</option>
              <option value="Anonymized Aggregates">Anonymized Aggregates</option>
            </select>
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isSaving}
          whileTap={{ scale: 0.99 }}
          className="mt-2 flex w-full items-center justify-center rounded-button bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-card transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-60"
        >
          {isSaving ? 'Saving preferences...' : 'Save Changes'}
        </motion.button>
      </form>
    </motion.div>
  );
}

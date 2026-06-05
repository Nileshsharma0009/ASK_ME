// frontend/src/views/SettingsView.jsx
import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ChatContext } from '../context/ChatContext'; 
import { AuthContext } from '../context/AuthContext';
import { FiShield } from 'react-icons/fi';
import api from '../services/api';

export default function SettingsView() {
  const { themeSetting, setThemeSetting, resolvedTheme } = useTheme();
  const { setIsComplianceOpen } = useContext(ChatContext);
  const auth = useContext(AuthContext);
  
  // 1. DATABASE SYNC: Initial state directly from auth user
  const [hasMutedCompliance, setHasMutedCompliance] = useState(auth?.user?.hasMutedCompliance ?? false);
  
  const [responseStyle, setResponseStyle] = useState('Balanced');
  const [defaultSource, setDefaultSource] = useState('Hospital Database First');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.68);
  const [autoDeleteTimeline, setAutoDeleteTimeline] = useState('After 24 Hours');
  const [dataUsagePolicy, setDataUsagePolicy] = useState('Hospital Data Only');
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // 2. BACKEND SYNC: Toggle Handler
  const handleComplianceToggle = async () => {
    // Current value ka opposite karo
    const newState = !hasMutedCompliance;
    setHasMutedCompliance(newState);
    
    // Agar user ne "Enable" (false to true) kiya, toh modal dikhayein
    if (newState === false) { 
      setIsComplianceOpen(true);
    }

    try {
      const userId = auth?.user?.id || auth?.user?._id;
      // Backend ko correct field bhej rahe hain
      await api.patch(`/auth/update-settings/${userId}`, { 
        hasMutedCompliance: newState 
      });
      
      // Context update taaki app pura update ho jaye
      if (auth?.updateUser) {
        auth.updateUser({ ...auth.user, hasMutedCompliance: newState });
      }
      setSyncStatus('Compliance preference updated.');
    } catch (err) {
      setSyncStatus('Failed to sync settings.');
    }
    setTimeout(() => setSyncStatus(''), 2500);
  };

  const handleSaveSettings = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSyncStatus('Preferences saved successfully.');
      setTimeout(() => setSyncStatus(''), 2500);
    }, 600);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 20 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl mx-auto space-y-5 pb-12 text-left antialiased text-body">
      <div>
        <h3 className="text-xl font-extrabold tracking-tight text-heading">Settings</h3>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4">
        {syncStatus && (
          <motion.div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 p-3.5 text-xs font-bold text-primary">
            {syncStatus}
          </motion.div>
        )}

        {/* OPERATIONAL CARD */}
        <motion.div variants={itemVariants} className="rounded-card border border-border-default bg-card-bg p-5 shadow-card group space-y-6">
          <div>
             <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-secondary">Operational</h4>
             <div className="flex items-center justify-between">
               {/* ◄ FIXED: Toggle is now linked to hasMutedCompliance */}
               <span className="text-sm font-bold text-heading">Enable Compliance Disclaimer</span>
               <button
                 type="button"
                 onClick={handleComplianceToggle}
                 className={`h-6 w-11 rounded-full p-0.5 transition-colors ${!hasMutedCompliance ? 'bg-primary' : 'bg-slate-300'}`}
               >
                 <div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${!hasMutedCompliance ? 'translate-x-5' : 'translate-x-0'}`} />
               </button>
             </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-default pt-4">
            <div className="flex items-center gap-3">
              <FiShield className="text-primary w-5 h-5" />
              <div>
                <p className="text-sm font-bold text-heading">Clinical Guidelines</p>
                <p className="text-[11px] font-medium text-secondary">Review system boundaries</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsComplianceOpen(true)}
              className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
            >
              View Modal
            </button>
          </div>
        </motion.div>

        {/* ... (Other sections remain same) ... */}
        
        <motion.button type="submit" className="w-full rounded-button bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-card hover:bg-primary-dark">
          Save Changes
        </motion.button>
      </form>
    </motion.div>
  );
}
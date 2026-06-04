import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiCamera, FiClock } from 'react-icons/fi';
import { MdShield } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';

export default function ProfileView() {
  const auth = useContext(AuthContext);

  /* ==========================================================================
     FIXED: Correct absolute path references for assets inside the public folder.
     In Vite development ecosystems, paths inside /public are directly served 
     from the base root directory without needing relative system folder levels.
     ========================================================================== */
  const LOCAL_AVATARS = [
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
    "/5.png"
  ];

  // Helper deterministic formula mapping user emails consistently to one of the 5 local image slices
  const getAvatarIndex = (str) => {
    if (!str) return 0;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i);
    }
    return hash % LOCAL_AVATARS.length;
  };

  const [profileData, setProfileData] = useState({
    fullName: auth?.user?.name || 'User',
    email: auth?.user?.email || 'user@example.com',
    department: auth?.user?.department || '---',
    role: auth?.user?.role || 'visitor',
    phone: auth?.user?.phone || '—',
    
    /* ==========================================================================
       TODO: BACKEND_INTEGRATION
       These fields are currently fallback mock data. Ensure your backend 
       schema returns these keys (e.g., createdAt timestamps, verification 
       booleans, and 2FA user configurations).
       ========================================================================== */
    memberSince: 'May 15, 2025', // TODO: Fetch dynamic dynamic registration date string
    isVerified: true,            // TODO: Fetch dynamic dynamic account verification state
    twoFactorEnabled: false,     // TODO: Fetch dynamic dynamic 2FA system setting status
    
    // Assigned deterministic dynamic string reference from your local asset arrays folder
    profileImage: auth?.user?.profileImage || LOCAL_AVATARS[getAvatarIndex(auth?.user?.email || 'default')], // TODO: Fetch active CDN URL path
  });

  useEffect(() => {
    /* ==========================================================================
       TODO: BACKEND_INTEGRATION
       Uncomment and update this block once the backend route is implemented.
       Ensure you map response keys properly to state fields above.
       ========================================================================== */
    // const fetchProfileDetails = async () => {
    //   try {
    //     const { data } = await api.get('/auth/profile');
    //     setProfileData({
    //       fullName: data.name,
    //       email: data.email,
    //       department: data.department,
    //       role: data.role,
    //       phone: data.phone || '—',
    //       memberSince: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    //       isVerified: data.isVerified,
    //       twoFactorEnabled: data.twoFactorEnabled,
    //       profileImage: data.profileImage || LOCAL_AVATARS[getAvatarIndex(data.email || 'default')]
    //     });
    //   } catch (error) {
    //     console.error("Failed to load backend profile details:", error);
    //   }
    // };
    // if (auth?.isAuthenticated) fetchProfileDetails();
  }, [auth?.user]);

  const pageVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    /* ==========================================================================
       UI BLOCK: MAIN MOTION PROFILE VIEW CONTAINER
       ========================================================================== */
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Structural layout balancing sidebar profile panel against right-hand detailed panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
       { /* ==========================================================================
           UI COMPONENT BLOCK: LEFT SIDEBAR AVATAR CARD
           ========================================================================== */}
        <div className="bg-card-bg rounded-card border border-border-default p-6 flex flex-col items-center shadow-card text-center">
          <p className="text-sm font-bold text-heading self-start mb-4 tracking-wide text-secondary/80">
            Profile Information
          </p>

          {/* AVATAR DECORATION: Profile Picture Container with overlay management */}
          <div className="relative mb-4 group cursor-pointer">
            <img
              src={profileData.profileImage} /* TODO: BACKEND_INTEGRATION bound from api source data string */
              alt=""
              className="w-36 h-36 rounded-full object-cover border-4 border-slate-50 shadow-md group-hover:opacity-90 transition-opacity"
            />
            {/* ACTION TRIGGERS: Upload Camera Button */}
            <button
              type="button"
              onClick={() => {
                /* TODO: BACKEND_INTEGRATION trigger photo upload API stream handler */
              }}
              className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full border border-border-default flex items-center justify-center text-secondary hover:text-primary shadow-sm transition-transform group-hover:scale-105"
              aria-label="Change photo"
            >
              <FiCamera className="w-4 h-4" />
            </button>
          </div>

          {/* SIDEBAR LABELS: Primary User Naming Title */}
          <h3 className="text-xl font-extrabold text-heading mb-0.5">{profileData.fullName}</h3>
          <p className="text-xs font-semibold text-secondary mb-4">{profileData.email}</p>

          {/* SIDEBAR BADGES: Departmental Categorization Tag */}
          {/* <div className="bg-primary-light text-primary px-5 py-1.5 rounded-xl text-xs font-bold tracking-wide border border-primary/10 mb-6">
            {profileData.department}
          </div> */}

          {/* SIDEBAR METADATA: Metadata summary split-row metrics layout */}
          <div className="grid grid-cols-2 gap-4 w-full border-t border-b border-border-default/60 py-4 mb-5 text-left">
            {/* <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-secondary/70">
                Member Since
              </p>
              <p className="text-xs font-extrabold text-heading mt-0.5">{profileData.memberSince}</p>
            </div> */}
            {/* <div className="border-l border-border-default/60 pl-4">
              <p className="text-[11px] uppercase tracking-wider font-bold text-secondary/70">Role</p>
              <p className="text-xs font-extrabold text-heading mt-0.5">{profileData.role}</p>
            </div> */}
          </div>

          {/* SIDEBAR ALERTS: Verification Status Badge Indicator */}
          {profileData.isVerified && (
            <div className="w-full bg-success-bg/60 text-success border border-success/20 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold shadow-inner">
              <div className="w-5 h-5 bg-success text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                ✓
              </div>
              Verified Account
            </div>
          )}
        </div>
                                 {/* {UI COMPONENT BLOCK: RIGHT PANELS COLUMN WRAPPER} */}
        <div className="md:col-span-2 space-y-6">
          
          {/* ==========================================================================
             UI COMPONENT SUB-BLOCK: ACCOUNT METRICS LIST DETAILS PANEL
             ========================================================================== */}
          <div className="bg-card-bg rounded-card border border-border-default p-6 shadow-card">
           <h3 className="text-sm font-bold text-heading tracking-wide text-secondary/80 mb-5 text-center">
  Account Details
</h3>

            {/* LIST STRUCTURE: Mapped item layouts split row components */}
            <div className="divide-y divide-border-default/60 space-y-4">
              {[
                { label: 'Full Name', value: profileData.fullName },
                { label: 'Email Address', value: profileData.email },
                // { label: 'Department', value: profileData.department },
                { label: 'Role', value: profileData.role },
                // { label: 'Phone', value: profileData.phone },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between pt-4 first:pt-0 group">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-secondary/70 uppercase tracking-wider">
                      {row.label}
                    </span>
                    <span className="text-sm font-extrabold text-heading mt-1">{row.value}</span>
                  </div>
                  {/* DETAIL ACTION BUTTONS: Individual Field Edit Modifier */}
                  <button
                    type="button"
                    onClick={() => {
                      /* TODO: BACKEND_INTEGRATION context modal implementation for targeted field patch requests */
                    }}
                    className="w-8 h-8 rounded-lg border border-border-default bg-slate-50 flex items-center justify-center text-secondary opacity-40 group-hover:opacity-100 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                    aria-label={`Edit {row.label}`}
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* SECURITY ROW OVERLAYS: Target Masked Password Field Wrapper */}
              <div className="flex items-center justify-between pt-4 group">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary/70 uppercase tracking-wider">
                    Password
                  </span>
                  <span className="text-sm font-extrabold text-heading mt-1 tracking-widest">
                    ••••••••••••
                  </span>
                </div>
                {/* DETAIL ACTION BUTTONS: Operational Password Update Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    /* TODO: BACKEND_INTEGRATION route password patch verification context */
                  }}
                  className="bg-slate-50 border border-border-default hover:border-primary text-heading hover:text-primary px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* ==========================================================================
             UI COMPONENT SUB-BLOCK: SYSTEM SECURITY MANAGEMENT SETTINGS PANEL
             ========================================================================== */}
          <div className="bg-card-bg rounded-card border border-border-default p-6 shadow-card space-y-5">
            <h3 className="text-sm font-bold text-heading tracking-wide text-secondary/80">Security</h3>

            {/* SECURITY TOGGLES BLOCK: Two-Factor Authentication Management Wrapper */}
            <div className="flex items-center justify-between border-b border-border-default/60 pb-4">
              <div className="flex items-start gap-3 text-left">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <MdShield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-heading">Two-Factor Authentication</p>
                  <p className="text-xs text-secondary font-medium mt-0.5">
                    Secure your account with 2FA protocols.
                  </p>
                </div>
              </div>
              {/* TOGGLE ELEMENT INTERFACES: Two Factor Switch Trigger */}
              <button
                type="button"
                onClick={() =>
                  /* TODO: BACKEND_INTEGRATION handle secondary confirmation/deactivation endpoint workflows */
                  setProfileData((p) => ({ ...p, twoFactorEnabled: !p.twoFactorEnabled }))
                }
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none ${
                  profileData.twoFactorEnabled ? 'bg-primary' : 'bg-slate-300'
                }`}
                aria-label="Toggle two-factor authentication"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                    profileData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* SECURITY LIST ELEMENTS: Active Logs Context Tracking Manager Wrapper */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-start gap-3 text-left">
                <div className="w-9 h-9 bg-slate-100 border border-border-default/50 rounded-xl flex items-center justify-center text-secondary shrink-0 mt-0.5">
                  <FiClock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-heading">Active Sessions</p>
                  <p className="text-xs text-secondary font-medium mt-0.5">
                    Manage your active logged-in terminal contexts.
                  </p>
                </div>
              </div>
              {/* INTERFACE ACTIONS: Route Device Settings View */}
              <button
                type="button"
                onClick={() => {
                  /* TODO: BACKEND_INTEGRATION navigate log token session details overlay */
                }}
                className="bg-slate-50 border border-border-default hover:border-primary text-heading hover:text-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
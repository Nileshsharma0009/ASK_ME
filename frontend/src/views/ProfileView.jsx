import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiCamera, FiClock } from 'react-icons/fi';
import { MdShield } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';

export default function ProfileView() {
  const auth = useContext(AuthContext);

  const [profileData, setProfileData] = useState({
    fullName: auth?.user?.name || 'Staff Member',
    email: auth?.user?.email || 'staff@hospital.com',
    department: auth?.user?.department || 'Healthcare',
    role: auth?.user?.role || 'Staff',
    phone: auth?.user?.phone || '—',
    memberSince: 'May 15, 2025',
    isVerified: true,
    twoFactorEnabled: false,
  });

  useEffect(() => {
    // === BACKEND (later) ===
    // const fetchProfileDetails = async () => {
    //   const { data } = await api.get('/auth/profile');
    //   setProfileData({ ... });
    // };
    // if (auth?.isAuthenticated) fetchProfileDetails();
  }, [auth?.user]);

  const pageVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="bg-card-bg rounded-card border border-border-default p-6 flex flex-col items-center shadow-card text-center">
          <p className="text-sm font-bold text-heading self-start mb-4 tracking-wide text-secondary/80">
            Profile Information
          </p>

          <div className="relative mb-4 group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=240"
              alt=""
              className="w-36 h-36 rounded-full object-cover border-4 border-slate-50 shadow-md group-hover:opacity-90 transition-opacity"
            />
            <button
              type="button"
              className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full border border-border-default flex items-center justify-center text-secondary hover:text-primary shadow-sm transition-transform group-hover:scale-105"
              aria-label="Change photo"
            >
              <FiCamera className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-xl font-extrabold text-heading mb-0.5">{profileData.fullName}</h3>
          <p className="text-xs font-semibold text-secondary mb-4">{profileData.email}</p>

          <div className="bg-primary-light text-primary px-5 py-1.5 rounded-xl text-xs font-bold tracking-wide border border-primary/10 mb-6">
            {profileData.department}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full border-t border-b border-border-default/60 py-4 mb-5 text-left">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-secondary/70">
                Member Since
              </p>
              <p className="text-xs font-extrabold text-heading mt-0.5">{profileData.memberSince}</p>
            </div>
            <div className="border-l border-border-default/60 pl-4">
              <p className="text-[11px] uppercase tracking-wider font-bold text-secondary/70">Role</p>
              <p className="text-xs font-extrabold text-heading mt-0.5">{profileData.role}</p>
            </div>
          </div>

          {profileData.isVerified && (
            <div className="w-full bg-success-bg/60 text-success border border-success/20 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold shadow-inner">
              <div className="w-5 h-5 bg-success text-white rounded-full flex items-center justify-center text-[10px] shadow-sm">
                ✓
              </div>
              Verified Account
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-card-bg rounded-card border border-border-default p-6 shadow-card">
            <h3 className="text-sm font-bold text-heading tracking-wide text-secondary/80 mb-5">
              Account Details
            </h3>

            <div className="divide-y divide-border-default/60 space-y-4">
              {[
                { label: 'Full Name', value: profileData.fullName },
                { label: 'Email Address', value: profileData.email },
                { label: 'Department', value: profileData.department },
                { label: 'Role', value: profileData.role },
                { label: 'Phone', value: profileData.phone },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center justify-between pt-4 first:pt-0 group">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-secondary/70 uppercase tracking-wider">
                      {row.label}
                    </span>
                    <span className="text-sm font-extrabold text-heading mt-1">{row.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      /* === BACKEND (later) === open edit modal */
                    }}
                    className="w-8 h-8 rounded-lg border border-border-default bg-slate-50 flex items-center justify-center text-secondary opacity-40 group-hover:opacity-100 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                    aria-label={`Edit ${row.label}`}
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center justify-between pt-4 group">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary/70 uppercase tracking-wider">
                    Password
                  </span>
                  <span className="text-sm font-extrabold text-heading mt-1 tracking-widest">
                    ••••••••••••
                  </span>
                </div>
                <button
                  type="button"
                  className="bg-slate-50 border border-border-default hover:border-primary text-heading hover:text-primary px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card-bg rounded-card border border-border-default p-6 shadow-card space-y-5">
            <h3 className="text-sm font-bold text-heading tracking-wide text-secondary/80">Security</h3>

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
              <button
                type="button"
                onClick={() =>
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
              <button
                type="button"
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

import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMessageSquare,
  FiUploadCloud,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBell,
  FiChevronDown,
  FiMenu,
  FiSidebar,
} from 'react-icons/fi';
import { MdShield } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';
import { env } from '../../config/env';

// 1. Clean Configuration for Navigation Items
const NAV_ITEMS = [
  { to: '.', end: true, label: 'Ask ASK_ME', icon: FiMessageSquare, segment: 'chat' },
  { to: 'upload', label: 'Upload Data', icon: FiUploadCloud, segment: 'upload' },
  { to: 'history', label: 'History', icon: FiClock, segment: 'history' },
  { to: 'profile', label: 'Profile', icon: FiUser, segment: 'profile' },
  { to: 'settings', label: 'Settings', icon: FiSettings, segment: 'settings' },
];

// 2. Beautiful Animated Layout Title Map
const PAGE_TITLES = {
  chat: (name) => (
    <div className="flex items-center gap-2">
      <span>Hey <span className="text-primary">{name}</span></span>
      <span className="animate-bounce origin-bottom-right inline-block"></span>
    </div>
  ),
  upload: 'Upload Medical Knowledge',
  history: 'Query History Log',
  profile: 'User Profile Analytics',
  settings: 'System Configuration',
};

// Helper to determine the active tab accurately
function getActiveSegment(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1];
  return PAGE_TITLES[lastPart] ? lastPart : 'chat';
}

export default function DashboardLayout() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fallbacks safe checks
  const userDisplayName = auth?.user?.name || 'Medical Officer';
  const userDepartment = auth?.user?.department || 'Healthcare';
  
  const segment = getActiveSegment(location.pathname);
  const headerTitle = PAGE_TITLES[segment];
  const isChat = segment === 'chat';

  // Fluid UI Animation Transitions
  const sidebarVariants = {
    open: {
      width: '260px',
      opacity: 1,
      transition: { type: 'spring', stiffness: 240, damping: 28 },
    },
    closed: {
      width: '0px',
      opacity: 0,
      transition: { type: 'spring', stiffness: 240, damping: 28 },
    },
  };

  const handleLogout = () => {
    auth?.logout?.();
    navigate(env.routes.login || '/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-indigo-50/40 text-slate-700 flex antialiased selection:bg-primary/10 overflow-hidden">
      
      {/* SIDEBAR BLOCK */}
      <motion.aside
        variants={sidebarVariants}
        animate={isSidebarOpen ? 'open' : 'closed'}
        initial="open"
        className="bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 overflow-hidden z-40 shadow-sm"
      >
        <div className="w-[260px] flex flex-col justify-between h-full">
          <div className="p-5">
            
            {/* Sidebar Brand Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                  <div className="relative flex items-center justify-center">
                    <MdShield className="w-6 h-6 text-white" />
                    <span className="absolute text-primary font-black text-[10px] pb-0.5">+</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-base font-black tracking-tight text-slate-900">
                    ASK<span className="text-primary">_ME</span>
                  </h1>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">
                    Clinical RAG Engine
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-150"
                aria-label="Close sidebar"
              >
                <FiSidebar className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation System */}
            <nav className="space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.segment}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Account Action */}
          <div className="p-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-wide text-rose-500 hover:bg-rose-50/60 transition-all duration-150"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* CORE CONTENT SHELL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* APP MAIN HEADER */}
        <header className="h-20 bg-white/70 backdrop-blur-md px-6 md:px-8 border-b border-slate-200/60 flex items-center justify-between shrink-0 gap-4 z-30">
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {!isSidebarOpen && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm shrink-0"
                  aria-label="Open sidebar"
                >
                  <FiMenu className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={segment}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="text-lg font-black text-slate-900 tracking-tight"
                >
                  {typeof headerTitle === 'function' ? headerTitle(userDisplayName) : headerTitle}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* User Meta Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all relative"
              aria-label="Notifications"
            >
              <FiBell className="w-4 h-4" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            <NavLink
              to="profile"
              className="flex items-center gap-3 border-l border-slate-200 pl-4 hover:opacity-80 transition-opacity"
            >
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
                alt="Profile Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10"
              />
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  {userDisplayName} <FiChevronDown className="w-3 h-3 text-slate-400" />
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  {userDepartment}
                </span>
              </div>
            </NavLink>
          </div>
        </header>

        {/* NESTED ROUTES RENDER PLANE */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
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

const NAV_ITEMS = [
  { to: '.', end: true, label: 'Ask ASK_ME', icon: FiMessageSquare, segment: 'chat' },
  { to: 'upload', label: 'Upload Data', icon: FiUploadCloud, segment: 'upload' },
  { to: 'history', label: 'History', icon: FiClock, segment: 'history' },
  { to: 'profile', label: 'Profile', icon: FiUser, segment: 'profile' },
  { to: 'settings', label: 'Settings', icon: FiSettings, segment: 'settings' },
];

const PAGE_TITLES = {
  chat: (name) => (
    <>
      Hello, {name}! <span className="animate-bounce">👋</span>
    </>
  ),
  upload: 'Upload Data',
  history: 'History',
  profile: 'Profile',
  settings: 'Settings',
};

function getActiveSegment(pathname) {
  const base = env.routes.chat.replace(/\/$/, '');
  const rest = pathname.replace(base, '').replace(/^\//, '');
  return rest || 'chat';
}

export default function DashboardLayout() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userDisplayName = auth?.user?.name || 'Staff Member';
  const userDepartment = auth?.user?.department || 'Healthcare';
  const segment = getActiveSegment(location.pathname);
  const headerTitle = PAGE_TITLES[segment];
  const isChat = segment === 'chat';

  const sidebarVariants = {
    open: {
      width: '256px',
      opacity: 1,
      transition: { type: 'spring', stiffness: 220, damping: 26 },
    },
    closed: {
      width: '0px',
      opacity: 0,
      transition: { type: 'spring', stiffness: 220, damping: 26 },
    },
  };

  const handleLogout = () => {
    auth?.logout?.();
    navigate(env.routes.login, { replace: true });
  };

  return (
    <div className="min-h-screen bg-app-bg text-body flex antialiased selection:bg-primary/10 overflow-hidden">
      <motion.aside
        variants={sidebarVariants}
        animate={isSidebarOpen ? 'open' : 'closed'}
        initial="open"
        className="bg-card-bg border-r border-border-default flex flex-col justify-between h-screen sticky top-0 shrink-0 overflow-hidden z-40 shadow-sm"
      >
        <div className="w-64 flex flex-col justify-between h-full">
          <div className="p-5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-card">
                  <div className="relative flex items-center justify-center">
                    <MdShield className="w-7 h-7 text-white" />
                    <span className="absolute text-primary font-bold text-[10px] pb-0.5">+</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-base font-extrabold tracking-tight text-heading">
                    ASK<span className="text-primary">_ME</span>
                  </h1>
                  <p className="text-[10px] uppercase tracking-wider text-secondary font-bold">
                    AI Assistant for Healthcare
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-secondary hover:bg-slate-50 hover:text-heading transition-colors"
                aria-label="Close sidebar"
              >
                <FiSidebar className="w-4 h-4" />
              </button>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.segment}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3.5 px-4 py-3 rounded-button text-sm font-bold tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-card'
                          : 'text-secondary hover:bg-slate-50 hover:text-heading'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-secondary'}`} />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="p-5 border-t border-border-default">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-button text-sm font-bold tracking-wide text-secondary hover:bg-error/5 hover:text-error transition-all duration-200"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-card-bg/40 backdrop-blur-md px-6 md:px-8 border-b border-border-default/50 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {!isSidebarOpen && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-10 h-10 bg-white border border-border-default rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:border-primary/30 transition-all shadow-sm shrink-0"
                  aria-label="Open sidebar"
                >
                  <FiMenu className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <div>
              {isChat ? (
                <motion.h2
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-extrabold text-heading flex items-center gap-2"
                >
                  {typeof headerTitle === 'function'
                    ? headerTitle(userDisplayName)
                    : headerTitle}
                </motion.h2>
              ) : (
                <h2 className="text-xl font-extrabold text-heading capitalize">
                  {typeof headerTitle === 'string' ? headerTitle : segment}
                </h2>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              className="w-10 h-10 bg-white border border-border-default rounded-xl flex items-center justify-center text-secondary hover:text-primary transition-all relative"
              aria-label="Notifications"
            >
              <FiBell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-error rounded-full" />
            </button>

            <NavLink
              to="profile"
              className="flex items-center gap-3 border-l border-border-default pl-5 hover:opacity-90 transition-opacity"
            >
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="text-sm font-bold text-heading flex items-center gap-1">
                  {userDisplayName} <FiChevronDown className="w-3 h-3 text-secondary" />
                </span>
                <span className="text-[10px] text-secondary font-bold uppercase tracking-wide">
                  {userDepartment}
                </span>
              </div>
            </NavLink>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

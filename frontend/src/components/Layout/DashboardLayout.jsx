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
import { ChatContext } from '../../context/ChatContext'; // Integrated shared context pool to execute dynamic resets
import { env } from '../../config/env';

// 1. Clean Configuration for Navigation Items
const NAV_ITEMS = [
  { to: '.', end: true, label: 'Ask ASK_ME', icon: FiMessageSquare, segment: 'chat' },
  { to: 'New chat', label: 'New chat', icon: FiUploadCloud, segment: 'New chat' },
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
  'New chat': 'Start a New Workspace Session', // Configured text title string fallback mapping for new chats
  upload: 'Upload Medical Knowledge',
  history: 'Query History Log',
  profile: 'User Profile Analytics',
  settings: 'System Configuration',
};

// Helper to determine the active tab accurately
function getActiveSegment(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1];
  // Decode URL spacing rules cleanly to identify the explicit active segment
  const decodedPart = decodeURIComponent(lastPart);
  return PAGE_TITLES[decodedPart] ? decodedPart : 'chat';
}

export default function DashboardLayout() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Destructure direct state manipulators from shared layout memory context


  // TO THIS:
const { 
  conversationId, // ◄ Added this missing variable right here!
  setMessages, 
  setConversationId, 
  setInputMessage, 
  setAnimatedMessageId 
} = useContext(ChatContext);


  /* ==========================================================================
     TODO: BACKEND_INTEGRATION
     Verify your AuthContext model matches these properties. When pulling 
     from real database user schemas, ensure fallback properties account 
     for incomplete administrative credentials or specialized roles.
     ========================================================================== */
  const userDisplayName = auth?.user?.name || 'Medical Officer';
  const userDepartment = auth?.user?.department || 'Healthcare';
  
  const segment = getActiveSegment(location.pathname);
  const headerTitle = PAGE_TITLES[segment];
  const isChat = segment === 'chat' || segment === 'New chat'; // Keeps layout full-bleed fluid for fresh canvases

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

  // Intercept action commands when generating secondary session environments
  const handleNewChatClick = (e) => {
    e.preventDefault(); // Stop raw relative standard link transitions
    
    // Clear the active browser variable state context blocks completely
    setMessages([]);
    setConversationId('');
    setInputMessage('');
    setAnimatedMessageId(null);

    // Reset parameters tracking arrays completely back to root path baseline
    navigate('.', { replace: true });
  };

  const handleLogout = () => {
    /* ==========================================================================
       TODO: BACKEND_INTEGRATION
       Coordinate session revocation handles here. Ensure backend route hooks
       (e.g., token clearing or blacklisting cookies) fire inside your auth module.
       ========================================================================== */
    auth?.logout?.();
    navigate(env.routes.login || '/login', { replace: true });
  };

  return (
    /* ==========================================================================
       UI BLOCK: ACCENT MASTER PERSISTENT LAYOUT WRAPPER
       ========================================================================== */
    <div className="min-h-screen bg-app-bg text-body flex antialiased selection:bg-primary/10 overflow-hidden">
      
      {/* ==========================================================================
         UI COMPONENT BLOCK: ASIDE COLLAPSIBLE NAVIGATION DRAWER
         ========================================================================== */}
      <motion.aside
        variants={sidebarVariants}
        animate={isSidebarOpen ? 'open' : 'closed'}
        initial="open"
        className="bg-sidebar-bg border-r border-border-default flex flex-col justify-between h-screen sticky top-0 shrink-0 overflow-hidden z-40 shadow-sm"
      >
        <div className="w-[260px] flex flex-col justify-between h-full">
          <div className="p-5">
            
            {/* SIDEBAR HEADER: Branding Layer & Collapse Button */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                {/* Decorative Branding Shield Badge */}
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                  <div className="relative flex items-center justify-center">
                    <MdShield className="w-6 h-6 text-white" />
                    <span className="absolute text-primary font-black text-[10px] pb-0.5">+</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-base font-black tracking-tight text-heading">
                    ASK<span className="text-primary">_ME</span>
                  </h1>
                  <p className="text-[9px] uppercase tracking-widest text-secondary font-extrabold">
                    Clinical RAG Engine
                  </p>
                </div>
              </div>
              
              {/* Trigger button for shrinking the navigation dashboard frame */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-secondary hover:bg-app-bg hover:text-heading transition-colors duration-150"
                aria-label="Close sidebar"
              >
                <FiSidebar className="w-4 h-4" />
              </button>
            </div>

            {/* SIDEBAR NAVIGATION LINKS LAYER */}
            <nav className="space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                // Intercept execution pathways specifically targeting New Chat mutations
                if (item.segment === 'New chat') {
                  return (
                    <button
                      key={item.segment}
                      type="button"
                      onClick={handleNewChatClick}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-wide text-secondary hover:bg-app-bg hover:text-heading transition-all duration-200 text-left"
                    >
                      <Icon className="w-4 h-4 text-secondary" />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                // Dynamic persistence check: Route back directly to active conversation parameters if populated
                const resolvedPath = item.segment === 'chat' && conversationId 
                  ? `.?chatId=${conversationId}` 
                  : item.to;

                return (
                  <NavLink
                    key={item.segment}
                    to={resolvedPath}
                    end={item.end}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]'
                          : 'text-secondary hover:bg-app-bg hover:text-heading'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-secondary'}`} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* SIDEBAR FOOTER ACTION: Session Revocation Hub */}
          <div className="p-5 border-t border-border-default">
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

      {/* ==========================================================================
         UI BLOCK: PERSISTENT CORE CONTENT WORKSPACE SHELL
         ========================================================================== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* ==========================================================================
            UI COMPONENT BLOCK: APP BAR GLOBAL ACTION HEADER
            ========================================================================== */}
        <header className="h-20 bg-card-bg/80 backdrop-blur-md px-6 md:px-8 border-b border-border-default flex items-center justify-between shrink-0 gap-4 z-30">
          <div className="flex items-center gap-4">
            
            {/* CONDITIONAL ACTION: Expand Drawer Trigger Button */}
            <AnimatePresence mode="wait">
              {!isSidebarOpen && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-10 h-10 bg-card-bg border border-border-default rounded-xl flex items-center justify-center text-secondary hover:text-primary hover:border-primary/30 transition-all shadow-sm shrink-0"
                  aria-label="Open sidebar"
                >
                  <FiMenu className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* DYNAMIC HEADER TEXT: Target Segment Component Interpolations */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={segment}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="text-lg font-black text-heading tracking-tight"
                >
                  {typeof headerTitle === 'function' ? headerTitle(userDisplayName) : headerTitle}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* DYNAMIC METADATA PACK: Global Operational Controls Panel */}
          <div className="flex items-center gap-4">
            
            {/* CONTROL TRIGGER: Operational Notification Hub Overlay */}
            <button
              type="button"
              onClick={() => {
                /* TODO: BACKEND_INTEGRATION route notification center panels or dynamic state popups */
              }}
              className="w-10 h-10 bg-card-bg border border-border-default rounded-xl flex items-center justify-center text-secondary hover:text-heading transition-all relative"
              aria-label="Notifications"
            >
              <FiBell className="w-4 h-4" />
              {/* TODO: BACKEND_INTEGRATION bind badge rendering logic to dynamic unread database queries */}
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-card-bg" />
            </button>

            {/* USER QUICK LINK SECTION: Profile Avatar & Secondary Metadata Details */}
            <NavLink
              to="profile"
              className="flex items-center gap-3 border-l border-border-default pl-4 hover:opacity-80 transition-opacity"
            >
              <img
                src={auth?.user?.profileImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"} /* TODO: BACKEND_INTEGRATION bind to AuthContext payload profileImage URL */
                alt="Profile Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10"
              />
              <div className="flex flex-col text-left hidden sm:flex">
                <span className="text-xs font-bold text-heading flex items-center gap-1.5">
                  {userDisplayName} <FiChevronDown className="w-3 h-3 text-secondary" />
                </span>
                <span className="text-[9px] text-secondary font-bold uppercase tracking-wider">
                  {userDepartment}
                </span>
              </div>
            </NavLink>
          </div>
        </header>

        {/* ==========================================================================
            UI RENDER CONTEXT PLANE: NESTED ROUTE VIEWPORT FRAME
            Adapts inner layout margins depending on whether sub-context is an 
            immersive full-width console view (Chat) or a document view grid.
            ========================================================================== */}
        <main className={`flex-1 overflow-y-auto bg-app-bg ${isChat ? 'p-0' : 'p-6 md:p-8'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
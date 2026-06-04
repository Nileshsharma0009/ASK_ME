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
} from 'react-icons/fi';
import { MdShield } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext'; // Integrated shared context pool to execute dynamic resets
import { env } from '../../config/env';

// 1. Clean Configuration for Navigation Items
const NAV_ITEMS = [
  { to: '.', end: true, label: 'ASK_ME', icon: FiMessageSquare, segment: 'chat' },
  { to: 'New chat', label: 'New chat', icon: FiUploadCloud, segment: 'New chat' },
  { to: 'history', label: 'History', icon: FiClock, segment: 'history' },
  { to: 'profile', label: 'Profile', icon: FiUser, segment: 'profile' },
  { to: 'settings', label: 'Settings', icon: FiSettings, segment: 'settings' },
];

// 2. Beautiful Animated Layout Title Map
const PAGE_TITLES = {
  chat: (name) => (
    <div className="flex items-center gap-2">
      <span>Hey , <span className="text-primary">{name}</span></span>
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
  const userDepartment = auth?.user?.department || '';
  
  const segment = getActiveSegment(location.pathname);
  const headerTitle = PAGE_TITLES[segment];
  const isChat = segment === 'chat' || segment === 'New chat'; // Keeps layout full-bleed fluid for fresh canvases

  // Fluid UI Animation Transitions Updated to prevent full disappearing down to an iconic vertical strip width
  const sidebarVariants = {
    open: {
      width: '260px',
      opacity: 1,
      transition: { type: 'spring', stiffness: 240, damping: 28 },
    },
    closed: {
      width: '72px',
      opacity: 1,
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
        <div className="w-full flex flex-col justify-between h-full">
          <div className="p-4 flex flex-col items-center">
            
            {/* SIDEBAR HEADER: Branding Layer & Collapse Button */}
         {/* SIDEBAR HEADER: Branding Layer & Collapse Handle */}
<div className={`flex items-center w-full mb-8 ${isSidebarOpen ? 'justify-between px-1' : 'justify-center'}`}>
  
  {/* FIXED: Turn the entire logo branding segment into an interactive toggle button track */}
  <div 
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    className="flex items-center gap-3 overflow-hidden cursor-pointer select-none active:scale-98 transition-all duration-200"
    title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
  >
    {/* Decorative Branding Image Logo Badge */}
    <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-md shadow-primary/10 bg-white">
      <img 
        src="/logo2.png" // ◄ Change "logo.png" to your exact file name (e.g., /hospital-logo.svg, /logo.png, etc.)
        alt="Hospital Logo"
        className="w-full h-full object-cover"
      />
    </div>
    
    {isSidebarOpen && (
      <motion.div 
        initial={{ opacity: 0, x: -4 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="whitespace-nowrap"
      >
        <h1 className="text-base font-black tracking-tight text-heading">
          ASK<span className="text-primary">_ME</span>
        </h1>
        <p className="text-[9px] uppercase tracking-widest text-secondary font-extrabold">
          Clinical RAG Engine
        </p>
      </motion.div>
    )}
  </div>
</div>

            
            {/* SIDEBAR NAVIGATION LINKS LAYER */}
            <nav className="space-y-1.5 w-full flex flex-col items-center">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                // Intercept execution pathways specifically targeting New Chat mutations
                if (item.segment === 'New chat') {
                  return (
                    <button
                      key={item.segment}
                      type="button"
                      onClick={handleNewChatClick}
                      title={!isSidebarOpen ? item.label : undefined}
                      className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-bold tracking-wide text-secondary hover:bg-app-bg hover:text-heading transition-all duration-200 text-left ${isSidebarOpen ? 'w-full px-3.5' : 'w-10 h-10 justify-center px-0'}`}
                    >
                      <Icon className="w-4 h-4 text-secondary shrink-0" />
                      {isSidebarOpen && <span>{item.label}</span>}
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
                    title={!isSidebarOpen ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                        isSidebarOpen ? 'w-full px-3.5' : 'w-10 h-10 justify-center px-0'
                      } ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.01]'
                          : 'text-secondary hover:bg-app-bg hover:text-heading'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-secondary'}`} />
                        {isSidebarOpen && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* SIDEBAR FOOTER ACTION: Session Revocation Hub */}
          <div className="p-4 border-t border-border-default flex justify-center">
            <button
              type="button"
              onClick={handleLogout}
              title={!isSidebarOpen ? 'Sign Out' : undefined}
              className={`flex items-center gap-3 py-2.5 rounded-xl text-sm font-bold tracking-wide text-rose-500 hover:bg-rose-50/60 transition-all duration-150 ${isSidebarOpen ? 'w-full px-3.5' : 'w-10 h-10 justify-center px-0'}`}
            >
              <FiLogOut className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Sign Out</span>}
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
            
            {/* FIXED: Removed the redundant three-line menu button overlay completely to match clean iconic minimized layout states */}

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

            {/* USER QUICK LINK SECTION: Profile Avatar & Secondary Metadata Details */}
            {/* ==========================================================================
            USER QUICK LINK SECTION: Profile Avatar & Secondary Metadata Details
            ========================================================================== */}
            <NavLink
              to="profile"
              className="flex items-center gap-3 border-l border-border-default pl-4 hover:opacity-80 transition-opacity"
            >
              <img
                src={
                  auth?.user?.profileImage || 
                  (() => {
                    const LOCAL_AVATARS = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];
                    const email = auth?.user?.email || "default";
                    let hash = 0;
                    for (let i = 0; i < email.length; i++) {
                      hash += email.charCodeAt(i);
                    }
                    return LOCAL_AVATARS[hash % LOCAL_AVATARS.length];
                  })()
                } /* FIXED: Linked cleanly to the deterministic /public folder hashing rotation sequence */
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
// frontend/src/views/HistoryView.jsx (Or inline inside ChatDashboard.jsx)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMoreVertical, FiMessageSquare, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function HistoryView() {
  // ─── STATE FIELDS INITIALIZATION ───
  const [historyLogs, setHistoryLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── HOOK: FETCH CHAT MEMORY HISTORY LINES FROM MONGODB ───
  useEffect(() => {
    /* =================================────────────────=========================
       === 📝 BACKEND INTEGRATION NOTE: PIPELINE DATA DISPATCH FROM DATABASE ===
       ==========================================================================
       const loadConversationHistory = async () => {
         try {
           setIsLoading(true);
           const response = await api.get(`/chat/history?page=${currentPage}&search=${searchQuery}`, {
             headers: { Authorization: `Bearer ${localStorage.getItem('kendra_token')}` }
           });
           
           // Hydrate the layout array loop with explicit schema fields from MongoDB:
           // Format expected: Array of objects with text, source (Hospital/Global), timestamp
           setHistoryLogs(response.data.logs || []);
           setIsLoading(false);
         } catch (err) {
           console.error("Operational error loading history lines from database cluster:", err);
           setIsLoading(false);
         }
       };

       loadConversationHistory();
    ========================================================================== */

    // Simulated local blueprint baseline array placeholder for testing UI
    setTimeout(() => {
      setHistoryLogs([
        { id: '1', question: "What is the fallback procedure if an ICU patient rejects Medication X?", source: "Hospital Database", dateTime: "May 20, 2025 - 10:30 AM" },
        { id: '2', question: "ICU patient sedation protocol for ventilated patients", source: "Hospital Database", dateTime: "May 20, 2025 - 09:15 AM" },
        { id: '3', question: "What are the side effects of Drug Y?", source: "Global AI Database", dateTime: "May 19, 2025 - 04:45 PM" },
        { id: '4', question: "Post-operative care guidelines for heart surgery", source: "Hospital Database", dateTime: "May 19, 2025 - 11:20 AM" },
        { id: '5', question: "How to handle allergic reactions in emergency?", source: "Global AI Database", dateTime: "May 18, 2025 - 08:10 PM" },
      ]);
      setIsLoading(false);
    }, 600);
  }, [currentPage, searchQuery]);

  // --- ANIMATION SCHEMATICS (SPRING HOOKS) ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150, damping: 22 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="max-w-5xl mx-auto space-y-5 text-left pb-8 antialiased font-medium text-body"
    >
      {/* Dynamic Master Header Row */}
      <div>
        <h3 className="text-xl font-extrabold text-heading tracking-tight">Conversation History</h3>
        <p className="text-xs font-semibold text-secondary mt-0.5">View and manage your past conversations with ASK_ME</p>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 🔍 SEARCH AND CONTROL TOOLBARS                           */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
        <div className="relative w-full sm:max-w-sm group">
          <FiSearch className="absolute left-4 top-3 text-secondary/70 group-focus-within:text-primary transition-colors duration-150 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-card-bg border border-border-default rounded-xl text-sm placeholder-placeholder/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium shadow-sm"
          />
        </div>

        <button 
          type="button"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-border-default rounded-xl text-sm font-bold text-heading hover:border-primary/40 hover:bg-slate-50 transition-all shadow-sm"
        >
          <FiFilter className="w-4 h-4 text-secondary" />
          <span>Filter</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 📊 CORE GRID LOG LINES DATA TABLE                        */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="bg-card-bg rounded-card border border-border-default shadow-card overflow-hidden">
        
        {/* Table Header Row Framework */}
        <div className="grid grid-cols-12 bg-slate-50/70 border-b border-border-default/60 px-6 py-3.5 text-xs font-bold text-secondary uppercase tracking-wider select-none">
          <div className="col-span-12 md:col-span-7 text-left">Question</div>
          <div className="hidden md:block col-span-2 text-left">Source</div>
          <div className="hidden md:block col-span-3 text-left">Date & Time</div>
        </div>

        {/* List Grid Loop Execution Block */}
        <div className="divide-y divide-border-default/50">
          {isLoading ? (
            <div className="p-12 text-center text-sm font-bold text-secondary animate-pulse">
              Hydrating past conversation data matrices...
            </div>
          ) : historyLogs.length === 0 ? (
            <div className="p-12 text-center text-sm font-bold text-secondary">
              No session memory logs recorded inside this sequence index boundary.
            </div>
          ) : (
            historyLogs.map((log) => (
              <motion.div 
                key={log.id} 
                variants={rowVariants}
                className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50/60 transition-colors group relative"
              >
                {/* Column 1: Core Target Query Text */}
                <div className="col-span-11 md:col-span-7 pr-4 flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm border mt-0.5 ${
                    log.source === 'Hospital Database' 
                      ? 'bg-primary/5 text-primary border-primary/10' 
                      : 'bg-indigo-50 text-indigo-500 border-indigo-100'
                  }`}>
                    <FiMessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <p className="text-sm font-bold text-heading leading-snug tracking-tight group-hover:text-primary transition-colors cursor-pointer">{log.question}</p>
                    {/* Responsive fallback metrics tracking block for small viewports */}
                    <div className="flex flex-wrap items-center gap-2 md:hidden">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                        log.source === 'Hospital Database' ? 'bg-success-bg text-success border-success/10' : 'bg-info-bg text-info border-info/10'
                      }`}>{log.source}</span>
                      <span className="text-[10px] text-secondary/80 font-bold">{log.dateTime}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Search Pipeline Matching Source Label */}
                <div className="hidden md:block col-span-2 text-left">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border select-none ${
                    log.source === 'Hospital Database' 
                      ? 'bg-success-bg text-success border-success/10' 
                      : 'bg-info-bg text-info border-info/10'
                  }`}>
                    {log.source}
                  </span>
                </div>

                {/* Column 3: Expiration Context Timestamp Ledger */}
                <div className="hidden md:block col-span-2 text-left text-xs font-bold text-heading/80">
                  {log.dateTime}
                </div>

                {/* Column 4: Inline Component Configuration Multi-Trigger */}
                <div className="col-span-1 flex justify-end">
                  <button 
                    type="button"
                    onClick={() => {
                      /* =================================────────────────=========================
                         === 📝 BACKEND INTEGRATION NOTE: TRIGGER SESSION LOG PURGE ACTIONS ===
                         ==========================================================================
                         await api.delete(`/chat/history/remove/${log.id}`);
                      ========================================================================== */
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary/50 hover:text-heading hover:bg-white border border-transparent hover:border-border-default hover:shadow-sm transition-all focus:outline-none"
                  >
                    <FiMoreVertical className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 🔢 PAGINATION MATRIX SELECTOR GRID FOOTER                */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 px-1 select-none">
        <span className="text-xs font-bold text-secondary/90">
          Showing 1 to {historyLogs.length} of 48 conversations
        </span>
        
        <div className="flex items-center gap-1.5">
          <button 
            type="button" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="w-8 h-8 rounded-lg border border-border-default bg-white flex items-center justify-center text-secondary hover:text-heading disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          
          {[1, 2, 3, '...', 10].map((pageNum, idx) => (
            <button
              key={idx}
              type="button"
              disabled={pageNum === '...'}
              onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg border text-xs font-extrabold shadow-sm transition-all ${
                currentPage === pageNum 
                  ? 'bg-primary text-white border-primary shadow-card' 
                  : pageNum === '...' ? 'border-transparent bg-transparent text-secondary cursor-default shadow-none' : 'bg-white border-border-default text-heading hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button 
            type="button"
            onClick={() => setCurrentPage(p => p + 1)}
            className="w-8 h-8 rounded-lg border border-border-default bg-white flex items-center justify-center text-secondary hover:text-heading transition-all shadow-sm"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </motion.div>
  );
}
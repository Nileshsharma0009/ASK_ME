import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiTrash2, FiMessageSquare, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

/* ==========================================================================
   MAIN COMPONENT: HistoryView
   Displays a tabular, searchable, paginated log of past chat records.
   ========================================================================== */
export default function HistoryView() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const isGuest = auth?.user?.isGuest === true;

  const [historyLogs, setHistoryLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (isGuest) {
      setIsLoading(false);
      return;
    }

    const loadConversationHistory = async () => {
      try {
        setIsLoading(true);
        /* ==========================================================================
           TODO: BACKEND_INTEGRATION
           Ensure your Express route GET '/chat/history' handles these exact query parameters:
           - req.query.page (integer)
           - req.query.search (string filter matched via Mongoose using regex on message text/title)
           
           Expected API Response JSON Structure:
           {
             "logs": [ { "id": "...", "question": "...", "updatedAt": "..." } ],
             "pagination": { "page": 1, "limit": 10, "total": 45, "totalPages": 5 }
           }
           ========================================================================== */
        const response = await api.get('/chat/history', {
          params: {
            page: currentPage,
            search: searchQuery,
          },
        });

        setHistoryLogs(response.data.logs || []);
        setPagination(
          response.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
          }
        );
      } catch (err) {
        console.error('Operational error loading history lines from database cluster:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversationHistory();
  }, [currentPage, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150, damping: 22 } },
  };

  const formatDateTime = (value) =>
    new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const openConversation = (id) => {
    navigate(`/chat?chatId=${id}`);
  };

  const deleteConversation = async (id) => {
    try {
      /* ==========================================================================
         TODO: BACKEND_INTEGRATION
         Ensure backend exposes DELETE '/chat/history/:id' to remove specific chats.
         ========================================================================== */
      await api.delete(`/chat/history/${id}`);
      setHistoryLogs((prev) => prev.filter((log) => log.id !== id));
      setPagination((prev) => ({
        ...prev,
        total: Math.max(prev.total - 1, 0),
      }));
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const clearAllHistory = async () => {
    try {
      /* ==========================================================================
         TODO: BACKEND_INTEGRATION
         Ensure backend exposes a bulk DELETE '/chat/history' endpoint for clearing
         the current authenticated user's whole historical log collection safely.
         ========================================================================== */
      await api.delete('/chat/history');
      setHistoryLogs([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        totalPages: 1,
      }));
    } catch (err) {
      console.error('Failed to clear conversation history:', err);
    }
  };

  const visiblePages = Array.from(
    { length: Math.min(pagination.totalPages, 5) },
    (_, idx) => idx + 1
  );

  if (isGuest) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-card-bg border border-border-default rounded-card shadow-card text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-border-default shadow-sm text-secondary mb-2">
          <FiClock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-extrabold text-heading">History Unavailable</h3>
        <p className="text-sm text-secondary font-medium leading-relaxed">
          Chat history features are not available during guest sessions. Please create a permanent account or log in with your credentials to save and retrieve past conversations.
        </p>
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
        >
          Return to Chat
        </button>
      </div>
    );
  }

  return (
    /* ==========================================================================
       UI BLOCK: MAIN CONTAINER FRAMEWORK
       ========================================================================== */
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-5 text-left pb-8 antialiased font-medium text-body"
    >
      {/* HEADER SECTION: Title Typography Block */}
      <div>
        <h3 className="text-xl font-extrabold text-heading tracking-tight">Conversation History</h3>
        <p className="text-xs font-semibold text-secondary mt-0.5">View, reopen, and delete your saved VANI chats</p>
      </div>

      {/* ==========================================================================
         UI BLOCK: CONSOLE FILTERS LAYER
         Hosts live string parsing search-input fields alongside bulk deletion triggers.
         ========================================================================== */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">

        {/* FILTER COMPONENT: Search Input Wrapper */}
        <div className="relative w-full sm:max-w-sm group">
          <FiSearch className="absolute left-4 top-3 text-secondary/70 group-focus-within:text-primary transition-colors duration-150 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => {
              setCurrentPage(1); // Reset page selection on active input mutations
              setSearchQuery(e.target.value);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-card-bg border border-border-default rounded-xl text-sm placeholder-placeholder/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium shadow-sm"
          />
        </div>

        {/* FILTER COMPONENT: Bulk Destruction Command Interface Trigger */}
        <button
          type="button"
          onClick={clearAllHistory}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-border-default rounded-xl text-sm font-bold text-heading hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      {/* ==========================================================================
         UI BLOCK: TABULAR DATAGRID MATRIX CARD
         Manages layout viewports for loading blocks, zero-state vectors, or rows.
         ========================================================================== */}
      <div className="bg-card-bg rounded-card border border-border-default shadow-card overflow-hidden">

        {/* DATAGRID ROW: Structural Column Title Headers */}
        <div className="grid grid-cols-12 bg-slate-50/70 border-b border-border-default/60 px-6 py-3.5 text-xs font-bold text-secondary uppercase tracking-wider select-none">
          <div className="col-span-12 md:col-span-7 text-left">Question</div>
          <div className="hidden md:block col-span-2 text-left">Type</div>
          <div className="hidden md:block col-span-3 text-left">Updated</div>
        </div>

        {/* DATAGRID ENTRIES AREA: Vertical Mapped Row Blocks */}
        <div className="divide-y divide-border-default/50">

          {isLoading ? (
            /* DATA RENDER WORKFLOW A: Active Pending API Request Pulse Overlay */
            <div className="p-12 text-center text-sm font-bold text-secondary animate-pulse">
              Loading saved conversations...
            </div>
          ) : historyLogs.length === 0 ? (
            /* DATA RENDER WORKFLOW B: Zero Records Returned Empty Condition */
            <div className="p-12 text-center text-sm font-bold text-secondary">
              No saved chat history found for this account.
            </div>
          ) : (
            /* DATA RENDER WORKFLOW C: Operational Array Traversal Matrix Mapping */
            historyLogs.map((log) => (
              <motion.div
                key={log.id}
                variants={rowVariants}
                className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50/60 transition-colors group relative"
              >
                {/* FIELD ENTRY COLUMN: Primary Naming Title and Icon layout */}
                <div className="col-span-11 md:col-span-7 pr-4 flex items-start gap-4">
                  {/* Decorative Entry Icon Wrapper */}
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm border mt-0.5 bg-primary/5 text-primary border-primary/10">
                    <FiMessageSquare className="w-3.5 h-3.5" />
                  </div>
                  {/* Title Selection Link wrapper block */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <button
                      type="button"
                      onClick={() => openConversation(log.id)}
                      className="text-sm font-bold text-heading leading-snug tracking-tight group-hover:text-primary transition-colors text-left"
                    >
                      {log.question}
                    </button>
                    {/* RESPONSIVE RECONCILIATION: Responsive Sub-labels (Mobile View Only) */}
                    <div className="flex flex-wrap items-center gap-2 md:hidden">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide bg-success-bg text-success border-success/10">
                        Saved Chat
                      </span>
                      <span className="text-[10px] text-secondary/80 font-bold">
                        {formatDateTime(log.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FIELD ENTRY COLUMN: Session Classification Category (Desktop Only) */}
                <div className="hidden md:block col-span-2 text-left">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-xl border select-none bg-success-bg text-success border-success/10">
                    Saved Chat
                  </span>
                </div>

                {/* FIELD ENTRY COLUMN: Dynamic Calendar ISO Date Parser (Desktop Only) */}
                <div className="hidden md:block col-span-2 text-left text-xs font-bold text-heading/80">
                  {formatDateTime(log.updatedAt)}
                </div>

                {/* FIELD ENTRY COLUMN: Focused Item Interactive Action Deletion Trigger */}
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deleteConversation(log.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary/50 hover:text-heading hover:bg-white border border-transparent hover:border-border-default hover:shadow-sm transition-all focus:outline-none"
                    aria-label="Delete entry"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ==========================================================================
         UI BLOCK: CONSOLE CONTEXT FOOTER / ACTIVE PAGINATION BAR
         Coordinates record indicators against dynamic index array navigators.
         ========================================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 px-1 select-none">

        {/* PAGINATION INFOBAR: Mapped Metadata Total Records Counter */}
        <span className="text-xs font-bold text-secondary/90">
          Showing {historyLogs.length} of {pagination.total} conversations
        </span>

        {/* PAGINATION CONTROLS: Navigational Arrow and Numerical Page Grid Wrapper */}
        <div className="flex items-center gap-1.5">
          {/* CONTROL: Step-Backward Decrement Arrow Button */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="w-8 h-8 rounded-lg border border-border-default bg-white flex items-center justify-center text-secondary hover:text-heading disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          {/* CONTROL GRID: Mapped Loop Index Numerical Buttons */}
          {visiblePages.map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg border text-xs font-extrabold shadow-sm transition-all ${currentPage === pageNum
                  ? 'bg-primary text-white border-primary shadow-card'
                  : 'bg-white border-border-default text-heading hover:bg-slate-50'
                }`}
            >
              {pageNum}
            </button>
          ))}

          {/* CONTROL: Step-Forward Increment Arrow Button */}
          <button
            type="button"
            disabled={currentPage >= pagination.totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination.totalPages))}
            className="w-8 h-8 rounded-lg border border-border-default bg-white flex items-center justify-center text-secondary hover:text-heading disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
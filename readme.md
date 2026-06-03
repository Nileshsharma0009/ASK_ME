ASK_ME/                              # Project Root Workspace
│
├── backend/                         # SERVER-SIDE LAYER (Node.js / Express)
│   ├── data/                        # Document Storage (STRICTLY ADD TO .gitignore)
│   │   ├── raw/                     # Original clinical PDFs, manuals, protocols
│   │   └── processed/               # Cached/cleaned intermediate JSON data
│   │
│   ├── src/
│   │   ├── config/                  # Third-party configurations & connection keys
│   │   │   ├── db.js                # MongoDB Mongoose connection client
│   │   │   └── gemini.js            # Gemini LLM & Text Embedding instantiation
│   │   │
│   │   ├── models/                  # Operational Mongoose Database Schemas
│   │   │   ├── User.js              # Schema for Doctors, Staff, and Administrators
│   │   │   └── ChatHistory.js       # Stores chat memory sessions for context recall
│   │   │
│   │   ├── services/                # CORE AI ENGINE (Zero Express dependencies)
│   │   │   ├── ingestion.service.js # PDF parsing & LangChain recursive text splitting
│   │   │   ├── vector.service.js    # Document indexing & Atlas Vector Search queries
│   │   │   └── rag.service.js       # LCEL compilation pairing Gemini + Context
│   │   │
│   │   ├── controllers/             # Request Controllers (Validates payload data)
│   │   │   ├── auth.controller.js   # Logic for staff onboarding and login
│   │   │   └── rag.controller.js    # Triggers file processing and query generations
│   │   │
│   │   ├── routes/                  # Express Routing Configurations
│   │   │   ├── auth.routes.js       # /api/auth/register, /api/auth/login
│   │   │   └── rag.routes.js        # /api/rag/query, /api/rag/upload
│   │   │
│   │   ├── middleware/              # Security and Error Traps
│   │   │   ├── auth.middleware.js   # Intercepts routes to validate JWT staff keys
│   │   │   └── error.middleware.js  # Global failure catcher (prevents system crashes)
│   │   │
│   │   └── app.js                   # Express application setup (CORS, Parsers)
│   │
│   ├── .env                         # Server environment variables (Secret keys)
│   ├── package.json                 # Backend dependency registry
│   └── server.js                    # Core entry point (Listens on port)
│
├── frontend/                        # CLIENT-SIDE LAYER (React.js + Tailwind CSS)
│   ├── public/                      # Static assets (Hospital logos, icons)
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/                  # Local system images or styling resources
│   │   │   └── styles.css           # Core Tailwind injections
│   │   │
│   │   ├── components/              # Reusable UI Blocks (Presentation Layer)
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.jsx      # Portal navigation (Chat, Settings, Dashboard)
│   │   │   │   └── Navbar.jsx       # Staff profile management header
│   │   │   ├── Chat/
│   │   │   │   ├── ChatBox.jsx      # Primary interactive chat container
│   │   │   │   ├── MessageItem.jsx  # Individual query or response chat bubbles
│   │   │   │   └── SourceBadge.jsx  # Links referencing matching document PDFs
│   │   │   └── Upload/
│   │   │       └── FileDropzone.jsx # File upload component for new medical documents
│   │   │
│   │   ├── context/                 # Global UI State Managers
│   │   │   ├── AuthContext.jsx      # Persists user sessions across pages
│   │   │   └── ChatContext.jsx      # Manages current active conversation threads
│   │   │
│   │   ├── hooks/                   # Custom business logic React hooks
│   │   │   ├── useAuth.js           # Wraps login/logout operations
│   │   │   └── useRagStream.js      # Handles text response streams from backend
│   │   │
│   │   ├── services/                # API Client Interface (Axios config)
│   │   │   └── api.js               # Central Axios client targeting backend endpoints
│   │   │
│   │   ├── views/                   # Full Screen Views (Pages)
│   │   │   ├── LoginView.jsx        # Login interface for hospital personnel
│   │   │   ├── ChatDashboard.jsx    # Split-screen view for context chats
│   │   │   └── AdminKnowledge.jsx   # Document dashboard to update internal files
│   │   │
│   │   ├── App.jsx                  # Main component defining React Router paths
│   │   └── main.jsx                 # Vite application entry anchor
│   │
│   ├── .env                         # Public application environment variables
│   ├── package.json                 # Frontend dependency registry
│   ├── tailwind.config.js           # Styling design configurations
│   └── vite.config.js               # Build configurations (Vite engine)
│
├── .gitignore                       # Master git ignore configuration
└── README.md                        # Project technical documentation
Here is a clean, production-ready **README.md** section that you can copy and paste directly into your project. It summarizes your architecture, tech stack, and the UI component responsibilities.

---

```markdown
# ASK_ME - Clinical RAG Engine

A full-stack Retrieval-Augmented Generation (RAG) platform designed for healthcare professionals to query clinical documentation, protocols, and medical knowledge bases securely.

## 🧬 System Architecture & Data Flow


```

[ User Interface ] ──(Clinical Query)──► [ Express Backend ]
│
┌──────────────────────────────────────────────┴──────────────────────────────┐
▼ (Phase 1: Embedding)                                                        ▼ (Phase 2: Retrieval)
[ Google GenAI ] ──(text-embedding-004)──► [ Vector Matrix ] ──(Cosine Match)──► [ Pinecone DB ]
│
┌─────────────────────────────────────────────────────────────────────────────┘
▼ (Phase 3: Context Injection)
[ Gemini 2.5 Flash ] ──(Strict Prompt Inference)──► [ Structured String Jawab ]
│
▼
[ Chat Viewport ] ◄──(Typewriter Animation Stream)─── [ MongoDB Save ]

```

1. **Capture:** The user enters a question into the front-end interface.
2. **Orchestration:** The Express server authenticates the session and initiates the RAG sequence.
3. **Vectorization:** Google's `text-embedding-004` converts the plain-text query into a high-dimensional semantic vector.
4. **Retrieval:** The query vector is matched against indexed PDF chunks inside a **Pinecone Vector Database** using cosine similarity to extract the top 10 relevant context blocks.
5. **Generation:** **Gemini 2.5 Flash** processes a consolidated, restricted prompt containing both the fetched document context and the original question.
6. **Persistence & Stream:** The structured response is permanently committed to **MongoDB** for session history and sent back to the client UI to be rendered using a typewriter typing simulation.

---

## 🛠️ Project Structure & Component Matrix

### 1. Front-End Architecture (`/src/components`)
* **`ChatPanel.jsx`**: Coordinates input submission states, handles abort controller actions (`AbortController`), toggles loading animations (`ThinkingPulse`), and renders typewriter text output loops.
* **`HistoryView.jsx`**: Manages paginated server-side lookups, contextual regex string filtering, individual thread removal, and bulk data truncation triggers.
* **`ProfileView.jsx`**: Handles authentication state mapping, user avatar profile imagery routing, and two-factor protocol state switches.
* **`SettingsView.jsx`**: Controls continuous confidence threshold ranges (similarity limits), response style variants, and persistent client-side UI themes.
* **`DashboardLayout.jsx`**: The master shells layer controlling global app-bar headers, sliding drawer springs (`framer-motion`), and notification alerts.

### 2. Back-End Core (`/server`)
* **`sendMessage` (Controller)**: Orchestrates database thread management, verifies user session contexts, calls the active RAG engine execution thread, and commits history objects to MongoDB collections.
* **`query.js` (`chatting` handler)**: Executes LangChain pipelines, coordinates embedding models, retrieves Pinecone documents, and runs localized prompt isolation blocks on Gemini.

---

## 🎨 Theme & Color Tokens (Tailwind CSS v4)

This platform relies on a strict semantic design token arrangement across light and dark theme configurations:

| Token Class | Use-Case Target Area | Light Value | Dark Value |
| :--- | :--- | :--- | :--- |
| `bg-app-bg` | Global Layout Backdrops | `#F8FAFC` | `#191C27` |
| `bg-card-bg` | Surface Data Cards, Input Bars, Headers | `#FFFFFF` | `#111827` |
| `bg-sidebar-bg` | Persistent Collapsible Navigation Side Drawer | `#FFFFFF` | `#0F172A` |
| `text-heading` | Titles, Branding Text, Bold Labels | `#111827` | `#F8FAFC` |
| `text-body` | Conversational Chat Text, Input Values | `#374151` | `#CBD5E1` |
| `text-secondary` | Timestamps, System Status Notes, Icons | `#6B7280` | `#94A3B8` |
| `bg-brand-gradient`| Premium Accents, Identity Branded Avatars | Purple Linear Gradient (`#6C4DFF` to `#8B6CFF`) |

```
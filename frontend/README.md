# ASK_ME Frontend - Healthcare AI Assistant UI

Beautiful, modern React frontend for the ASK_ME healthcare AI assistant.

## 🎨 Design System

### Brand Colors (Tailwind Custom Colors)
- **Primary Purple**: `#6C4DFF` (primary)
- **Primary Dark**: `#4F2FFF` (primary-dark)  
- **Primary Light**: `#F3F0FF` (primary-light)
- **Muted Purple**: `#8B6CFF` (primary-muted)

### Status Colors
- **Success**: `#22C55E` (success)
- **Info**: `#3B82F6` (info)
- **Warning**: `#F59E0B` (warning)
- **Error**: `#EF4444` (error)

### Backgrounds
- **App Background**: `#F8FAFC` (app-bg)
- **Card Background**: `#FFFFFF` (card-bg)
- **Sidebar Background**: `#FFFFFF` (sidebar-bg)

See `tailwind.config.js` for full color system and custom components.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output in `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles.css         # Tailwind CSS injections
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   ├── Chat/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── MessageItem.jsx
│   │   │   └── SourceBadge.jsx
│   │   └── Upload/
│   │       └── FileDropzone.jsx
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state management
│   │   └── ChatContext.jsx     # Chat state management
│   ├── hooks/
│   │   ├── useAuth.js          # Auth hook
│   │   └── useRagStream.js     # Streaming hook
│   ├── services/
│   │   └── api.js              # Axios API client with interceptors
│   ├── views/
│   │   ├── LoginView.jsx       # Login page
│   │   ├── ChatDashboard.jsx   # Main chat interface
│   │   └── AdminKnowledge.jsx  # Register/Admin panel
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Vite entry point
│   └── index.html
├── .env                        # Environment variables
├── package.json
├── tailwind.config.js          # Tailwind custom colors & theme
├── vite.config.js
└── README.md
```

## 🔐 Environment Variables

Create `.env` file in frontend root:

```
VITE_API_BASE=http://localhost:4000/api
```

For production, update to your production API endpoint.

## 🎯 Authentication Flow

1. **Login Page** (`/`)
   - Username & password input
   - "Remember me" checkbox
   - "Forgot password?" link
   - Register link to `/register`

2. **Register Page** (`/register`)
   - Full name, email, password, confirm password
   - Account creation with validation

3. **Protected Routes**
   - `/chat` - Main chat dashboard (requires auth)
   - Auto-redirects to login if not authenticated
   - Persists session in localStorage

4. **Logout**
   - Clears token and user data
   - Redirects to login

## 🎬 Animation Libraries

- **Framer Motion**: Page transitions, component animations
- **GSAP**: Advanced sequential animations
- **React Icons**: Icon library (FiMail, FiLock, MdShield, etc.)

## 📦 Key Dependencies

- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client with interceptors
- **framer-motion**: Animations
- **gsap**: Advanced animations
- **react-icons**: Icon library
- **tailwindcss**: CSS framework

## 🔧 API Integration

### API Base URL
Configured in `.env` → `VITE_API_BASE`

### Endpoints Used (Frontend calls)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /rag/query` - Submit query to RAG
- `POST /rag/upload` - Upload documents

### Request/Response Format
All requests include `Authorization: Bearer {token}` header (set by axios interceptor)

```javascript
// Example API call from within component
import api from '../services/api';

const response = await api.post('/auth/login', {
  username: 'user@hospital.com',
  password: 'password123'
});
```

## 🛠️ Development Tips

### Adding New Components
Place in `src/components/` subdirectory matching the feature

### Adding New Pages
Create in `src/views/`, add route in `App.jsx`

### Styling
- Use Tailwind classes with custom colors defined in `tailwind.config.js`
- For complex animations, use Framer Motion or GSAP
- Refer to custom color names: `bg-primary`, `text-heading`, `border-active`, etc.

### State Management
- **AuthContext**: User login, token, authentication status
- **ChatContext**: Current conversation, messages
- **useAuth()**: Hook to access auth context
- **useRagStream()**: Hook for streaming RAG responses

## 🐛 Troubleshooting

### API calls failing with 401
- Check `.env` `VITE_API_BASE` URL
- Ensure backend is running on correct port
- Check localStorage for valid token

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear `node_modules` and reinstall if issues persist
- Check `vite.config.js` for correct React plugin

### Styling not applying
- Ensure Tailwind CSS is imported in `src/assets/styles.css`
- Verify `index.html` includes `<div id="root"></div>`
- Check `tailwind.config.js` content paths

## 📝 Notes for Backend Developer

The frontend expects the backend to provide:
1. JWT token in login response
2. User object with `name`, `email`, `role` fields
3. Proper error messages in response body
4. 401 status for unauthorized access (triggers auto-logout)

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

---

Built with ❤️ for ASK_ME Healthcare Platform

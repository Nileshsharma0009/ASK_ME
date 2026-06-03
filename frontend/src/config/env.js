function requireEnv(key) {
  const value = import.meta.env[key];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing ${key}. Copy frontend/.env.example to frontend/.env and set all values.`
    );
  }
  return value;
}

const chatRoute = requireEnv('VITE_ROUTE_CHAT');

export const env = {
  apiBase: requireEnv('VITE_API_BASE'),
  routes: {
    login: requireEnv('VITE_ROUTE_LOGIN'),
    register: requireEnv('VITE_ROUTE_REGISTER'),
    chat: chatRoute,
    profile: `${chatRoute}/profile`,
    settings: `${chatRoute}/settings`,
  },
  /** When true, logged-in users hitting / or /register are sent to chat. Keep false to avoid surprise redirects from stale localStorage. */
  autoRedirectAuthenticated:
    import.meta.env.VITE_AUTO_REDIRECT_AUTHENTICATED === 'true',
  /** Path after successful login; leave empty to stay on the login page. */
  postLoginPath: import.meta.env.VITE_POST_LOGIN_PATH?.trim() ?? '',
};

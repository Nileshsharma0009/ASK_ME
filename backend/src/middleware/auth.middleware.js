// ============================================
// AUTH MIDDLEWARE - JWT Verification
// ============================================
// TODO: Verify JWT token on protected routes

function authMiddleware(req, res, next) {
  // TODO: Extract token from Authorization header
  // TODO: Verify token with JWT secret
  // TODO: Attach user to req.user
  // TODO: Call next() if valid, send 401 if invalid
}

module.exports = authMiddleware;

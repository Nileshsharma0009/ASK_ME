import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id, isGuest: decoded.isGuest || false };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default authMiddleware;

// backend/src/middleware/roleMiddleware.js

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    console.log(req.user);
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Access denied. You don't have permission to perform this action.",
        requiredRole: allowedRoles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

// Specific role checks
export const isAdmin = authorize("admin");
export const isEditorOrAdmin = authorize("admin", "editor");
export const canView = authorize("admin", "editor", "viewer");

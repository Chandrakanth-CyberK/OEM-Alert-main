const authorize = (requiredPermissions = []) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      // Admin users have all permissions
      if (user.role === 'admin') {
        return next();
      }

      // Check if user has required permissions
      const hasPermission = requiredPermissions.every(permission => 
        user.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to access this resource.',
          required: requiredPermissions,
          current: user.permissions
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Authorization failed.',
        error: error.message
      });
    }
  };
};

module.exports = authorize;
const IAMService = require('../services/iam');

const iam = new IAMService();

const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!iam.hasPermission(req.user.role, permission)) {
      iam.auditLog('UNAUTHORIZED_ACCESS', req.user, req.path, 'DENIED');
      
      return res.status(403).json({ 
        success: false, 
        message: `Insufficient permissions. Required: ${permission}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    iam.auditLog('AUTHORIZED_ACCESS', req.user, req.path, 'GRANTED');
    next();
  };
};

module.exports = { requirePermission, iam };

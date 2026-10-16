const jwt = require('jsonwebtoken');
const SystemLog = require('../models/SystemLog');

const shouldSkipPath = (path) => {
  if (!path) return true;
  return (
    path.startsWith('/api/logs') ||
    path.startsWith('/logs') ||
    path.includes('/auth/me') ||
    path.includes('/health') ||
    path.startsWith('/api/public') ||
    path.startsWith('/public')
  );
};

const resolveUser = (req) => {
  if (req.user) return req.user;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      return jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch {
      return null;
    }
  }
  return null;
};

const auditLogger = (req, res, next) => {
  const method = req.method ? req.method.toUpperCase() : '';
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  const path = req.originalUrl || req.url || '';

  if (!isStateChanging || shouldSkipPath(path)) {
    return next();
  }

  res.on('finish', async () => {
    try {
      const user = resolveUser(req);
      const statusCode = res.statusCode;
      const isError = statusCode >= 400;
      const category = isError ? 'SERVER_ERROR' : 'USER_ACTIVITY';
      const severity = statusCode >= 500 ? 'CRITICAL' : isError ? 'ERROR' : 'INFO';
      const message = `${method} ${path} [Status: ${statusCode}]`;

      await SystemLog.create({
        school_id: user?.school_id || null,
        school_name: user?.school_name || 'Global / System',
        user_id: user?.id || null,
        user_name: user?.name || 'Anonymous User',
        user_role: user?.role || 'Guest',
        category,
        severity,
        message,
        page_url: req.headers.referer || '',
        last_clicked_element: req.headers['x-client-action'] || '',
        endpoint: path,
        method,
        status_code: statusCode,
        metadata: {
          ip: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent']
        }
      });
    } catch {}
  });

  next();
};

module.exports = auditLogger;

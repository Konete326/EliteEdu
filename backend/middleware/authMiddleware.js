const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

authMiddleware.protect = authMiddleware;
authMiddleware.authMiddleware = authMiddleware;
authMiddleware.roleMiddleware = roleMiddleware;

module.exports = authMiddleware;
module.exports.protect = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.roleMiddleware = roleMiddleware;

const passport = require('../config/passport.config');
const authJWT = passport.authenticate('jwt', { session: false });

const authRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authJWT,
  authRoles,
};

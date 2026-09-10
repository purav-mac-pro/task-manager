const jwt = require('jsonwebtoken');
const { decrypt } = require('../utils/tokenEncryption');

const COOKIE_NAME = 'auth_token';

const auth = (req, res, next) => {
  const encryptedToken = req.cookies ? req.cookies[COOKIE_NAME] : undefined;

  if (!encryptedToken) {
    return res.status(401).json({
      msg: 'No token',
    });
  }

  let token;

  try {
    token = decrypt(encryptedToken);
  } catch (err) {
    return res.status(401).json({
      msg: 'Invalid token',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      msg: 'Invalid token',
    });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: 'Access denied: ' + req.user.role,
      });
    }

    next();
  };
};

module.exports = {
  auth,
  checkRole,
  COOKIE_NAME,
};
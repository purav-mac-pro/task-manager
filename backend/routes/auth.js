const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, checkRole, COOKIE_NAME } = require('../middleware/auth');
const { encrypt } = require('../utils/tokenEncryption');

const TOKEN_EXPIRY = '1d';
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY,
    }
  );
};

const userResponse = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: TOKEN_MAX_AGE_MS,
  path: '/',
});

const setAuthCookie = (res, user) => {
  const token = createToken(user);
  const encryptedToken = encrypt(token);
  res.cookie(COOKIE_NAME, encryptedToken, cookieOptions());
};

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
      });
    }

    const ok = await bcrypt.compare(
      password,
      user.password
    );

    if (!ok) {
      return res.status(400).json({
        msg: 'Invalid password',
      });
    }

    setAuthCookie(res, user);
    
    res.json({
      user: userResponse(user),
    });

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
});

// REGISTER ADMIN
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await User.findOne({
      role: 'admin',
    });

    if (adminExists) {
      return res.status(403).json({
        msg: 'Signup disabled. Admin can log in.',
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: 'admin',
    });

    setAuthCookie(res, user);

    res.json({
      user: userResponse(user),
    });

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
});


// CURRENT USER
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        msg: 'User not found',
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.json({
    msg: 'Logged out',
  });
});

// EMPLOYEES
router.get(
  '/employees',
  auth,
  checkRole('admin', 'manager'),
  async (req, res) => {
    try {
      const employees = await User.find({
        role: 'employee',
      }).select('name email _id');

      res.json(employees);

    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  }
);

module.exports = router;
const router = require('express').Router();
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const { auth, checkRole } = require('../middleware/auth');

//users
router.get('/users', auth, checkRole('admin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.post('/create-user', auth, checkRole('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc || roleDoc.name === 'admin') {
      return res.status(400).json({ msg: 'Invalid role selected' });
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: 'Email exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: roleDoc.name });
    res.json(user);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.patch('/users/:id/role', auth, checkRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (req.params.id === req.user.id) {
      return res.status(400).json({ msg: "You can't change your own role" });
    }

    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(400).json({ msg: 'That role does not exist' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: roleDoc.name },
      { returnDocument: 'after' }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// NEW — delete a user
router.delete('/users/:id', auth, checkRole('admin'), async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ msg: "You can't delete your own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ msg: 'Admin accounts cannot be deleted from here' });
    }

    await user.deleteOne();
    res.json({ msg: 'User deleted' });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

//roles
router.get('/roles', auth, checkRole('admin'), async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json(roles);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.post('/roles', auth, checkRole('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ msg: 'Role name is required' });
    }

    const normalized = name.trim().toLowerCase();
    const exists = await Role.findOne({ name: normalized });
    if (exists) {
      return res.status(400).json({ msg: 'Role already exists' });
    }

    const role = await Role.create({ name: normalized, description });
    res.json(role);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.delete('/roles/:id', auth, checkRole('admin'), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ msg: 'Role not found' });
    }

    if (role.isSystem) {
      return res.status(400).json({ msg: 'This is a built-in role and cannot be deleted' });
    }

    const inUse = await User.exists({ role: role.name });
    if (inUse) {
      return res.status(400).json({ msg: 'Cannot delete a role that is assigned to users' });
    }

    await role.deleteOne();
    res.json({ msg: 'Role deleted' });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
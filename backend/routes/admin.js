const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { auth, checkRole } = require('../middleware/auth');

router.get('/users', auth, checkRole('admin'), async (req,res)=>{
  const users = await User.find().sort({createdAt:-1});
  res.json(users);
});

router.post('/create-user', auth, checkRole('admin'), async (req,res)=>{
  const {name,email,password,role} = req.body;
  if(!['employee','manager'].includes(role)) return res.status(400).json({msg:'Only employee/manager'});
  const exist = await User.findOne({email});
  if(exist) return res.status(400).json({msg:'Email exists'});
  const hash = await bcrypt.hash(password,10);
  const user = await User.create({name,email,password:hash,role});
  res.json(user);
});

module.exports = router;

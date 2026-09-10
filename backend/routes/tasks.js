const router = require('express').Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

router.post('/', auth, checkRole('admin','manager'), async (req,res)=>{
  const {title, description, assignedTo}=req.body;
  const u = await User.findById(assignedTo);
  if(!u) return res.status(404).json({msg:'User not found'});
  if(req.user.role==='manager' && u.role!=='employee'){
    return res.status(403).json({msg:'Manager can assign only to employee'});
  }
  const task = await Task.create({title, description, assignedTo, createdBy:req.user.id});
  res.json(task);
});

router.get('/', auth, async (req,res)=>{
  let tasks;
  if(req.user.role==='employee'){
    tasks = await Task.find({assignedTo:req.user.id}).populate('assignedTo').sort({createdAt:-1});
  }else{
    tasks = await Task.find().populate('assignedTo').sort({createdAt:-1});
  }
  res.json(tasks);
});

router.put('/:id', auth, async (req,res)=>{
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
  res.json(task);
});

router.delete('/:id', auth, checkRole('admin'), async (req,res)=>{
  await Task.findByIdAndDelete(req.params.id);
  res.json({msg:'Deleted'});
});

module.exports = router;
const express = require("express");
const User = require("../models/User");
const {auth, checkRole} = require("../middleware/auth");
const router = express.Router();

// Get all users - manager
router.get("/", auth, checkRole("manager","admin"), async(req,res)=>{
  try{
    const users = await User.find().select("-password");
    res.json(users);
  }catch(e){ res.status(500).json({msg:e.message}); }
});

module.exports = router;
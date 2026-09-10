const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  title: {type:String, required:true},
  description: String,
  status: {type:String, default:'pending'},
  remark: {type:String, default:''},
  assignedTo: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
},{timestamps:true});
module.exports = mongoose.model('Task', taskSchema);
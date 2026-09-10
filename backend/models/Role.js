const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }, 
  description: String
}, { timestamps: true });
module.exports = mongoose.model('Role', roleSchema);
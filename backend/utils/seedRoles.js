const Role = require('../models/Role');
const DEFAULT_ROLES = [
  { name: 'admin', description: 'Full system access', isSystem: true },
  { name: 'manager', description: 'Can manage employees and assign tasks', isSystem: true },
  { name: 'employee', description: 'Can view and update own assigned tasks', isSystem: true },
];

async function seedRoles() {
  for (const role of DEFAULT_ROLES) {
    await Role.findOneAndUpdate(
      { name: role.name },
      { $setOnInsert: role },
      { upsert: true, returnDocument: 'after'}
    );
  }
}

module.exports = seedRoles;
const Role = require('../models/Role');

async function initializeRoles() {
  const roles = ["moderator", "user"];

  for (let roleName of roles) {
    try {
      const roleExists = await Role.findOne({ name: roleName });

      if (!roleExists) {
        const newRole = new Role({ name: roleName });
        await newRole.save();
        console.log(`Rol ${roleName} created successfully.`);
      }
    } catch (err) {
      console.error(`Error creating rol ${roleName}:`, err);
    }
  }
}

module.exports = initializeRoles;

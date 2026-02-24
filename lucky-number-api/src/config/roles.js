const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['user']);
roleRights.set(roles[1], ['user', 'getUsers', 'manageUsers']);

module.exports = {
  roles,
  roleRights,
};

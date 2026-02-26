const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const funcRoleRoute = require('./funcRole.route');
const healthCheckRoute = require('./health-check.route');
const uiRoleRoute = require('./uiRole.route');
const participantRoute = require('./participant.route');
const superAdminRoute = require('./super-admin.route');
const { setupDir } = require('../../common/funcs');
// New Route import go here

const router = express.Router();

const defaultRoutes = [
  {
    path: '/funcRoles',
    route: funcRoleRoute
  },
  {
    path: '/uiRoles',
    route: uiRoleRoute
  },
  // New Route go here
  {
    path: '/participants',
    route: participantRoute
  },
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/super-admin',
    route: superAdminRoute
  },
  {
    path: '/health-check',
    route: healthCheckRoute
  }
];

defaultRoutes.forEach((route) => {
  setupDir(`public/${route.path}`);
  router.use(route.path, route.route);
});

module.exports = router;

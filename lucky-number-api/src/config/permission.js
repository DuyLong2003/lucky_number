const permission = {
  // UiRole module permisstion
  UIROLE: {
    GET_UIROLE: 'get_uiRole',
    MANAGE_UIROLE: 'manage_uiRole',
    DELETE_UIROLE: 'delete_uiRole'
  },
  // new permistion in here
  FUNCROLE: {
    GET_FUNCROLE: 'get_funcRole',
    MANAGE_FUNCROLE: 'manage_funcRole',
    DELETE_FUNCROLE: 'delete_funcRole'
  },
  // user module for admin permistion
  USER: {
    GET_USER: 'get_user',
    MANAGE_USER: 'manage_user',
    DELETE_USER: 'delete_user'
  }
};

const USER_ROLE_ID = '64219f3c97791c0e10e3216d';

const permissionArr = Object.values(permission).reduce((pNow, pCurren) => {
  let pNowTemp = pNow;
  if (typeof pNow === 'object') {
    pNowTemp = Object.values(pNow);
  }
  return [...pNowTemp, ...Object.values(pCurren)];
});
module.exports = {
  permission,
  permissionArr,
  USER_ROLE_ID
};

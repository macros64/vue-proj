export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    if (to.meta.roles) {
      const currentRoles = store.getters.getRoles;
      if (!currentRoles) next('/denied');

      const allowedRoles = to.meta.roles;
      const allowed = currentRoles.reduce(
        (isAllowed, current) => (isAllowed |= allowedRoles.includes(current)),
        false
      );
      if (allowed) next();
      else next('/denied');
    }
    next();
  });
};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ msg: 'Forbidden: No user role found' });
    }

    const rolesArray = [...allowedRoles];
    const hasRole = rolesArray.includes(req.user.role);

    if (!hasRole) {
      return res.status(403).json({ msg: 'Forbidden: You do not have the required role' });
    }

    next();
  };
};

export default roleMiddleware;

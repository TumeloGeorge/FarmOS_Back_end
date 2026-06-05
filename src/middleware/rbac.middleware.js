module.exports = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Placeholder RBAC: allow requests if user is authenticated.
        // Replace with real permission checks once roles/claims are defined.
        next();
    };
};

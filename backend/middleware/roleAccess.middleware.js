// Define the roles and their corresponding permissions
const roles = {
    admin: ['read', 'update', 'delete'],
    staff: ['read'],
    supplier: ['create', 'read', 'update', 'delete'],
};

// Middleware function to check if the user has the required role
function roleAccess(requiredPermission) {
    return (req, res, next) => {
        try {
            // console.debug('--- Role Access Middleware Invoked ---');
            // console.debug('Required Permission:', requiredPermission);

            // Check if `req.user` is defined
            if (!req.user) {
                // console.error('Error: req.user is not defined.');
                return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
            }

            // console.debug('User object:', req.user);

            // Extract user's role
            const userRole = req.user.role;

            if (!userRole) {
                console.log('Error: User role is not defined.');
                return res.status(401).json({ error: 'Unauthorized: User role not found' });
            }

            // console.log('User Role:', userRole);

            // Check if the user's role exists in the roles object
            if (!roles[userRole]) {
                // console.error(`Error: Role "${userRole}" not found in roles configuration.`);
                return res.status(403).json({ error: 'Forbidden: Role does not have any permissions' });
            }

            // console.debug(`Permissions for role "${userRole}":`, roles[userRole]);

            // Check if the user's role includes the required permission
            if (roles[userRole].includes(requiredPermission)) {
                // console.debug('Permission granted. Proceeding to the next middleware.');
                next();
            } else {
                console.error(
                    `Error: Role "${userRole}" does not have the required permission "${requiredPermission}".`
                );
                return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            }
        } catch (err) {
            // console.error('Error in roleAccess middleware:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}

module.exports = roleAccess;

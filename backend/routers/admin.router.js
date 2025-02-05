const router = require('express').Router();
const roleAccess = require('../middleware/roleAccess.middleware');
const { getUsers, companyapprove, companysuspend, supplierreject,dashboarddata } = require('../controller/admin.controller');

// Middleware to check for admin role
const adminRoleAccess = (action) => (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    return roleAccess(action)(req, res, next);
};

router.get('/allusers', adminRoleAccess("read"), getUsers);
router.get('/approve/:id', adminRoleAccess("update"), companyapprove);
router.get('/suspend/:id', adminRoleAccess("update"), companysuspend);
router.delete('/reject/:id', adminRoleAccess("delete"), supplierreject);

router.get('/admin-dashboard', roleAccess("read"),dashboarddata);

module.exports = router;
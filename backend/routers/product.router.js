const router = require("express").Router();
const {upload} = require("../utils/multer");
const {
    fetchproduct,
    addProduct,
    singleproductfetch,
    singleproductupdate,
    deleteproduct,
} = require("../controller/product.controller");
const roleAccess = require("../middleware/roleAccess.middleware");

// Define permissions for each route
router.post(
    "/addproduct",
    roleAccess("create"),
    // Permission required: "create"
    (req, res, next) => {
        if (req.user.userRole == "admin" || req.user.userRole == "staff") {
            return res.status(403).json({ Message: "You are not authorized to perform this action" });
        }
        next();
    },
    upload.array("images", 4),
    addProduct
);

router.get(
    "/fetchproduct",
    roleAccess("read"), // Permission required: "read"
    fetchproduct
);

router.get(
    "/singleproductfetch/:id",
    roleAccess("read"), // Permission required: "read"
    singleproductfetch
);

router.put(
    "/singleproductupdate/:id",
    roleAccess("update"), // Permission required: "update"
    (req, res, next) => {
        if (req.user.userRole == "admin" || req.user.userRole == "staff") {
            return res.status(403).json({ Message: "You are not authorized to perform this action" });
        }
        next();
    },
    upload.array("Images", 4),
    singleproductupdate
);

router.delete(
    "/deleteproduct/:productId",
    roleAccess("delete"), // Permission required: "delete"
    (req, res, next) => {
        if (req.user.userRole == "staff") {
            return res.status(403).json({ Message: "You are not authorized to perform this action" });
        }
        next();
    },
    deleteproduct
);

module.exports = router;

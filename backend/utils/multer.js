// const multer = require('multer');
// const path = require('path');

// // Set up Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../frontend/public');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// let upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 4 } // 4MB
// });

// module.exports = upload;


const multer = require('multer');
// Use memory storage (instead of disk storage)
const storage = multer.memoryStorage();
let upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 4 } // 4MB
});
module.exports = { upload };

const router = require('express').Router()
const {upload} = require('../utils/multer')
const { fetchuser, userupdate, productfetch, cartproducts, singleproductfetch, userbuy, profile } = require('../controller/user.controller')


router.get('/userfetch/:loginemail', fetchuser)
router.put('/update', upload.single("profileimg"), userupdate)
router.get('/homepage', productfetch)
router.post('/cartproducts', cartproducts)
router.get('/singleproductfetch/:id', singleproductfetch)
router.post('/buycheck', userbuy)
router.get('/profile', profile)

module.exports = router
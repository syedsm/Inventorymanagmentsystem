const { Saveorder, userorder } = require('../controller/order.controller')

const router = require('express').Router()

router.post('/saveorder', Saveorder)
router.get('/userorder', userorder)
module.exports = router
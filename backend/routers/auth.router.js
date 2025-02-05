const router = require('express').Router()
const { Router } = require('express')
const { send_otp, verifyotp, resendotp, login, resetpage, forgot_verify_otp, forgot_resend_otp, resetpassword, Googlelogin, FBlogin ,supplierregactivation, supplierverifyotp, staffregactivation, staffverifyotp} = require('../controller/auth.controller')

router.post('/login', login)


// reg Routes
router.post('/sendotp', send_otp)
router.post('/verify_otp', verifyotp)
router.post('/resend_otp', resendotp)

// direct auth Routes
router.post('/Googlelogin', Googlelogin)
router.post('/FBlogin', FBlogin)

// supplier Routes
router.post('/supplierregactivation',supplierregactivation)
router.post('/staffregactivation',staffregactivation)
router.post('/supplier_verify_otp',supplierverifyotp)
router.post('/staff_verify_otp',staffverifyotp)

//forgot password
router.post('/resetpage', resetpage)
router.post('/forgot_verify_otp', forgot_verify_otp)
router.post('/forgot_resend_otp', forgot_resend_otp)
router.post('/reset-password', resetpassword)


module.exports = router
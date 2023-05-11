
const { Router } = require('express')
const adminSchema = require('../models/admin-schema')
let express = require('express')
const usercontroller = require('../controller/usercontroller')
let router = express.Router()
let controller = require('../controller/usercontroller')
let  checkUser = require('../controller/userAunth')
let userSchema= require('../models/user-schema')
const { URLSearchParams } = require('url')

router.get('/',controller.sessionHandeler)
router.get('/logout',(req,res)=>{
     req.session.loggedin = false
     res.redirect('/')
})
router.get('/register',(req,res)=>{

    res.render('users/signup')    
})
router.post('/sighup',controller.adding)
router.post('/otp',controller.otpChecker)
router.post('/login',controller.loginChecker)
router.get('/accountView',controller.accountView)
router.get('/payementVerify',controller.paymentStatusChanger,controller.accountView)

router.get('/index-2',controller.sessionHandeler)
router.get('/checkout',controller.checkoutProductViewer)
router.get('/contact',(req,res)=>{
    res.render('users/contact')
})
router.get('/elements',(req,res)=>{
    res.render('users/elements')
})
router.get('/categories',controller.productAdder)
router.get('/pro-details',controller.productViewer)
router.get('/cart',checkUser.checkUser,controller.showCart)
router.get ('/cartAdding',checkUser.checkUser,controller.cartAdder)
router.get ('/plus',checkUser.checkUser,controller.quantityPlus)
router.get('/dic',checkUser.checkUser,controller.quantityDic)
router.get('/deleteCart', checkUser.checkUser, controller.cartDeleting)
router.post('/adress',checkUser.checkUser,controller.adressAdder)
router.get('/resend',controller.resendOtp)
router.post('/order',controller.orderDetails)
router.post('/deleteOrder',controller.orderDelete)
router.get('/deleteAddress',controller.adressDelete)
router.post('/search',controller.searching)
router.post('/categorychange',controller.categoryChange)
router.get('/returnOrder', controller.orderReturn)
router.post('/applyCoupen',controller.ApplyCode)
router.get('/orderHistroy',controller.orderHistoryShow)
module.exports = router
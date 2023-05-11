let controller = require('../controller/admincontroller')
let express = require('express')
const router = require('./user')
let Router =  express.Router()
 Router.get('/admin',(req,res)=>{
  if(req.session.adminloggedin){
    res.render('admin/index')
  }else{
    res.render('admin/signin')
  }
 })
 Router.post('/signin',controller.checker)

 Router.get('/form',controller.FormShow)

 Router.get('/index',controller.dashboard)
 Router.get('/Adminlogout',(req,res)=>{
    req.session.adminloggedin = false
    res.redirect('/admin')
 })
 Router.post('/product',controller.imageAdding,controller.productAdding)
 Router.get('/categoriesadding',controller.categorieview)
 Router.post('/categoryAdding',controller.categoriesAdding)
 Router.get('/users',controller.usersview)
 Router.post('/blockUser',controller.userBlock)
 Router.post('/unblockUser',controller.userUnblock)
 Router.get('/productController',controller.productview)
 Router.post("/Unlist",controller.productUnlist)
 Router.post("/list",controller.productlist)
 Router.post('/categorieDelete',controller.categoriedelete)
 Router.get('/subcategoriesadding',controller.subCategoryView)
 Router.post('/subcategoryAdding',controller.subCategoryAdding)
 Router.post('/subcategorieDelete',controller.subCategoryDelete)
 Router.get('/orderDelete',controller.orderDetailView)
 Router.post('/changeOrderStatus',controller.orderDeliveryStatus)
 router.post('/dowloadSalesReport',controller.getSales)
 router.get('/addCoupen',controller.Coupen)
 router.post('/addCoupen',controller.AddCoupen)
 router.post('/isActiveFalse',controller.isActiveFalse)
 router.post('/isActiveTrue',controller.isActiveTrue)
 router.post('/deleteCoupen',controller.deleteCoupen)
 router.get('/Banner',controller.showBanner)
 router.post('/addBanner',controller.bannerAdding)
 router.post('/bannerIsActiveFalse',controller.bannerIsActiveFalse)
 router.post('/bannerIsActiveTrue',controller.bannerIsActiveTrue)
 router.post('/deletebanner',controller.bannerDelete)
 
  module.exports = Router 
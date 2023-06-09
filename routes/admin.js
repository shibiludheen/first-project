let controller = require('../controller/admincontroller')
let checkAdmin = require('../controller/adminAunth')
const multer = require('multer');
const upload = multer({ dest: 'assets/image/products' });
let express = require('express')
const router = require('./user')
let Router =  express.Router()
 Router.get('/admin',checkAdmin.checkAdmin,controller.dashboard)
 Router.post('/signin',controller.checker)

 Router.get('/form',controller.FormShow)

 Router.get('/index',checkAdmin.checkAdmin,controller.dashboard)
 Router.get('/Adminlogout',(req,res)=>{
    req.session.adminloggedin = false
    res.redirect('/admin')
 })
 Router.post('/product',checkAdmin.checkAdmin,controller.imageAdding,controller.productAdding)
 Router.get('/categoriesadding',checkAdmin.checkAdmin,controller.categorieview)
 Router.post('/categoryAdding',checkAdmin.checkAdmin,controller.categoriesAdding)
 Router.get('/users',checkAdmin.checkAdmin,controller.usersview)
 Router.post('/blockUser',checkAdmin.checkAdmin,controller.userBlock)
 Router.post('/unblockUser',checkAdmin.checkAdmin,controller.userUnblock)
 Router.get('/productController',checkAdmin.checkAdmin,controller.productview)
 Router.post("/Unlist",checkAdmin.checkAdmin,controller.productUnlist)
 Router.post("/list",checkAdmin.checkAdmin,controller.productlist)
 Router.post('/categorieDelete',checkAdmin.checkAdmin,controller.categoriedelete)
 Router.get('/subcategoriesadding',checkAdmin.checkAdmin,controller.subCategoryView)
 Router.post('/subcategoryAdding',checkAdmin.checkAdmin,controller.subCategoryAdding)
 Router.post('/subcategorieDelete',checkAdmin.checkAdmin,controller.subCategoryDelete)
 Router.get('/orderDetail',checkAdmin.checkAdmin,controller.orderDetailView)
 Router.post('/changeOrderStatus',checkAdmin.checkAdmin,controller.orderDeliveryStatus)
 router.post('/dowloadSalesReport',checkAdmin.checkAdmin,controller.getSales)
 router.get('/addCoupen',checkAdmin.checkAdmin,controller.Coupen)
 router.post('/addCoupen',checkAdmin.checkAdmin,controller.AddCoupen)
 router.post('/isActiveFalse',checkAdmin.checkAdmin,controller.isActiveFalse)
 router.post('/isActiveTrue',checkAdmin.checkAdmin,controller.isActiveTrue)
 router.post('/deleteCoupen',checkAdmin.checkAdmin,controller.deleteCoupen)
 router.get('/Banner',checkAdmin.checkAdmin,controller.showBanner)
 router.post('/addBanner',checkAdmin.checkAdmin,controller.bannerAdding)
 router.post('/bannerIsActiveFalse',checkAdmin.checkAdmin,controller.bannerIsActiveFalse)
 router.post('/bannerIsActiveTrue',checkAdmin.checkAdmin,controller.bannerIsActiveTrue)
 router.post('/deletebanner',checkAdmin.checkAdmin,controller.bannerDelete)
 router.post('/editProductPage',checkAdmin.checkAdmin,controller.productEditPageShow)
 router.post('/editProduct',checkAdmin.checkAdmin,controller.moreImageAdding, controller.editTheProduct)
 router.get('/showImageDetails',checkAdmin.checkAdmin,controller.productImageShow)
 router.get('/imageDeletePosition',checkAdmin.checkAdmin,controller.imageDelete)
 router.get('/changeImagePage',checkAdmin.checkAdmin,controller.imageUpdatePage)
 router.post('/changingTheImage', checkAdmin.checkAdmin, upload.single('image'), controller.imageUpdate);
 router.get('/OrderProductDetails',checkAdmin.checkAdmin,controller.orderProductDetails)
 router.get('/orderAdressView',checkAdmin.checkAdmin,controller.prderAdressShower)
 router.get('/imageCropAdd',checkAdmin.checkAdmin,controller.cropImagePage)

  module.exports = Router 
  
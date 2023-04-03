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
//  Router.get('/widget.html',(req,res)=>{
//    res.render('admin/widget')
//  })
//  Router.get('/chart.html',(req,res)=>{
//    res.render('admin/chart')
//  })
//  Router.get('/element.html',(req,res)=>{
//    res.render('admin/element')
//  })
 Router.get('/form.html',(req,res)=>{
   res.render('admin/form')
 })
//  Router.get('/button.html',(req,res)=>{
//    res.render('admin/button')
//  })
//  Router.get('/table.html',(req,res)=>{
//    res.render('admin/table')
//  })
//  Router.get('/typography.html',(req,res)=>{
//    res.render('admin/typography')
//  })
 Router.get('/index.html',(req,res)=>{
   res.render('admin/index')
 })
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
 
  module.exports = Router 
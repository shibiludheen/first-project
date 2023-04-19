const multer = require("multer");
const schema = require("../models/product-schema");
const adminSchema = require("../models/admin-schema");
const categorieSchema = require("../models/categorie-schema");
const orderSchema = require('../models/order-schema')
const userSchema = require("../models/user-schema");
const productSchema = require("../models/product-schema");
const subcategory = require("../models/subcategorie-schema");

module.exports = {
  checker: async (req, res) => {
    try{
    const Email =  req.body.email
    const Password = req.body.password
    const admin = await adminSchema.findOne({ email: Email });
     const err = "Your password or email  is wrong"

    if (admin.email == Email && admin.password == Password) {
      req.session.adminloggedin = true
   const  totelAmount = await orderSchema.aggregate([
      {$match:{delivery:'delivered'}},
      {$group:{_id:null,totel:{$sum:'$totelAmount'}}}
   ])
  
   console.log("this is totel amount "+totelAmount)
   
     
   res.render("admin/index",{totelAmount})
    } else {
      res.render("admin/signin", { err })
    }
  }catch(error){
    const err = "your password or email is wrong"
    res.render('admin/signin',{err})
  }
  },dashboard:async(req,res)=>{
  try{
    const  totelAmount = await orderSchema.aggregate([
      {$match:{delivery:'delivered'}},
      {$group:{_id:null,totel:{$sum:'$totelAmount'}}}
   ]) 
   console.log("this is totel amount"+totelAmount)
    res.render('admin/index',{totelAmount})
  }catch{
    res.redirect('/')
  }

  },
  productAdding: async (req, res) => {
    try {
      const images = [];
      req.files.forEach((files) => {
        images.push(files.filename);
      });
      const {
        productName,
        type,
        brandName,
        size,
        seller,
        occasion,
        catogery,
        discription,
        price,
        stocks,
      } = req.body;
      const users = await schema.create({
        productName,
        type,
        brandName,
        size,
        seller,
        occasion,
        catogery,
        discription,
        price,
        stocks,
        images,
      });
      res.redirect("back");
    } catch (err) {
      res.redirect("/admin");
    }
  },
  imageAdding: async (req, res, next) => {
    //for multer config
    const multerstorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "assets/image/products");
      },
      filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        const name = req.body.productName;
        const img = name + Date.now() + "." + ext;
        cb(null, img);

        
      },
    });
    const upload = multer({
      storage: multerstorage,
    });
    ///
    upload.array("images", 10)(req, res, (err) => {
      if (err) console.log(err);
      else {
        next();
      }
    });
  },
  categoriesAdding: async (req, res) => {
    const category = req.body;
    const categories = await categorieSchema.create(category);
    res.redirect("back");
  },
  usersview: async (req, res) => {
    const users = await userSchema.find();

    res.render("admin/users", { users });
  },
  userBlock: async (req, res) => {
    const userid = req.query.q;
    console.log(userid);
    await userSchema.findOneAndUpdate(
      { _id: userid },
      { $set: { status: false } }
    );
    res.redirect("back");
  },
  userUnblock: async (req, res) => {
    const userid = req.query.q;
    await userSchema.findOneAndUpdate(
      { _id: userid },
      { $set: { status: true } }
    );
    res.redirect("back");
  },
  productview: async (req, res) => {
    const product = await productSchema.find();

    res.render("admin/productcontroller", { product });
  },
  productUnlist: async (req, res) => {
    const productId = req.query.q;
    console.log(productId);
    await productSchema.findByIdAndUpdate({_id:productId},{$set:{status:false}})
    res.redirect("back");
  },  productlist: async (req, res) => {
    const productId = req.query.q;
    console.log(productId);
    await productSchema.findByIdAndUpdate({_id:productId},{$set:{status:true}})
    res.redirect("back");
  },
  categorieview: async (req, res) => {
    const categorie = await categorieSchema.find();
    res.render("admin/categoriesadding", { categorie });
  },
  categoriedelete: async (req, res) => {
    categoryid = req.query.q;
    await categorieSchema.findOneAndDelete({ _id: categoryid });
    res.redirect("back");
  },
  subCategoryAdding:async(req,res)=>{
    try{
     const  category = req.body.category
       await subcategory.create({category }) 
       res.redirect('back')
    }catch(err){
      res.redirect('back')
    }


  },
  subCategoryDelete:async(req,res)=>{
    try{
    const categoryid =  req.query.q
    await subcategory.findOneAndDelete({ _id: categoryid });
    res.redirect('back')
    }catch(err){
      res.redirect('back')

    }

  },
  subCategoryView:async(req,res)=>{
     const  categorie  =  await subcategory.find()
     res.render('admin/subcategoriesadding',{categorie})     

  },
  orderDetailView:async(req,res)=>{
    
      const orderdetail = await orderSchema.find().populate('user')
      console.log(orderdetail)
  
    res.render('admin/orderdetail',{orderdetail})

  },orderDeliveryStatus:async(req,res)=>{
     try{
       const  orderid = req.query.id
       const deliveryStatus = req.body.delivery
      await  orderSchema.findByIdAndUpdate({_id:orderid},{$set:{delivery:deliveryStatus}})
      res.redirect('back')
      

     }catch(err){
      res.send(err)
     }

  }

};

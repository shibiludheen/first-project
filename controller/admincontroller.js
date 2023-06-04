const multer = require("multer");
const schema = require("../models/product-schema");
const adminSchema = require("../models/admin-schema");
const categorieSchema = require("../models/categorie-schema");
const orderSchema = require('../models/order-schema')
const userSchema = require("../models/user-schema");
const productSchema = require("../models/product-schema");
const subcategory = require("../models/subcategorie-schema");
const coupenSchema = require('../models/coupen')
const bannerSchema = require('../models/banner-schema')
const Excel = require('exceljs')
const PDFDocument = require('pdfkit-table')
const fs = require('fs')
const order = require("../models/order-schema");
const { Console } = require("console");

module.exports = {
  checker: async (req, res) => {
    try{
    const Email =  req.body.email
    const Password = req.body.password
    const admin = await adminSchema.findOne({ email: Email });
     const err = "Your password or email  is wrong"

    if (admin.email == Email && admin.password == Password) {
      req.session.adminloggedin = true
   let totalAmount = await orderSchema.aggregate([
      {$match:{delivery:'delivered'}},
      {$group:{_id:null,totel:{$sum:'$totelAmount'}}}
   ])
  
    
   const totelSale = await orderSchema.count()
   const totelUser = await userSchema.count()
  const totalSale2 = await orderSchema.aggregate([{$group:{_id:{$year:"$date"},totalSales:{$sum:"$totelAmount"}}},{$sort:{"_id":1}}])
   const labels = totalSale2.map((ele)=>ele._id);
   const data = totalSale2.map((ele)=>ele.totalSales)
  
   const totalOrders = await orderSchema.aggregate([{$group:{_id:{$year:"$date"},totalOrders:{$sum:1}}},{$sort:{"_id":1}}])
   const totalOrdersCount = totalOrders.map((ele)=>ele.totalOrders)
    res.render('admin/index',{totalAmount,totelSale:totelSale,totelUser,order,labels:JSON.stringify(labels),data:JSON.stringify(data),totalOrders:JSON.stringify(totalOrdersCount)})
    } else {
      res.render("admin/signin", { err })
    }
  }catch(error){
    const err = "your password or email is wrong"
    res.render('admin/signin',{err})
  }
  },dashboard:async(req,res)=>{
  try{
    const  totalAmount = await orderSchema.aggregate([
      {$match:{delivery:'delivered'}},
      {$group:{_id:null,totel:{$sum:'$totelAmount'}}}
   ]) 

   const totelSale = await orderSchema.count()
   const totelUser = await userSchema.count()
   const order = await orderSchema.find()
   const year1 = order.map((element)=>{
      return element.date.getFullYear()
   })
   const uniqueData = [...new Set(year1)];
   console.log(uniqueData)
  const year2 = JSON.stringify(uniqueData)

  const totalSale2 = await orderSchema.aggregate([{$group:{_id:{$year:"$date"},totalSales:{$sum:"$totelAmount"}}},{$sort:{"_id":1}}])
   const labels = totalSale2.map((ele)=>ele._id);
   const data = totalSale2.map((ele)=>ele.totalSales)
  
   const totalOrders = await orderSchema.aggregate([{$group:{_id:{$year:"$date"},totalOrders:{$sum:1}}},{$sort:{"_id":1}}])
   const totalOrdersCount = totalOrders.map((ele)=>ele.totalOrders)
    res.render('admin/index',{totalAmount,totelSale,totelUser,order,labels:JSON.stringify(labels),data:JSON.stringify(data),totalOrders:JSON.stringify(totalOrdersCount)})
  }catch(err){
    res.render('admin/errorPage')
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
      res.json({ success: true, message: 'Product updated successfully' });
    } catch (err) {
      res.render('admin/errorPage')
    }
  },
  imageAdding: async (req, res, next) => {
    try{
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
  }catch(err){
    res.render('admin/errorPage')
  }
  },
  categoriesAdding: async (req, res) => {
    try{
    const category = req.body;
      
    const categories = await categorieSchema.create(category);
    res.redirect("back");
    }catch(err){
      const categorie = await categorieSchema.find();
      const error = "This is already existed"
      res.render('admin/categoriesAdding',{error,categorie});
    }
  },
  usersview: async (req, res) => {
    try{
    const users = await userSchema.find();

    res.render("admin/users", { users });
    }catch(Err){
      res.render('admin/errorPage')
    }
  },
  userBlock: async (req, res) => {
    try{
    const userid = req.query.q;
    console.log(userid);
    await userSchema.findOneAndUpdate(
      { _id: userid },
      { $set: { status: false } }
    );
    res.redirect("back");
    }catch(err){
      res.render('admin/errorPage')
    }
  },
  userUnblock: async (req, res) => {
    try{
    const userid = req.query.q;
    await userSchema.findOneAndUpdate(
      { _id: userid },
      { $set: { status: true } }
    );
    res.redirect("back");
    }catch(err){
      res.render('admin/errorPage')
    }
  },
  productview: async (req, res) => {
    try{
    const product = await productSchema.find();

    res.render("admin/productcontroller", { product });
    }catch(err){
      res.render('admin/errorPage')
    }
  },
  productUnlist: async (req, res) => {
    try{
    const productId = req.query.q;
    console.log(productId);
    await productSchema.findByIdAndUpdate({_id:productId},{$set:{status:false}})
    res.redirect("back");
    }catch(err){
      res.render('admin/errorPage')
    }
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
      const  categorie  =  await subcategory.find()
      const error = "This is already existed"
      res.render('admin/subcategoriesAdding',{error,categorie});
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
    
    const orderdetail = await orderSchema.find().populate('user');
    console.log(orderdetail);
    res.render('admin/orderdetail', { orderdetail });

  },orderDeliveryStatus:async(req,res)=>{
     try{
       const  orderid = req.query.id
       const deliveryStatus = req.body.delivery
      await  orderSchema.findByIdAndUpdate({_id:orderid},{$set:{delivery:deliveryStatus}})
      res.redirect('back')
      

     }catch(err){
      res.send(err)
     }

  },getSales:async(req,res)=>{
    try{

    let{fromDate,toDate,file}=req.body
    fromDate=new Date(fromDate).setHours(00,00,00)
    toDate=new Date(toDate).setHours(23,59,59)
    let orders=await orderSchema.find({date: {
        $gte: fromDate,
        $lte: toDate,
      }}).populate('products.product');
   if(file=='Excel'){
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('SalesReport');
    worksheet.addRow(['Order id', 'billingAdress', 'Total','payment methode','date','order status','payment status']);
    orders.forEach(order => {
        worksheet.addRow([order._id, order.billingAdress, order.totelAmount,order.paymentOption,order.date.toLocaleDateString(),order.orderStatus,order.paymentStatus]);
      });

    
    worksheet.columns.forEach(column => {
        column.width = 30;
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SalesReport.xlsx');
      return workbook.xlsx.write(res);
   }
   if(file=='pdf'){
    let doc = new PDFDocument({ margin: 30, size:[1000,1000] });

let details=[]
orders.forEach(order => {
details.push([order._id, order.billingAdress, order.totelAmount,order.paymentOption,order.date.toLocaleDateString(),order.delivery,order.status]);
})

const title='sales report'
const headers = ['Order id', 'billingAdress', 'Total','payment methode','date','order status','payment status'];
const rows = details

doc.table({title,headers,rows},{

columnsSize: [ 200, 200, 100,100,100,100,100 ],

})


res.setHeader('Content-disposition', 'attachment; filename=salesReport.pdf');
res.setHeader('Content-type', 'application/pdf');
doc.pipe(res);
doc.end();

   }

    }
    catch(err){
      res.render('admin/errorPage')
    }

   
    
},
Coupen:async(req,res)=>{
 try{
   const coupen  = await coupenSchema.find() 
  res.render('admin/coupen',{coupen})

 }catch(err){
  const error = "This coupen code  already existed"
  res.render('admin/coupen',{error});

 }
},
AddCoupen:async(req,res)=>{
  try{
   const {code,discount,minOrderAmount,maxDiscountAmount,usersAllowed,expiresAt,isActive} = req.body
   await coupenSchema.create({code,discount,minOrderAmount,maxDiscountAmount,usersAllowed,expiresAt,isActive})
  res.redirect('back')
  }catch(err){
    const coupen  = await coupenSchema.find() 
    const error = "This coupen code  already existed"
    res.render('admin/coupen',{error,coupen});

  }
},
isActiveFalse:async(req,res)=>{
  try{
    const id =req.query.q 
    await coupenSchema.findOneAndUpdate({_id:id},{$set:{isActive:false}})
    res.redirect('back')
  }catch(err){
    res.render('admin/errorPage')

  }

},
isActiveTrue:async(req,res)=>{
  try{
  const id =req.query.q 
    await coupenSchema.findOneAndUpdate({_id:id},{$set:{isActive:true}})
    res.redirect('back')
  }catch(err){
    res.render('admin/errorPage')

  }

},deleteCoupen:async(req,res)=>{
 try{
   const id = req.query.q
   await coupenSchema.findOneAndDelete({_id:id})
   res.redirect('back')
 }catch(err){
  res.render('admin/errorPage')

 }
},FormShow:async(req,res)=>{
  try{
   const Categorie =   await categorieSchema.find()
    res.render('admin/form',{Categorie})

  }catch(err){
    res.render('admin/errorPage')

  }
},showBanner:async(req,res)=>{
  try{
    const banner = await bannerSchema.find()
    res.render('admin/banner',{banner})
  }catch(err){
    res.render('admin/errorPage')
  }
},bannerAdding:async(req,res)=>{
  try{
   const {title,description,expiresAt} = req.body
       await bannerSchema.create({title,description,expiresAt})
       res.redirect('back')
  }catch(err){
    res.render('admin/errorPage')
  }
},bannerIsActiveFalse:async(req,res)=>{
  try{
    const bannerId = req.query.q
    console.log(bannerId)
    await bannerSchema.findOneAndUpdate({_id:bannerId},{$set:{isActive:false}})
    res.redirect('back')

  }catch(err){
    res.render('admin/errorPage')
  }
},bannerIsActiveTrue:async(req,res)=>{
  try{
    const bannerId = req.query.q
    console.log(bannerId)
    await bannerSchema.findOneAndUpdate({_id:bannerId},{$set:{isActive:true}})
    res.redirect('back')

  }catch(err){
    res.render('admin/errorPage')
  }
},bannerDelete:async(req,res)=>{
  try{
   const bannerId = req.query.q
   await bannerSchema.findOneAndDelete({_id:bannerId})
   res.redirect('back')
  }catch(err){
    res.render('admin/errorPage')

  }
},productEditPageShow:async(req,res)=>{
  try{
    const  id = req.query.q
    console.log(id)
    const Categorie =   await categorieSchema.find()
      const product  = await productSchema.findById({_id:id})
      console.log(product)
      res.render('admin/productEditPage',{product,Categorie})

  }catch(err){
    res.render('admin/errorPage')
  }
},moreImageAdding:async(req,res,next)=>{
  try{
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
  }catch(err){
    res.render('admin/errorPage')
  }
},editTheProduct:async(req,res)=>{  
  try {
  

  const {
    productName,
    type,
    brandName,
    size,
    seller,
    occasion,
    category,
    description,
    price,
    stocks,
  } = req.body;

  const id = req.query.q;
  if (req.files.length > 0) {
    const images = req.files.map((file) => file.filename);
  
    await productSchema.findByIdAndUpdate(
      { _id: id },
      { $push: { images: { $each: images } } }
    );
  } else {
    await productSchema.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          productName,
          type,
          brandName,
          size,
          seller,
          occasion,
          category,
          description,
          price,
          stocks,
        },
      }
    );
  }
 
  res.json({ success: true, message: 'Product updated successfully' });
  
} catch (error) {
  console.log(error);
  res.render('admin/errorPage')
}
  


},productImageShow:async(req,res)=>{
  try{
    const id  = req.query.q
    console.log(id)
     const productImage =  await productSchema.findById({_id:id})
     console.log(productImage)
    res.render('admin/productImage',{productImage})

  }catch(err){
    console.log(err)
    res.render('admin/errorPage')
  }
},imageDelete:async(req,res)=>{
  try{
   
   const  imageName = req.query.image
   const  productId  = req.query.productId
   console.log(imageName)
   console.log(productId)
    await productSchema.updateOne({_id:productId},{$pull:{images:imageName}})
    res.json({imageRemoved:true})
  }catch(err){
    console.log(err)
    res.render('admin/errorPage')
  }
},imageUpdatePage:async(req,res)=>{
  try{
  const   productId  =  req.query.productId
  const oldImagePath  = req.query.oldImagePath
  console.log(productId)
  console.log(oldImagePath)
   const product  = await productSchema.findById({_id:productId})
    res.render('admin/productImageUpdate',{product,oldImagePath})

  }catch(err){
    console.log(err)
    res.render('admin/errorPage')
  }

},imageUpdate:async(req,res)=>{
  try{
    console.log('hai')
    const upload = multer({ dest: 'assets/image/products' });
    const newImageFile = req.file
    const oldImagePath = req.query.oldImagePath
    const imageId  = req.query.imageUrl
    console.log( "this is 1"+imageId)
    const imageUrl   =  encodeURIComponent(imageId)
    console.log(" this is 2"+newImageFile)
    console.log("this is 3"+oldImagePath)
    const newfilePath  = ` http://localhost:3000/image/products/${imageUrl}`
    fs.readFile(newImageFile.path, (err, data) => {
      if (err) {
        return res.status(500).send('Error occurred while reading the new image file.');
      }
  
      // Write the new image file, replacing the old image
      fs.writeFile(oldImagePath, data, (err) => {
        if (err) {
          console.log(err)
          return res.status(500).send('Error occurred while updating the image file.');
        }
  
        // Delete the temporary file uploaded
        fs.unlink(newImageFile.path, (err) => {
          if (err) {
            console.log('Error occurred while deleting the temporary file:', err);
          }
    console.log(newfilePath)
          res.json({changed:true, newImageURL: newfilePath  })
        });
      });
    });
  }catch(err){
    console.log(err)

  }
},orderProductDetails:async(req,res)=>{
  try{
    const orderId = req.query.q
     const order = await  orderSchema.findOne({_id:orderId}).populate({path:"products.product",model:"prodect"}).sort({date:-1})
     console.log(order)
     res.render('admin/orderProductDetails',{order})

  }catch(err){
 console.log(err)
  }
},prderAdressShower:async(req,res)=>{
  try{
     const adressId =req.query.q
     const userId = req.query.userId
     console.log(adressId)
     
     const user =  await userSchema.findById({_id:userId})
     console.log(user)
     const adress = user.Adress.id(adressId)
     console.log(adress)
     res.render('admin/productAdressPage',{adress})
     

  }catch(Err){

  }
},cropImagePage:async(req,res)=>{
  try{
    res.render('admin/cropImagePage')
  }catch(err){

  }
}


};

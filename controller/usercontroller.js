const Schema = require("../models/user-schema");
//  const bycript  = require('bycrypt')
const eoverify = require("eoverify");
const bannerSchema = require('../models/banner-schema')
const category = require("../models/categorie-schema");
const { schema, find } = require("../models/user-schema");
const product1 = require("../models/product-schema");
const ObjectId = require("mongoose").Types.ObjectId;
const orderSchema = require("../models/order-schema");
const Razorpay = require("razorpay");
const { OrderedBulkOperation } = require("mongodb");
const  coupenSchema = require("../models/coupen")
const Subcategory = require("../models/subcategorie-schema");
const { response } = require("express");
const { isDefined } = require("razorpay/dist/utils/razorpay-utils");
 
let otp1 = undefined;
const couponStore={
  id:undefined,
  discount:undefined,
  maxAmount:undefined
}
var instance = new Razorpay({
  key_id: "rzp_test_8emA6zzli6nGP1",
  key_secret: "O4RlOXRxnLAX8IaXM3ifqFZZ", 
});
let  NewPasswordEmail=undefined
let cartCount = undefined
module.exports = {
  adding: async (req, res) => {
    try {
      const { full_name, email, password, confirm_password, Phone } = req.body;

      const user = await Schema.create({
        full_name,
        email,
        password,
        confirm_password,
        Phone,
      });

      const otp = eoverify.sendOtp(email);

      otp1 = otp.otp;
      console.log(otp);
      req.session.email = email;
      if (user.confirm_password == password) {
        res.render("users/otp", { user });
      } else {
        const err = "confirm password and password not same";
        res.render("users/signup", { err });
      }
    } catch (err) {
      if (
        err.message ==
        "Users validation failed: confirm_password: passwords are not equal"
      ) {
        const error = "passwords are not equal";
        res.render("users/signup", { error });
      } else {
        const error = "This email already existed";
        res.render("users/signup", { error });
      }
    }
  },loginPageView:async(req,res)=>{
    try{
      res.render('users/login')

    }catch(err){
      res.render('users/errorPage')
    }
  }
  ,
  otpChecker: async (req, res) => {
    try{
    const oldOtp = parseInt(req.body.otp);
    const categorie = await category.find();
    const subcategory = await Subcategory.find()
    let id = req.query.q;
    if (oldOtp === otp1) {
      await Schema.findByIdAndUpdate({ _id: id }, { $set: { status: true } });
      res.redirect("/");
    } else {
      const user = await Schema.findOne({ _id: id });
      const error = "This is invalid";
      res.render("users/otp", { user, error });
    }
  }catch(err){
    res.render('users/errorPage')
  }
  },
  loginChecker: async (req, res) => {
    try {
      const Email = req.body.email;
      const Password = req.body.password;
      const users = await Schema.findOne({ email: Email });
      const categorie = await category.find();
      const subcategory = await Subcategory.find()
      let userCart = await Schema.findOne({ email: Email }).populate({
        path: "cart.product",
        model: "prodect",
      });
      const otp = eoverify.sendOtp(Email);

      otp1 = otp.otp;
      console.log(otp);
      if (
        Email == users.email &&
        Password == users.password &&
        users.status == true
      ) {
        req.session.loggedin = true;

        req.session.email = users.email;
        const Email = req.session.email
         const user = Schema.findOne({email:Email})
        let product = await product1.find()
        let banner =   await bannerSchema.find()

        res.render("users/otplogin", {user, categorie, userCart ,subcategory ,cartCount, product,banner});
       
      } else {
        const error = "You have enterd the wrong password or email";
        res.render("users/login", { error });
      }
    } catch (err) {
      const error = "You have enterd the wrong password or email";
      res.render("users/login", { error });
    }
  },
  otploginChecker:async (req,res)=>{
    try{
      const logginChecker = req.session.loggedin
      console.log(logginChecker)
      const Email = req.session.email
      const user = await Schema.findOne({ email: Email })
      let product = await product1.find()
        let banner =   await bannerSchema.find()
      const oldOtp = parseInt(req.body.otp);
      const categorie = await category.find();
      const subcategory = await Subcategory.find()
      let id = req.query.q;
      if (oldOtp === otp1) {
        res.render("users/index", { logginChecker,categorie,subcategory ,cartCount, product,banner});
      } else {
        
        const error = "This is invalid";
        res.render("users/otplogin", { error });
      }
    }catch(err){
      console.log(err)
    }

  },
  productAdder: async (req, res) => {
    try{
      const logginChecker = req.session.loggedin
    const orginalCategory = req.query.q
    const subcategory = await Subcategory.find()
    const product = await product1.find({catogery:orginalCategory});
    const categorie = await category.find();
    let banner =   await bannerSchema.find()
    res.render("users/categories", { product,logginChecker, categorie ,cartCount,subcategory,banner,orginalCategory});
    }catch(err){
      res.render('users/errorPage')
    }
  },
  productViewer: async (req, res) => {
    try{
      const logginChecker = req.session.loggedin
    const product = await product1.findOne({ _id: req.query.q });
    const subcategory = await Subcategory.find()
    const userEmail = req.session.email;
    let banner =   await bannerSchema.find()
    const categorie = await category.find();
    res.render("users/pro-details", { product,logginChecker, categorie ,cartCount, subcategory,banner });
    }catch(err){
      res.render('users/errorPage')
    }
  },
  cartAdder: async (req, res) => {
    try{
      const logginChecker = req.session.loggedin
    let userEmail = req.session.email;
    let Id = req.query.q;
    const categorie = await category.find();
   
    let user = await Schema.findOne({
      email: userEmail,
      cart: { $elemMatch: { product: Id } },
    });
    let userCart = await Schema.findOne({ email: userEmail }).populate({
      path: "cart.product",
      model: "prodect",
    });
    let banner =   await bannerSchema.find()
    if (user) {
      await Schema.updateOne(
        { email: req.session.email, cart: { $elemMatch: { product: Id } } },
        { $set: { "cart.$.quantity": 1 } }
      );
      res.json({added:true})
    } else {
      res.json({err:'you are not user'});
      await Schema.updateOne(
        { email: req.session.email },
        { $addToSet: { cart: { product: ObjectId(Id) } } }
      );
      res.render("users/cart", { logginChecker, categorie, cartCount,userCart ,banner});
    }
  }catch(err){
    res.render('users/errorPage')
  }
  },
  showCart: async (req, res) => {
    try{ 
      const logginChecker = req.session.loggedin
    let userEmail = req.session.email;
    const categorie = await category.find();
    let banner =   await bannerSchema.find()
  

    let userCart = await Schema.findOne({ email: userEmail }).populate({
      path: "cart.product",
      model: "prodect",
    });
  
    

    res.render("users/cart", { logginChecker,userCart, cartCount,categorie ,banner});
  }catch(err){
    res.render('users/errorPage')
  }
  },
  sessionHandeler: async (req, res) => {
    try{
      const logginChecker = req.session.loggedin
    const categorie = await category.find();
    const subcategory = await Subcategory.find()
    let product = await product1.find()
    let banner =   await bannerSchema.find()
    const userEmail = req.session.email;
    let userCart = await Schema.findOne({ email: userEmail }).populate({
      path: "cart.product",
      model: "prodect",
    });

    if (req.session.loggedin) {
     
      res.render("users/index", { logginChecker, categorie, userCart ,cartCount, subcategory,product,banner });
    } else {
      res.render("users/index",{ logginChecker, categorie, userCart ,cartCount, subcategory,product,banner });                  
    }
  }catch(err){
    res.render('users/errorPage')
  }
  },
  quantityPlus: async (req, res) => {
    try{
    let productId = req.query.q;
    let user = req.session.email;
    let product = await Schema.updateOne(
      { email: user, "cart.product": productId },
      { $inc: { "cart.$.quantity": 1 } }
    );      
    let productSchema = await product1.updateOne(
      { _id: productId },
      { $inc: { stocks: -1 } }
    );

    res.json({ changed: true });
    }catch(err){
      res.render('users/errorPage')
    }
  },
  quantityDic: async (req, res) => {
    try{
    let productId = req.query.q;
    let user = req.session.email;
    let product = await Schema.updateOne(
      { email: user, "cart.product": productId },
      { $inc: { "cart.$.quantity": -1 } }
    );
    let productSchema = await product1.updateOne(
      { _id: productId },
      { $inc: { stocks: 1 } }
    );

    res.json({ changed: true });
    }catch(err){
      res.render('users/errorPage')
    }
  },
  cartDeleting: async (req, res) => {
    try{
    let productId = req.query.q;

    let user = req.session.email;
    let product = await Schema.findOneAndUpdate(
      { email: user },
      { $pull: { cart: { _id: productId } } },
      { new: true }
    );

    res.redirect("back");
    }catch(err){
      res.render('users/errorPage')
    }
  },
  adressAdder: async (req, res) => {
    try {
      let adress = req.body;
      let user = req.session.email;
      let userAdress = await Schema.findOneAndUpdate(
        { email: user },
        { $addToSet: { Adress: adress } },
        { new: true }
      );
      res.redirect("back");
    } catch (err) {
      res.render('users/errorPage')
    }
  },
  checkoutProductViewer: async (req, res) => {
    try {
      const logginChecker = req.session.loggedin
      let userEmail = req.session.email;
      const categorie = await category.find();
      const subcategory = await Subcategory.find()
      let userCart = await Schema.findOne({ email: userEmail }).populate({
        path: "cart.product",
        model: "prodect",
      });
      const subTotal = userCart.cart.reduce((acc, curr) => {
        acc = curr.quantity * curr.product.price + acc;
        return acc;
      }, 0);
      let banner =   await bannerSchema.find()
      res.render("users/checkout", {logginChecker, userCart, subTotal, cartCount,categorie,subcategory,banner });
    } catch (err) {
      res.render('users/errorPage')
    }
  },
  resendOtp: async (req, res) => {
    try {
      let email = req.session.email;
      let user = await Schema.findOne({ email: email });

      const otp = eoverify.sendOtp(email);
      otp1 = otp.otp;
      console.log(otp1);
      res.render("users/otp", { user });
    } catch (err) {
      const error = "This  otp is invalid";
      res.render("users/otp", { user, error });
    }
  },
  resendOtpLogin:async(req,res)=>{
    try {
      let email = req.session.email;
      let user = await Schema.findOne({ email: email });

      const otp = eoverify.sendOtp(email);
      otp1 = otp.otp;
      console.log(otp1);
      res.render("users/otp", { user });
    } catch (err) {
      const error = "This otp is invalid";
      res.render("users/otplogin", { user, error });
    }
  },forgotPasswordResendOtp:async(req,res)=>{

    try {
      

      const otp = eoverify.sendOtp( NewPasswordEmail);
      otp1 = otp.otp;
      console.log(otp1);
      res.render("users/forgotPasswordEmailOtp");
    } catch (err) {
      const error = "This otp is invalid";
      res.render("users/forgotPasswordEmailOtp", {  error });
    }
  }
  ,
  orderDetails: async (req, res) => {
    try {
      const userEmail = req.session.email;
       const logginChecker = req.session.loggedin
      let userCart = await Schema.findOne({ email: userEmail }).populate({
        path: "cart.product",
        model: "prodect",
      });
      let totelAmount = userCart.cart.reduce((acc, curr) => {
        acc = curr.quantity * curr.product.price + acc;
        return acc;
      }, 0);
     
      let actualPrice= userCart.cart.reduce((acc, curr) => {
        acc = curr.quantity * curr.product.price + acc;
        return acc;
      }, 0);
      const products = [...userCart.cart]
      const paymentOption = req.query.paymentOption;
      const billingAdress = req.query.Adress;
      console.log(billingAdress)
      const wallet  = req.query.wallet
      let couponid = req.query.coupenid
      let coupon=null
      const user = userCart._id;
      const date = Date.now();
      if(couponStore.id==couponid){
         console.log(totelAmount)
        let actualPrice = parseFloat(totelAmount)
        let discountPercentage = parseFloat(couponStore.discount)
        let maxAmount = parseFloat(couponStore.maxAmount)
        let price = actualPrice*(discountPercentage/100)
        let discount = actualPrice-price
        let maxDiscount = actualPrice-maxAmount

        if(discount<=maxDiscount){
          totelAmount = parseInt(discount)
        }
        if(discount>maxDiscount){
           totelAmount = parseInt(maxDiscount)
        }
        console.log(totelAmount)
       
coupon=couponid
couponStore.id=undefined
couponStore.discount=undefined
couponStore.maxAmount=undefined
couponid=undefined
      }
      if(wallet=='useWallet'){
        const userEmail = req.session.email
         let userCart = await Schema.findOne({ email: userEmail }).populate({
           path: "cart.product",
           model: "prodect",
         })
         
 
        let  wallet = userCart.wallet
        let takeWallet =undefined
          if(wallet>=actualPrice){
          
           wallet-actualPrice
           takeWallet = actualPrice
           userCart.takeWallet=takeWallet
           actualPrice = 0
         }else if(wallet<actualPrice&&wallet>0){
           takeWallet = wallet
           userCart.takeWallet = takeWallet
           actualPrice = actualPrice-wallet
        }
       if(userCart.takeWallet){
        const userEmail = req.session.email
         await Schema.findOneAndUpdate({email:userEmail},{$inc:{wallet:-(userCart.takeWallet)}})
       }
       }
       
       if(paymentOption=="COD"||paymentOption=="ONLINE"){
        console.log(products)
      const newOrder = await orderSchema.create({
        products,
        paymentOption,
        billingAdress,
        date,
        user,
        totelAmount,
      })
      if(actualPrice==0){
        const userEmail = req.session.email
        await Schema.findOneAndUpdate({email:userEmail},{$set:{cart:[]}})
         res.json({allAmountWallet:true})
      }else{
      if (paymentOption == "ONLINE") {
        var options = {
          amount: totelAmount*100,
          currency: "INR",
          receipt: "" + newOrder._id,
        };
        req.session.order = newOrder._id;
        instance.orders.create(options, function (err, order) {
          if (err) console.log(err);

          res.json({ methode: "online", order: order });
         
        });
        await Schema.findOneAndUpdate({email:userEmail},{$set:{cart:[]}})
      } else if(paymentOption=="COD") {
        req.session.order = newOrder._id;
       
       res.json({methode:"COD"})
       await Schema.findOneAndUpdate({email:userEmail},{$set:{cart:[]}})
      }else{
        userEmail:req.session.email
        await Schema.findOneAndUpdate({email:userEmail},{$set:{cart:[]}})
      }

    
  }
    }
     

    } catch (err) {
      res.render('users/errorPage')
    }
  },
  paymentStatusChanger:async(req,res,next)=>{
    try{
      const userEmail = req.session.email;
      const orderId = req.session.order;
      let order = await orderSchema.findOne({ _id: orderId })
      console.log(order)
      let user = await Schema.findOne({ email: userEmail }).populate({
        path: "cart.product",
        model: "prodect",
      });
      const response =  req.query.q
      console.log(response)
      console.log(order.paymentOption)
      if(response=="paid"&&order.paymentOption=="ONLINE"){
       await orderSchema.findOneAndUpdate({_id:orderId},{$set:{status:"paid"}})
      } 
      if(response=="Cod"&&order.paymentOption=="COD"){
        await orderSchema.findOneAndUpdate({_id:orderId},{$set:{status:"Cod"}})
      }
      
      next()
    } catch (err) {
      console.log(err)
         }

  },
  accountView: async (req, res) => {
      try{
        const userEmail = req.session.email;
        const logginChecker = req.session.loggedin
        let user = await Schema.findOne({ email: userEmail }).populate({
          path: "cart.product",
          model: "prodect",
        });
        const categorie = await category.find();
        let banner =   await bannerSchema.find()
        let userid = user._id;
        let order = await orderSchema.findOne({ user: userid }).sort({date:-1});
  
      
        res.render("users/account", { logginChecker ,user, cartCount,categorie, order ,banner});
      } catch (err) {
        res.render('users/errorPage')
           }
  
  },
  orderDelete: async (req, res) => { 
  try{
    const  orderid = req.query.q;
      const order =  await orderSchema.findOne({id:orderid}).populate('user')
      console.log(order)
      const user  =  req.session.email
      const amount = order.totelAmount
      console.log(amount)
      if(order.status=="paid"&&order.paymentOption=="ONLINE"){ 
     await Schema.findOneAndUpdate({email:user},{$inc:{wallet:amount}}) 
      }else{
        res.redirect('back')
      } 
    const orderdetail = await orderSchema.findOneAndDelete({ _id: orderid });
    res.redirect("back");
  }catch(err){
    console.log(err)

  }
  },
  adressDelete: async (req, res) => {
    try{
    adressid = req.query.q;
    const userEmail = req.session.email;
    await Schema.updateOne(
      { email: userEmail },
      { $pull: { Adress: { _id: adressid } } }
    );
    res.redirect("back"); 
    }catch(err){
      res.render('users/errorPage')
    }
  },
  searching: async (req, res) => {
    try {
      const logginChecker = req.session.loggedin
      const searchText = req.body.search;
      const categorie = await category.find();

      let product = await product1.find({
        productName: { $regex: searchText, $options: "i" },
      });
      let banner =   await bannerSchema.find()
      res.render("users/search", {logginChecker, product, cartCount,categorie ,banner});
    } catch (err) {
      res.render('users/errorPage')
    }
  },categoryChange: async(req,res)=>{
    try{
      const logginChecker = req.session.loggedin
     const body  = req.body.category
     const categorie = await category.find();
      const product = await product1.find({type: { $regex: body, $options: "i" }});
      let banner =   await bannerSchema.find()
      res.render("users/categorychange", { logginChecker,product, cartCount,categorie,banner });
    }catch(err){
      res.render('users/errorPage')
    }
   
  },priceCategoryChange:async(req,res)=>{
    try{
      const categories = req.query.q
    const price =parseInt( req.body.Price)
    
    
    const logginChecker = req.session.loggedin

    const categorie = await category.find();
    const  product   =  await product1.find().sort({price:price})
    let banner =   await bannerSchema.find()
      res.render("users/categorychange", { logginChecker,product, cartCount,categorie,banner });

    }catch(err){
     console.log(err)
    }
  },
  orderReturn:async(req,res)=>{
    try{
     const  orderid = req.query.q 
      await  orderSchema.findOneAndUpdate({_id:orderid},{$set:{orderStatus:"return"}})
      res.redirect('back')
    }catch{
      res.render('users/errorPage')
    }
     

  },
  ApplyCode:async(req,res)=>{
    try{
    
      const userEmail = req.session.email
      let userCart = await Schema.findOne({ email: userEmail }).populate({
        path: "cart.product",
        model: "prodect",
      })
      let totelAmount = userCart.cart.reduce((acc, curr) => {
        acc = curr.quantity * curr.product.price + acc;
        return acc;
      }, 0);
       const coupenid= req.query.id
      
        const coupen  = await coupenSchema.findOne({code:coupenid})
        const code = coupen.code
        const discount = coupen.discount
        const  minOrderAmount = coupen.  minOrderAmount
        const maxDiscountAmount = coupen.maxDiscountAmount
        const expireDate = coupen.expiresAt
       if(!coupen){ res.json({err:'coupen not found'})
       return
    }
       else{
        const currentDate = Date.now()
        if(currentDate>expireDate){
          res.json({err:'coupon expired'})
          return
        }
        if(!coupen.isActive){ 
        
          res.json({err:'coupon expiared'})
          return
        }
        if(minOrderAmount>totelAmount){
         res.json({err:`you needed to purchase above ${minOrderAmount}`})
         return
        }
        await coupenSchema.findOneAndUpdate({code:coupenid},{$inc:{usersAllowed:1}})
        couponStore.id = coupenid
        couponStore.discount = discount
        couponStore.maxAmount = maxDiscountAmount
       
        res.json({validated:true,discount:discount,maxAmount: maxDiscountAmount})
       
       }
   
      }catch(err){
        res.render('users/errorPage')
    
  }
},
orderHistoryShow:async(req,res)=>{
  try{
    const logginChecker = req.session.loggedin
    const userid = req.query.q
    const categorie = await category.find();
     let banner =   await bannerSchema.find()
      let order = await orderSchema.find({ user: userid });
    res.render('users/orderHistoryPage',{logginChecker,order,cartCount, banner,categorie})

  }catch(err){
    console.log(err)
  }
},
   cartCountChecker:async(req,res,next)=>{
    try{
      if(req.session.loggedin){
      userEmail =req.session.email 
      let userCart = await Schema.findOne({ email: userEmail }).populate({
        path: "cart.product",
        model: "prodect",
     
      })
      
      cartCount = userCart.cart.length
    
      
    }else{
      cartCount = 0
    }
    next()
    }catch(err){
      res.render('users/errorPage')
    }
   },forgotPasswordEmailPageShow:async(req,res)=>{
    try{
      res.render('users/forgotEmailVerify')
    }catch(err){
      console.log(err)
    }

   },forgotPasswordEmailVerify:async(req,res)=>{
    try{
      const email = req.body.email
      console.log(email)
    const user =   await Schema.findOne({email:email})
   const error = 'This email not found'
   
if (user === null) {
  res.render('users/forgotEmailVerify',{error})
} else {
  const otp = eoverify.sendOtp(email);
   NewPasswordEmail=email
  otp1 = otp.otp;
  console.log(otp);
  res.render('users/forgotPasswordEmailOtp')
}
    }catch(err){
    console.log(err)
    }
   },forgotPasswordEmailOtpVerify:async(req,res)=>{
    try{
      const oldOtp = parseInt(req.body.otp);
      if (oldOtp === otp1) {
        res.render("users/forgotPage");
      } else {
        
        const error = "This is invalid";
        res.render("users/forgotpasswordEmailOtp", { error });
      }
    }catch(err){
      console.log(err)
    }
    
   },NewPasswordChange:async(req,res)=>{
    try{
      const NewPassword  =req.body.NewPassword
      const ConfirmPassword = req.body.Confirmpassword
     const  error = "Your new password and confirm password not same"
      if(NewPassword==ConfirmPassword){
       await  Schema.findOneAndUpdate({email: NewPasswordEmail},{$set:{password:NewPassword}})
       await  Schema.findOneAndUpdate({email: NewPasswordEmail},{$set:{confirm_password:NewPassword}})
       res.render('users/login')
     }else{
        res.render('users/forgotPage',{error})
      }
    }catch(err){
      res.render('users/errorPage')
    }
   },
   showOrderProductDetail:async(req,res)=>{
    try{
    const  id = req.query.q
    console.log(id)
    const logginChecker = req.session.loggedin
    const subcategory = await Subcategory.find()
    const categorie = await category.find();
    let banner =   await bannerSchema.find()
     const productDetails=  await  orderSchema.findOne({_id:id}).populate({path:"products.product",model:"prodect"})
     console.log(productDetails)
        res.render('users/orderDetailProductPage',{ productDetails,logginChecker, categorie ,cartCount,subcategory,banner})
    }catch(err){
      console.log(err)

    }

   }


}

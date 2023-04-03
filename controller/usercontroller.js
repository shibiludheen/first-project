const Schema = require("../models/user-schema");
//  const bycript  = require('bycrypt')
const eoverify = require("eoverify");
const category = require("../models/categorie-schema");
const { schema, find } = require("../models/user-schema");
const product1 = require("../models/product-schema");
const ObjectId = require("mongoose").Types.ObjectId;
const orderSchema = require("../models/order-schema");
const Razorpay = require("razorpay");
const { OrderedBulkOperation } = require("mongodb");
const Subcategory = require("../models/subcategorie-schema");
const { response } = require("express");
let otp1 = undefined;
var instance = new Razorpay({
  key_id: "rzp_test_8emA6zzli6nGP1",
  key_secret: "O4RlOXRxnLAX8IaXM3ifqFZZ",
});
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
  },
  otpChecker: async (req, res) => {
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
      if (
        Email == users.email &&
        Password == users.password &&
        users.status == true
      ) {
        req.session.loggedin = true;

        req.session.email = users.email;

        res.render("users/index", { categorie, userCart ,subcategory});
      } else {
        const error = "You have enterd the wrong password or email";
        res.render("users/login", { error });
      }
    } catch (err) {
      const error = "You have enterd the wrong password or email";
      res.render("users/login", { error });
    }
  },
  productAdder: async (req, res) => {
    const subcategory = await Subcategory.find()
    const product = await product1.find();
    const categorie = await category.find();
    res.render("users/categories", { product, categorie ,subcategory});
  },
  productViewer: async (req, res) => {
    const product = await product1.findOne({ _id: req.query.q });
    const subcategory = await Subcategory.find()
    const userEmail = req.session.email;

    const categorie = await category.find();
    res.render("users/pro-details", { product, categorie , subcategory });
  },
  cartAdder: async (req, res) => {
    let userEmail = req.session.email;
    const categorie = await category.find();
    let Id = req.query.q;
    let user = await Schema.findOne({
      email: req.session.email,
      cart: { $elemMatch: { product: Id } },
    });
    let userCart = await Schema.findOne({ email: userEmail }).populate({
      path: "cart.product",
      model: "prodect",
    });

    if (user) {
      await Schema.updateOne(
        { email: req.session.email, cart: { $elemMatch: { product: Id } } },
        { $inc: { "cart.$.quantity": 1 } }
      );
      res.render("users/cart", { categorie, userCart });
    } else {
      await Schema.updateOne(
        { email: req.session.email },
        { $addToSet: { cart: { product: ObjectId(Id) } } }
      );
      res.render("users/cart", { categorie, userCart });
    }
  },
  showCart: async (req, res) => {
    let userEmail = req.session.email;
    const categorie = await category.find();

    let userCart = await Schema.findOne({ email: userEmail }).populate({
      path: "cart.product",
      model: "prodect",
    });

    res.render("users/cart", { userCart, categorie });
  },
  sessionHandeler: async (req, res) => {
    const categorie = await category.find();
    const subcategory = await Subcategory.find()
    const userEmail = req.session.email;
    let userCart = await Schema.findOne({ email: userEmail }).populate({
      path: "cart.product",
      model: "prodect",
    });

    if (req.session.loggedin) {
      res.render("users/index", { categorie, userCart , subcategory });
    } else {
      res.render("users/login");
    }
  },
  quantityPlus: async (req, res) => {
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
  },
  quantityDic: async (req, res) => {
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
  },
  cartDeleting: async (req, res) => {
    let productId = req.query.q;

    let user = req.session.email;
    let product = await Schema.findOneAndUpdate(
      { email: user },
      { $pull: { cart: { _id: productId } } },
      { new: true }
    );

    res.redirect("back");
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
      res.redirect("/");
    }
  },
  checkoutProductViewer: async (req, res) => {
    try {
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

      res.render("users/checkout", { userCart, subTotal, categorie,subcategory });
    } catch (err) {
      res.redirect("/");
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
      const error = "This is invalid";
      res.render("users/otp", { user, error });
    }
  },
  orderDetails: async (req, res) => {
    try {
      const userEmail = req.session.email;
      let userCart = await Schema.findOne({ email: userEmail }).populate({
        path: "cart.product",
        model: "prodect",
      });
      const totelAmount = userCart.cart.reduce((acc, curr) => {
        acc = curr.quantity * curr.product.price + acc;
        return acc;
      }, 0);
      const paymentOption = req.query.paymentOption;
      const billingAdress = req.query.Adress;
      const user = userCart._id;
      const date = Date.now();
      const newOrder = await orderSchema.create({
        paymentOption,
        billingAdress,
        date,
        user,
        totelAmount,
      });

      if (paymentOption == "ONLINE") {
        var options = {
          amount: totelAmount,
          currency: "INR",
          receipt: "" + newOrder._id,
        };
        instance.orders.create(options, function (err, order) {
          if (err) console.log(err);

          res.json({ methode: "online", order: order });
        });
      } else {
      }
    } catch (err) {
      res.redirect("back");
    }
  },
  accountView: async (req, res) => {
    try {
      const userEmail = req.session.email;
      let user = await Schema.findOne({ email: userEmail }).populate({
        path: "cart.product",
        model: "prodect",
      });5
      const response =  req.query.q
      let userid = user._id;
      let order = await orderSchema.findOne({ user: userid });
      if(response=="paid"){
       await orderSchema.findOneAndUpdate({user:userid},{$set:{status:"paid"}})
      }
     const categorie = await category.find();
      res.render("users/account", { user, categorie, order });
    } catch (err) {
      res.redirect("/");
    }
  },
  orderDelete: async (req, res) => { 
  try{
    const  orderid = req.query.q;
      const order =  await orderSchema.findOne({id:orderid}).populate('user')
      const user  =  order.user._id
      console.log(user)
      const amount = order.totelAmount
      if(order.status=="paid"){    
     await Schema.findOneAndUpdate({_id:user},{$inc:{wallet:amount}}) 
      }    
    const orderdetail = await orderSchema.findOneAndDelete({ _id: orderid });
    res.redirect("back");
  }catch(err){
    res.redirect('back')

  }
  },
  adressDelete: async (req, res) => {
    adressid = req.query.q;
    const userEmail = req.session.email;
    await Schema.updateOne(
      { email: userEmail },
      { $pull: { Adress: { _id: adressid } } }
    );
    res.redirect("back");
  },
  searching: async (req, res) => {
    try {
      const searchText = req.body.search;
      const categorie = await category.find();

      let product = await product1.find({
        productName: { $regex: searchText, $options: "i" },
      });

      res.render("users/search", { product, categorie });
    } catch (err) {
      res.redirect("back");
    }
  },categoryChange: async(req,res)=>{
    try{
     const body  = req.body.category
     const categorie = await category.find();
      const product = await product1.find({type: { $regex: body, $options: "i" }});
      res.render("users/categorychange", { product, categorie });
    }catch(err){
      res.redirect('back')
    }
   
  },
  orderReturn:async(req,res)=>{
    try{
     const  orderid = req.query.q 
      await  orderSchema.findOneAndUpdate({_id:orderid},{$set:{orderStatus:"return"}})
      res.redirect('back')
    }catch{
      res.redirect('back')
    }
     

  }
}

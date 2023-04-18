const mongoose = require('mongoose')
const admin = mongoose.Schema({

 email:{
    type:String,
    unique :true,
    require : true
 },
 password:{
    type:Number,
    unique:true,
    require:true
 }
})
 const adminDatabase = mongoose.model("adminDatabase",admin)
 module.exports = adminDatabase
const mongoose = require("mongoose")
const categorySchema = mongoose.Schema({
     category:{
        type:String,
        unique:true,
        requred:true
     }
})
const category = mongoose.model("category",categorySchema)
module.exports = category
 
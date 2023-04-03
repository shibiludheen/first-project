const mongoose = require("mongoose")
const subcategorySchema = mongoose.Schema({
     category:{
        type:String,
        unique:true,
        requred:true
     }
})
const subcategory = mongoose.model("subcategory",subcategorySchema)
module.exports = subcategory
 
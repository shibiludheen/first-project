const mongoose= require('mongoose');

const prodectSchema=mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    
    type:{
        type:String,
        required:true

    },
    brandName:{
        type:String,
        required:true
    },
    size:{
      type:Number,
      require:true
    },
    seller:{
       type:String,
       require:true
    },
    occasion:{
        type:String,
        require:true

    },
    catogery:{
        type:String,
        required:true
},
    discription:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stocks:{
        type:Number,
        required:true
        
    },
    images:{
        type:[]
    } ,
     status:{
    type:Boolean,
     default:true
    }

})

const prodect=mongoose.model('prodect',prodectSchema);
module.exports=prodect
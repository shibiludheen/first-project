const mongoose = require('mongoose')
const orderSchema=mongoose.Schema({
    products:
        [
            {
                product:{
                    type:mongoose.Types.ObjectId,
                    ref:'prodect'
                },
                quantity:{
                    type:Number,
                    
                }
               
            }
        ]
    
    ,
    user:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:true
    },
    totelAmount:{
        type:Number,
        required:true
    },
    paymentOption:{
        type:'string',
        required:true
    },
    status:{
        type:String,
        default:'pending'
    },
    date:{
        type:Date
    },
    coupon:{
        type:String
    },
    orderStatus:{
        type:String,
        default:"Delivering"

    },
    billingAdress:{
        type:String,
        required:true
    },
    delivery:{
        type:String,
        default:"order placed"
    }
})

const order=mongoose.model('order',orderSchema)
module.exports=order
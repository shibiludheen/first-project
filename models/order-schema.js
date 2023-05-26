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
        default:"Requested"

    },
    billingAdress:{
        type:String,
        required:true
    },
    delivery:{
        type:String,
        default:"order placed"
    },
    walletStatus:{
        type:String,
        default:false
    },
    walletAmount:{
        type:Number,
        default:0
    },
    coupenStatus:{
        type:String,
        default:false
    },
    couponAmount:{
        type:String,
        default:0
    }
})

const order=mongoose.model('order',orderSchema)
module.exports=order
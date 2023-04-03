const mongooe  = require('mongoose')
 const cart  = mongooe.model('cart',new mongoose.schema({

       cart:[{
          product :{
            type:mongoose.Types.ObjectId,
            ref:'prodect'
          },
          
            quantity:{
                type:Number,
                default:1
            },
            totalPrice:{
                type:Number
            }


            
        }]
 }))
 module.exports  = cart
 


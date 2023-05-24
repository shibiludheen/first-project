const mongoose= require('mongoose')
const bcrypt = require('bcrypt')
const validator= require('validator')
const User= mongoose.model('Users',new mongoose.Schema({
     full_name:{
        type:String,
        required:true

     },
    email:{
        type:String,
        unique:true,
        required:true,
        validate:[validator.isEmail,'provide a valid email']
    },
    password:{
        type:String,
        required:true,
    },
    confirm_password:{
        type:String,
        required:true,
        validate:[function(conf){return conf===this.password},'passwords are not equal']
    },
    Phone:{
        type:Number,
        required:true,
        minlength:10,
        maxlength:10,
    },
    phone_verified:{
        type:Boolean,
        default:false,
    },
    email_verified:{
        type:Boolean,
        default:false,
    },
    address:{
        type:Array,
    },
    admin:{
        type:Boolean,
        default:false,
    },
    status:{
        type:Boolean,
        default:false,
    },
    loginStatus:{
        type:Boolean,
        default:false,
    },
    last_login:{
        type:Date,
        
    },
    wallet:{
        type:Number,
        default:0
      
    },
    joined_at:{
        type:Date,
        required:false,
    },
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


            
        }],
    wishlist:{
        type:Array,
    },Adress:[{
        firstName:{
          type:String,
          require:true
        },
        
          lastName:{
              type:String,
              require:true
          },
          phoneNumber:{
              type:Number,
              require:true
          },
          contry:{
            type:String,
            require:true
          },
          pincode:{
            type:Number,
            require:true

          },
          homeAdress:{
            type:String,
            require:true
          },
          townName:{
            type:String,
            require:true
            
          }         
      }]
},
{timestamps:true}
))
   
module.exports = User
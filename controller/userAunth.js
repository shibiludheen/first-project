 const userSchema = require('../models/user-schema')
module.exports = {
    checkUser: async (req,res,next)=>{
        const email = req.session.email
        console.log(email)
        const user  =   await  userSchema.findOne({email:email})
        console.log(user)
        if(!user){
            res.render('users/login')
           
        }else if(user.status===false){
            req.session.loggedin = false
        }
        if(!email){
            req.session.loggedin = false

        }


        if( req.session.loggedin== true&&user.status==true){
          
            next()
        }else{
            res.render('users/login')

            
        } 

    }
}
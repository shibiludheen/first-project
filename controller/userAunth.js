module.exports = {
    checkUser:(req,res,next)=>{
        const loggingStatus = req.session.loggedin
        console.log(loggingStatus)
        if(loggingStatus == true){
         
            next()
        }else{
            res.render('users/login')
        }

    }
}
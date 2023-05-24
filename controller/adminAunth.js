module.exports = {
    checkAdmin:(req,res,next)=>{
        const loggingStatus = req.session.adminloggedin
        console.log(loggingStatus)
        if(loggingStatus == true){
         
            next()
        }else{
            res.render('admin/signin')
        }

    }
}
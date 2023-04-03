const mongoose = require('mongoose');

module.exports = {
    connect:()=>{
        mongoose.connect(process.env.DATABASE_URL,
            {
            useNewUrlParser: true,
            useUnifiedTopology: true
            },
          (err,res)=>{
            err ? console.log(`db not connected ${err}`) : console.log('db connected');
        })
    }
}
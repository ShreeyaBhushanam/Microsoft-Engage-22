const async = require("hbs/lib/async");
const mongoose =require("mongoose");

const mongoPath = "mongodb+srv://shreeya:engage1@recommendationsystem.kt1oyc0.mongodb.net/Registration?retryWrites=true&w=majority" 

module.exports = async()=>{
    await mongoose.connect(mongoPath,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
}
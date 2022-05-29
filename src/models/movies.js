//Schema for Registration.moovies in MongoDB
const mongoose = require("mongoose")

const movie_data = new mongoose.Schema({
    title : String,
    rating :Number,
    duration : Number,
    year : Number ,
    language : String ,
    English : Boolean,
    Hindi : Boolean,
    Telugu : Boolean,
    horror : Boolean,
    comedy : Boolean,
    action : Boolean,
    id : Number
})
//Create collection
module.exports = new mongoose.model("Moovie" , movie_data)
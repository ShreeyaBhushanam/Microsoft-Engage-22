//Schema for Registration.users in MongoDB
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    liked_movies: {
        type : Array,
        required : true
    },
    disliked_movies: {
        type : Array,
        required : true
    },
    watched_movies: {
        type : Array,
        required : true
    }
})

const User = new mongoose.model("User" , userSchema)
module.exports = User
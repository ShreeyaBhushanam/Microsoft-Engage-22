const express = require('express')
const exphbs = require('express-handlebars')
const path = require("path")
const app =  express()
const hbs = require("hbs")
let {PythonShell} = require('python-shell')

//Connecting MongoDB to app.js
const mongo = require('./db/connection')

const connectToMongoDB= async()=>{
    await mongo().then((mongoose)=>{
        try{
            console.log('Connected to mongoDB')
        }
        catch{
            mongoose.connection.close()
        }
    })
}

connectToMongoDB()

const Register = require("./models/registers")
const Moovie = require("./models/movies");
const async = require('hbs/lib/async');
const User = require('./models/user');
const { Console } = require('console');
const { json } = require('express/lib/response');
const { default: mongoose } = require('mongoose');


const port = process.env.PORT || 3000;

//Connecting html page 
const static_path=path.join(__dirname , "../public")
const template_path=path.join(__dirname , "../templates/views")

app.use(express.json())
app.use(express.urlencoded({extented : false}));

app.use(express.static(static_path))

app.set("view engine" , "hbs")

app.set("views" , template_path)

app.use(require("body-parser").urlencoded({extended:true}));

// Connecting to Home page
app.get("/",(req,res)=>{
    res.render("index")
})

//Calling db_add.hbs to add movies to mongodb
app.get("/dbAdd" , (req,res)=>{
    res.render("db_add")
})

// Collecting data from db_add.hbs and writing to MongoDB database Registration.moovies
app.post("/dbAdd" , async(req,res)=>{
    try {
        const registerMovie = new Moovie({
            id : req.body.id,
            title : req.body.title,
            rating : req.body.rating ,
            duration : req.body.duration ,
            year : req.body.year,
            language : req.body.lang ,
            horror : req.body.horror ,
            comedy : req.body.comedy ,
            action : req.body.action ,
            English : req.body.English ,
            Hindi : req.body.Hindi ,
            Telugu : req.body.Telugu 
        })
        const registered1 = await registerMovie.save()
        res.status(201).send("successful")
    } catch (error) {
        res.send("Wrong")
    }
})

//Connecting to Registration Form
app.get("/register" , (req,res)=>{
    res.render("register")
})

//Creating new user in database
app.post("/register" , async (req,res)=>{
    try{

        const password = req.body.password
        const cpassword = req.body.confirmpassword
        //Collecting data from register.hbs and writing to MongoDB database Registration.registers
        if(password === cpassword){
            const registerUser = new Register({
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                confirmpassword : req.body.confirmpassword
            })
        //Creating user profile by writing to MongoDB database Registration.users
        const userUser = new User({
            username : req.body.username,
            liked_movies : [null],
            disliked_movies : [null],
            watched_movies : [null]
        })
        
        const registered = await registerUser.save()
        const userr = await userUser.save()

        res.status(201).render("login")
        }else{
            res.send("Passwords are not matching")
        }
    } catch( error){
        res.status(400).send(error);
    }
})

//Connecting to Login page
app.get("/login" , (req,res)=>{
    res.render("login")
})

//Verifying login details as per MongoDB database Registration.registers
app.post("/login", async (req,res)=>{
    try {
        
        const username = req.body.username
        const password = req.body.password

        const user_name=await Register.findOne({username : username})
        if(user_name.password === password)
        {
            //Login is successful and redirected to movies.hbs to choose movie tiles 
            res.status(201).render("movies")
 
        }else{
            //Username is correct but password is not matching
            res.send("Invalid details")
        }

    } catch (error) {
        //Username not in MongoDB Registration.registers 
        res.status(400).send("Invalid details")
    }
} )

// After submit in movies.hbs, collecting liked movies  
app.post("/submit", async(req,res)=>{
    let options={
    args:(JSON.stringify(req.body))
    }
    //Sending liked movies to get recommendations algorithm 
    PythonShell.run("src/recommendation_algo.py" , options,function(err,results){
        //Output of recommendation_algo is stored in results variable
        if (err) {
            console.log(err)
        } 
        else {
            var name =JSON.stringify(results);
            res.render("rec_movies",{name:name});
        } 
    });    
})

//To bind and listen the connections on the specified host and port
app.listen(port,()=>{
    console.log(`Server is running at port no ${port}`);
})
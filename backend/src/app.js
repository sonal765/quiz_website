require('dotenv').config()

const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const auth = require("./middleware/auth")
require("./db/conn")
const Register = require("./models/registers");
const { cp } = require("fs");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public" )
const template_path = path.join(__dirname, "../templates/views" )
const partials_path = path.join(__dirname, "../templates/partials" )
// console.log(path.join(__dirname, "../public" ))

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);


// console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=>{
    res.render("index")
});

app.get("/register",(req,res)=>{
    res.render("register")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/home",auth,(req,res)=>{
    // console.log(req.cookies.jwt);
    res.render("home")
})

app.get("/ml",(req,res)=>{
    res.render("ml")
})

app.get("/se",(req,res)=>{
    res.render("se")
})

app.get("/flat",(req,res)=>{
    res.render("flat")
})

app.get("/ai",(req,res)=>{
    res.render("ai")
})

app.get("/logout",auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((curele)=>{
            return curele.token !== req.token
        })
        res.clearCookie("jwt");
        console.log("Logout Successfully");
        await req.user.save();
        res.render("index");
    }
    catch(err){
        res.send(400).send(err);
    }
})

//create a new user in database
app.post("/register",async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const registerUser = new Register({
                firstname : req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                password: password,
                confirmpassword:cpassword
            })  
          
        // console.log("the success part " + registerUser);
        const token = await registerUser.generateAuthToken();
        // console.log("the token part " + token);

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+600000),
            httpOnly:true
        });

        const registered = await registerUser.save();
        // console.log("the page part " + registered);

            res.status(201).render("login");
        }else{
            res.send("Password are not matching");
        }
    } catch(err){
        res.status(400).send(err);
        // console.log("the error part ");
    }
})


//login part 
app.post("/login",async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userEmail =  await Register.findOne({email:email});
        // const isMatch = await bcrypt.compare(password,userEmail.password);
        const token = await userEmail.generateAuthToken();
        // console.log("the token part " + token);
        
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+600000),
            httpOnly:true,
        });
        // res.status(201).render("index");

        if(userEmail.password === password){
        // if(isMatch){
            res.status(201).render("home");
        }else{
            res.send("Invalid login Details");
        }
    }catch(err){
        res.status(400).send("Invalid login Details");
    }
})





app.listen(port,()=>{
    console.log(`Server is running at port no. ${port}`);
})
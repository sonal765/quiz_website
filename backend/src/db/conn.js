const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/quizRegistration").then(()=>{
    console.log(`Connection successful`);
}).catch((e)=>{
    console.log(e);
})
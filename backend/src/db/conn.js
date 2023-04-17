const mongoose = require("mongoose");

//mongo ATLAS used
const DB = 'mongodb+srv://sonalj7657:mongoquiz@cluster0.amspoa3.mongodb.net/Quiz?retryWrites=true&w=majority';
mongoose.connect(DB).then(()=>{
    console.log(`Connection successful`);
    }).catch((e)=>{
        console.log(e);
})

//local uri used(MONGODB COMPASS)
// mongoose.connect("mongodb://127.0.0.1:27017/quizRegistration").then(()=>{
//     console.log(`Connection successful`);
// }).catch((e)=>{
//     console.log(e);
// })
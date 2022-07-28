const mongoose = require("mongoose");
// const bcrypt = require("bcrypt.js");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//generating tokens
studentSchema.methods.generateAuthToken = async function(){
    try{
        // console.log(this._id);
        const tk = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:tk})
        // console.log(tk);
        await this.save();
        return tk;
    }catch(err){
        res.send("The error part " + err);
        // console.log("The error part " + err);
    }
}

//collection
const Register = new mongoose.model("Register",studentSchema);

module.exports = Register;
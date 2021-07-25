//creating a schema

const mongoose=require("mongoose");


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id please enter a valid one!")
            }
        }
    },
    message:{
        type:String,
        required:true,
        min:3
    },
})

const Contact=new mongoose.model("Contact",userSchema);
//export User (the defined constant)
module.exports=Contact;

//creating a schema
/*
you can use a schema to require a specific set of fields, configure the  content of a field or to validate changes
to a document based on its beginning and ending states
*/
const mongoose=require("mongoose");
//npm install validator 
//This library validates and sanitizes strings only.
const validator=require("validator");

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
//we need a collection
//here parameter name should be singular only and also capitalized!even if it's plural like Users write User only
//and it will be automatically understood as Users if Users exist.
const Contact=new mongoose.model("Contact",userSchema);
//export User (the defined constant)
module.exports=Contact;

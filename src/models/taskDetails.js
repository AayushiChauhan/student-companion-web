//creating a schema

const mongoose=require("mongoose");
//npm install validator 
//This library validates and sanitizes strings only.
const validator=require("validator");

const taskSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3
    },
    description:{
        type:String,
        required:true,
        min:3
    },
    dueDate:{
        type:String,
        required:true,
        max:20
    },
})
//we need a collection
//here parameter name should be singular only and also capitalized!even if it's plural like Users write User only
//and it will be automatically understood as Users if Users exist.
const Task=new mongoose.model("Task",taskSchema);
//export User (the defined constant)
module.exports=Task;


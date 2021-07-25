//creating a schema

const mongoose=require("mongoose");

const validator=require("validator");

const taskSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
        min:3
    },
    date:{
        type:Date,
        required:true,
    },
    studentId:{
        type:String,
    }
})

const Task=new mongoose.model("Task",taskSchema);
//export the schema named "Task"
module.exports=Task;


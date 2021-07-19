//creating a schema

const mongoose=require("mongoose");
//npm install validator 
//This library validates and sanitizes strings only.
const validator=require("validator");

const courseSchema= new mongoose.Schema({
    course_name:{
        type:String,
        required:true,
    },
    course_cat:{
        type:String,
        required:true,
    },
    course_credit:{
        type:Number,
        required:true,
    },
    course_faculty:{
        type:String,
        required:true,
    },
    course_rating:{
        type:Number,
        required:true,
    },
})
//we need a collection
//here parameter name should be singular only and also capitalized!even if it's plural like Users write User only
//and it will be automatically understood as Users if Users exist.
const Course=new mongoose.model("Course",courseSchema);
//export the schema named "Task"
module.exports=Course;


//creating a schema
const mongoose=require("mongoose");

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

const Course=new mongoose.model("Course",courseSchema);

module.exports=Course;


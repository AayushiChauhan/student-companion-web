//creating a schema

const mongoose=require("mongoose");


const mycourseSchema= new mongoose.Schema({
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
    studentId:{
        type:String,
    }
})
//we need a collection
//here parameter name should be singular only and also capitalized!even if it's plural like Users write User only
//and it will be automatically understood as Users if Users exist.
const Mycourse=new mongoose.model("Mycourse",mycourseSchema);

//export the schema named "Task"
module.exports=Mycourse;




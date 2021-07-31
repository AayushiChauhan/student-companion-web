const mongoose = require('mongoose')

var AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    userId: {
        type: String,
        unique: true,
        
    },
    password: {
        type: String,
        required: true
    }
})

const Admin=mongoose.model('admin', AdminSchema)
module.exports=Admin;
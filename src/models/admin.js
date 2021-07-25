const mongoose = require('mongoose')

var AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin=mongoose.model('admin', AdminSchema)
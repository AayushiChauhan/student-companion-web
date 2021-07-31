const mongoose = require("mongoose");

var studentSchema = mongoose.Schema({
  useremail: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  enroll_no: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  st_name: {
    type: String,
    required: true,
  },
});

var Student = mongoose.model("student", studentSchema);
module.exports = Student;

const express = require("express"); //import express module
require("./db/conn");
//for contact form validation
const Contact = require("./models/contactDetails");
const Task = require("./models/taskDetails");
const Course = require("./models/courseDetails");
const Mycourse = require("./models/mycourseDetails");
const Student = require("./models/student");
const Admin = require("./models/admin");

const mongoose = require("mongoose");
const mongodb = require("mongodb");
const db = require("./db/conn");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const authTokens = require("auth-tokens");
const sessionStorage = require("node-sessionstorage");

const hbs = require("hbs");
//if we want to make static website then include public folder and call it here in app.js file
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { connect } = require("http2");

const collection = "tasks";

const app = express(); //all the properties and methods of express module will be stored in app variable
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cookieParser());

//setting the path
const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");

//console.log(path.join(__dirname,'../public'));  -testing

//best way to include bootstrap and jquery in nodejs applications
//root is set look at '/css'

app.use(
  "/css",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
);
app.use(
  "/jq",
  express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);
//if we submit contact us form then data entered should be encoded and then displayed (ie we get that entered data)
app.use(express.json()); //only this line of code is needed if we are using postman otherwise below line is required if we using just mongodb (Compass)
//app.use(express.urlencoded({extended:false}));
// to use encrypted data
app.use(express.urlencoded());

//make sure you place body-parser before your CRUD handlers!
//app.use(bodyParser.urlencoded({extended:false}));

//middleware

app.use(express.static(staticpath));
//app.use(express.static(__dirname+'../public'));
//set the view engine in express
app.set("view engine", "ejs");
//app.engine('hbs', exhbs());
app.set("view engine", "hbs");

//app.set("view engine","hbs");
//as new folder template is made which contains "views" and "partials" folder in it
//basically below command tells express how to get "views" folder through "templatepath"
app.set("views", templatepath);

//to get partials we first imported hbs through require [look at the top of code]
hbs.registerPartials(partialpath);
//after these below code will not run as express came to know that it has to run the static folder called "public"
//routing
//app.get(path,callback) -syntax
//if path parameter is / then simply path is your homepage
app.get("/", (req, res) => {
  //here we want to render index.hbs file therefore simply write index inside render

  res.render("login");
  //res.send("hey there");
});
app.get("/index", (req, res) => {
  res.render("index");
});
// app.get('/task',(req,res)=>{
//     //here we want to render index.hbs file therefore simply write index inside render
//     res.render("task")
//     //res.send("hey there");
// })

// app.get('/', (req, res)=>{
//      res.render('dynamic', {demo : demo})
// })
// app.get('/course',(req,res)=>{
//     //here we want to render index.hbs file therefore simply write index inside render
//     res.render("course",{demo : demo})
//     //res.send("hey there");//used if we want .html file instead of .hbs file.
// })
app.get("/about", (req, res) => {
  //here we want to render index.hbs file therefore simply write index inside render
  res.render("about");
  //res.send("hey there");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/studentlogin", (req, res) => {
  res.render("studentlogin");
});
app.get("/adminlogin", (req, res) => {
  res.render("adminlogin");
});
app.get("/adminPanel", (req, res) => {
  res.render("adminPanel");
});

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};
// This will hold the users and authToken related to users
const authToken = {};
app.use((req, res, next) => {
  const authToken = req.cookies["AuthToken"];
  req.user = authTokens[authToken];
  next();
});

// app.post('/login', (req, res) => {
//     const { useremail, password } = req.body;

//     const user = Student.find(u => {
//         return u.useremail === useremail && password === u.password
//     });

//     if (user) {
//         const authToken = generateAuthToken();

//         authTokens[authToken] = useremail;

//         res.cookie('AuthToken', authToken);
//         res.redirect('');
//         return;
//     } else {
//         res.render('login', {
//             message: 'Invalid username or password',
//             messageClass: 'alert-danger'
//         });
//     }
// });

app.post("/studentlogin", function (req, res) {
  Student.findOne({
    useremail: req.body.useremail,
    password: req.body.password,
  })
    .then((login) => {
      if (login) {
        console.log(login);
        sessionStorage.setItem("id", login._id);
        sessionStorage.setItem("useremail", login.useremail);
        console.log(sessionStorage.getItem("id"));
        res.render("", {
          login: login,
        });
      } else {
        console.log("User doesnot exist");
        res.render("studentlogin", {
          err: true,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/adminlogin", function (req, res) {
  Admin.findOne({
    email: req.body.email,
    password: req.body.password,
  })
    .then((login) => {
      if (login) {
        console.log(login);
        sessionStorage.setItem("id", login._id);
        sessionStorage.setItem("useremail", login.email);
        console.log(sessionStorage.getItem("id"));
        res.render("adminPanel", {
          login: login,
        });
      } else {
        console.log("User doesnot exist");
        res.render("adminlogin", {
          err: true,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// rendering the task Page
app.get("/task", function (req, res) {
  var id = sessionStorage.getItem("id");
  var useremail = sessionStorage.getItem("useremail");
  console.log(id);
  console.log(useremail);

  Task.find({ studentId: id }, function (err, task) {
    if (err) {
      console.log("Error in fetching tasks from db");
      return;
    }

    return res.render("task", {
      // tittle: "Home",
      task: task,
    });
  });
});
// const pipeline=Mycourse.aggregate([{
//     $group: {
//       _id: "Core",
//       totalCredits: {
//         $sum: "$course_credit"
//       }
//     }
//   }])

// var coretaken=Mycourse.aggregate(
//     [
//       {
//         $group: {
//           _id: "Core",
//           totalCredits: {
//             $sum: "$course_credit"
//           }
//         }
//       }
//     ])
// console.log(pipeline)
//to show dynamic variables in course.hbs file
var demo = {
  cr: 110,
  ct: 33,
  gr: 50,
  gt: 30,
  mr: 40,
  mt: 33,
};
// rendering the courses Page
app.get("/course", function (req, res) {
  Course.find({}, function (err, course) {
    if (err) {
      console.log("Error in fetching courses from db");
      return;
    }
    Mycourse.find({}, function (err, mycourse) {
      if (err) {
        console.log("Error in fetching courses from db");
        return;
      }
      return res.render("course", {
        // tittle: "Home",
        course: course,
        mycourse: mycourse,
        demo: demo,
      });
    });
  });
});
app.get("/adminCourses", function (req, res) {
  Course.find({}, function (err, admincourse) {
    if (err) {
      console.log("Error in fetching courses from db");
      return;
    }
    return res.render("adminCourses", {
      // tittle: "Home",
      admincourse: admincourse,
    });
  });
});
//admin adding course page
app.post("/adminCourses", function (req, res) {
  //  console.log("Creating Task");

  Course.create(
    {
      course_name: req.body.course_name,
      course_cat: req.body.course_cat,
      course_credit: req.body.course_credit,
      course_faculty: req.body.course_faculty,
      course_rating: 0,
      studentId: sessionStorage.getItem("id"),
    },
    function (err, newcourse) {
      if (err) {
        console.log("error in creating course", err);
        return;
      }
      //console.log(newtask);
      return res.redirect("back");
    }
  );
});
//admin deleting courses
app.get("/delete-course", function (req, res) {
  // get the id from query
  var id = req.query;

  // checking the number of tasks selected to delete
  var count = Object.keys(id).length;
  for (let i = 0; i < count; i++) {
    // finding and deleting tasks from the DB one by one using id
    Course.findByIdAndDelete(Object.keys(id)[i], function (err) {
      if (err) {
        console.log("error in deleting course");
      }
    });
  }
  return res.redirect("back");
});
app.get("/adminStudents", function (req, res) {
  Student.find({}, function (err, student) {
    if (err) {
      console.log("Error in fetching courses from db");
      return;
    }
    return res.render("adminStudents", {
      // tittle: "Home",
      student: student,
    });
  });
});
app.get("/enrollStudent", function (req, res) {
  // get the id from query
  // var id = req.query;

  // // checking the number of tasks selected to delete
  // var count = Object.keys(id).length;
  // for (let i = 0; i < count; i++) {
  //   // finding and deleting tasks from the DB one by one using id

  //   Student.findByIdAndDelete(Object.keys(id)[i], function (err) {
  //     if (err) {
  //       console.log("error in deleting course");
  //     }
  //   });
  // }
  return res.redirect("back");
});
// app.get('/course', function(req, res) {
//     Mycourse.aggregate(
//       [
//         {
//           $group: {
//             _id: {course_cat:"$course_cat"},
//             totalCredits: {
//               $sum: "$course_credit"
//             }
//           }
//         }
//       ],
//       function(err, result) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.json(result);
//         }
//       }
//     );
//   });
//display my course only
app.get("/mycourse", function (req, res) {
  var id = sessionStorage.getItem("id");
  Mycourse.find({ studentId: id }, function (err, mycourse) {
    if (err) {
      console.log("Error in fetching tasks from db");
      return;
    }

    return res.render("mycourse", {
      // tittle: "Home",
      mycourse: mycourse,
      demo: demo,
    });
  });
});
//display my course only

//function(err, login){
//     if(err){
//         console.log('Error in fetching tasks from db');
//         return;
//     }
//     console.log(login)
//     return res.render('', {
//         // tittle: "Home",

//display the filtered course only
app.get("/display-course", function (req, res) {
    Course.find(
      {
        $or: [
          { course_cat: req.query.course_cat },
          { course_faculty: req.query.course_faculty },
          { course_credit: req.query.course_credit },
        ],
      },
      function (err, course) {
        if (err) {
          console.log("Error in fetching tasks from db");
          return;
        }
  
        return res.render("course", {
          // tittle: "Home",
          course: course,
        });
      }
    );
  });

//create a new contact in our database
app.post("/contact", async (req, res) => {
  try {
    const registerEmployee = new Contact({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });

    const completed = await registerEmployee.save();
    res.status(201).render("contact");
  } catch (error) {
    res.status(400).send(error);
  }
});
// creating Tasks
app.post("/task", function (req, res) {
  //  console.log("Creating Task");

  Task.create(
    {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      studentId: sessionStorage.getItem("id"),
    },
    function (err, newtask) {
      if (err) {
        console.log("error in creating task", err);
        return;
      }

      let content =
        "BEGIN:VCALENDAR\n" +
        "VERSION:2.0\n" +
        "BEGIN:VEVENT\n" +
        "SUMMARY: Reminder\n" +
        "DTSTART;VALUE=DATE:20201030T093000Z\n" +
        "DTEND;VALUE=DATE:20201030T113000Z\n" +
        "LOCATION:Webex \n" +
        "DESCRIPTION:Description123\n" +
        "STATUS:CONFIRMED\n" +
        "SEQUENCE:3\n" +
        "BEGIN:VALARM\n" +
        "TRIGGER:-PT10M\n" +
        "DESCRIPTION:Description123\n" +
        "ACTION:DISPLAY\n" +
        "END:VALARM\n" +
        "END:VEVENT\n" +
        "END:VCALENDAR";

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "priyanka.p@ahduni.edu.in",
          pass: "piyupatel@seas19",
        },
      });

      let toEmail = "aayushi.c@ahduni.edu.in";
      let text = "Project Work";

      let mailOptions = {
        from: "priyanka.p@ahduni.edu.in",
        to: sessionStorage.getItem("useremail"),
        subject: "Student Ally Tasks",
        text: text,
        icalEvent: {
          filename: "invitation.ics",
          method: "request",
          content: content,
        },
      };

      transporter.sendMail(mailOptions, function (err, sucess) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sent successfully");
        }
        tls: {
          rejectUnauthorized: false;
        }
      });

      //console.log(newtask);
      return res.redirect("back");
    }
  );
});
// app.post('/task', async (req,res)=>{
//     try{
//         const registerTask= new Task({
//             name:req.body.name,
//             description:req.body.description,
//             dueDate:req.body.dueDate,
//         })

//         const completed=await registerTask.save();
//         res.status(201).render("task");
//         }catch(error){
//         res.status(400).send(error);
//         }
//    })
// deleting Tasks
app.get("/delete-task", function (req, res) {
  // get the id from query
  var id = req.query;

  // checking the number of tasks selected to delete
  var count = Object.keys(id).length;
  for (let i = 0; i < count; i++) {
    // finding and deleting tasks from the DB one by one using id
    Task.findByIdAndDelete(Object.keys(id)[i], function (err) {
      if (err) {
        console.log("error in deleting task");
      }
    });
  }
  return res.redirect("back");
});
// Now post needs the body parser in order to be able to retrieve the data and sort of "translate it" to JS, for that you need the body parser.

//app.use(bodyParser.urlencoded({extended: false})) //Post Body Parser

// app.get('/task',(req,res,next) =>{
//     //Here fetch data using mongoose query like
//     Task.find({}, function(err, allTasks) {
//     if (err) throw err;
//     // object of all the users
//     res.render('task',{allTasks:allTasks});
//   })
// })
//create server
app.listen(port, () => {
  console.log(`server is running at port no. ${port}`);
});

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'aayushi8062002@gmail.com',
//       pass: 'aayushi8622'
//     }
//   });

//   var mailOptions = {
//     from: 'aayushi8062002@gmail.com',
//     to: 'anny8062002@gmail.com',
//     subject: 'Sending Email using Node.js',
//     //text: 'That was easy!'
//     html: '<h1>Welcome</h1><p>That was easy!</p>'
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// $or:[{$and:[{course_cat:req.query.course_cat},{course_faculty:req.query.course_faculty}]},
// {$and:[{course_faculty:req.query.course_faculty},{course_credit:req.query.course_credit}]},
// {$and:[{course_cat:req.query.course_cat},{course_credit:req.query.course_credit}]},
// {$and:[{course_cat:req.query.course_cat},{course_credit:req.query.course_credit},{course_faculty:req.query.course_faculty}]},
// {course_cat:req.query.course_cat},{course_faculty:req.query.course_faculty},{course_credit:req.query.course_credit}]
//Note: we are able to run our server on port 3000 only due to adding "dev": "nodemon src/app.js -e js,hbs" in the script section of package.json

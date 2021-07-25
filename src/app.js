const express=require('express');//import express module
require("./db/conn");
//for contact form validation
const Contact=require("./models/contactDetails");
const Task=require("./models/taskDetails");
const Course=require("./models/courseDetails");
const Mycourse=require("./models/mycourseDetails");
const Student=require("./models/student")
const mongoose=require("mongoose")
const mongodb=require("mongodb")
const db=require("./db/conn")
const sessionStorage = require('node-sessionstorage');


const hbs=require("hbs");
//if we want to make static website then include public folder and call it here in app.js file 
const path=require('path');
const bodyParser=require('body-parser');
const nodemailer=require("nodemailer");
const { connect } = require('http2');

const collection="tasks";



const app=express();//all the properties and methods of express module will be stored in app variable
const port=process.env.PORT || 3000;
app.use(bodyParser.json());


//setting the path
const staticpath=path.join(__dirname,'../public');
const templatepath=path.join(__dirname,'../templates/views');
const partialpath=path.join(__dirname,'../templates/partials');

app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")));

app.use(express.json());
// to use encrypted data
app.use(express.urlencoded());


//middleware

app.use(express.static(staticpath));

//set the view engine in express
app.set('view engine', 'ejs');
 //app.engine('hbs', exhbs());
 app.set('view engine', 'hbs');


//app.set("view engine","hbs");

app.set("views",templatepath);


//to get partials we first imported hbs through require [look at the top of code]
hbs.registerPartials(partialpath);


//app.get(path,callback) -syntax
//if path parameter is / then simply path is your homepage
app.get('/',(req,res)=>{
    //here we want to render index.hbs file therefore simply write index inside render
    res.render("index")
    //res.send("hey there");
})

app.get('/about',(req,res)=>{
    
    res.render("about")
    
})
app.get('/contact',(req,res)=>{
     res.render("contact")
    })
app.get('/login',(req,res)=>{
        res.render("login")
    })


app.post('/login', function(req, res){
        
         Student.findOne({
             useremail:req.body.useremail,
             password:req.body.password,
        }).then( login =>{
             if(login){
                 console.log(login)
                sessionStorage.setItem('id', login._id);
                sessionStorage.setItem('useremail', login.useremail);
                console.log(sessionStorage.getItem('id')); 
                 res.render('', {
                     login: login,                         
                    }
                 )
             }
             else{
                 console.log("User doesnot exist")
                 res.render('login',{
                     
                     err: true
                 })
             }
         }).catch(err=>{
             console.log(err);
         })
        });
        
// rendering the task Page
app.get('/task', function(req, res){
    var id=sessionStorage.getItem('id');
    var useremail=sessionStorage.getItem('useremail');
    // console.log(id);
    Task.find({studentId:id}, function(err, task){
        if(err){
            console.log('Error in fetching tasks from db');
            return;
        }

        return res.render('task', {
            // tittle: "Home",
            task: task
        });
    }
)});

//to display variables in course.hbs file
var demo = {
    cr : 110,
    ct: 33 ,
    gr : 50,
    gt: 30,
    mr : 40,
    mt: 33,
}
// rendering the courses Page
app.get('/course', function(req, res){
    
    Course.find({}, function(err, course){
        if(err){
            console.log('Error in fetching tasks from db');
            return;
        }
        Mycourse.find({},function(err,mycourse){
            if(err){
                console.log('Error in fetching tasks from db');
                return;
            }
            return res.render('course', {
                // tittle: "Home",
                course: course,
                mycourse:mycourse,
                demo:demo,
            });
        })
        
    })
});

//display my course only
app.get('/mycourse', function(req, res){
    var id=sessionStorage.getItem('id');
    Mycourse.find({studentId:id}, function(err, mycourse){
        if(err){
            console.log('Error in fetching tasks from db');
            return;
        }

        return res.render('mycourse', {
            // tittle: "Home",
            mycourse: mycourse,
            demo:demo,
        });
    }
)});

//display the filtered course only
app.get('/display-course', function(req, res){
   
    Course.find({$or:[{course_cat:req.query.course_cat},{course_faculty:req.query.course_faculty},{course_credit:req.query.course_credit}]}, function(err,course){
        if(err){
            console.log('Error in fetching tasks from db');
            return;
        }

        return res.render('course', {
            
            course: course,
        });
    }
)});

//create a new contact in our database
app.post('/contact', async (req,res)=>{
    try{
        const registerEmployee= new Contact({
            name:req.body.name,
            email:req.body.email,
            message:req.body.message,
        })
        
        const completed=await registerEmployee.save();
        res.status(201).render("contact");
        }catch(error){
        res.status(400).send(error);
        }
   })
// creating Tasks and reminding user of the task
app.post('/task', function(req, res){
    //  console.log("Creating Task");
      
      Task.create({
        name: req.body.name,  
        description: req.body.description,
        date: req.body.date,
        studentId:sessionStorage.getItem('id')
          }, function(err, newtask){
          if(err){console.log('error in creating task', err); return;}
          
            
            let content = 'BEGIN:VCALENDAR\n' +
            'VERSION:2.0\n' +
            'BEGIN:VEVENT\n' +
            'SUMMARY: Reminder\n' +
            'DTSTART;VALUE=DATE:20201030T093000Z\n' +
            'DTEND;VALUE=DATE:20201030T113000Z\n' +
            'LOCATION:Webex \n' +
            'DESCRIPTION:Description123\n' +
            'STATUS:CONFIRMED\n' +
            'SEQUENCE:3\n' +
            'BEGIN:VALARM\n' +
            'TRIGGER:-PT10M\n' +
            'DESCRIPTION:Description123\n' +
            'ACTION:DISPLAY\n' +
            'END:VALARM\n' +
            'END:VEVENT\n' +
            'END:VCALENDAR';

                
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, 
                auth: {
                    user: "priyanka.p@ahduni.edu.in",
                    pass: "piyupatel@seas19"
                }
            })

            let toEmail = "aayushi.c@ahduni.edu.in";
            let text = "Project Work";

            let mailOptions = {
                from: "priyanka.p@ahduni.edu.in",
                to: sessionStorage.getItem('useremail'),
                subject: "Stxudent Ally Tasks",
                text: text,
                icalEvent: {
                    filename: 'invitation.ics',
                    method: 'request',
                    content: content
                }
            }

            transporter.sendMail(mailOptions, function(err, sucess){
                if(err) {
                    console.log(err)
                }
                else {
                    console.log("Email sent successfully")
                }
                tls: {
                    rejectUnauthorized: false
                }
            });


          //console.log(newtask);
          return res.redirect('back');
  
      });
  });

// deleting Tasks
app.get('/delete-task', function(req, res){
    // get the id from query
    var id = req.query ;

    // checking the number of tasks selected to delete
    var count = Object.keys(id).length;
    for(let i=0; i < count ; i++){
        
        // finding and deleting tasks from the DB one by one using id
        Task.findByIdAndDelete(Object.keys(id)[i], function(err){
        if(err){
            console.log('error in deleting task');
            }
        })
    }
    return res.redirect('back'); 
});

//create server
app.listen(port,()=>{
    console.log(`server is running at port no. ${port}`)
})

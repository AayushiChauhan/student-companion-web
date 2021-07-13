const express=require('express');//import express module
require("./db/conn");
//for contact form validation
const Contact=require("./models/contactDetails");
const Task=require("./models/taskDetails");
const hbs=require("hbs");
//if we want to make static website then include public folder and call it here in app.js file 
const path=require('path');
const bodyParser=require('body-parser')



const app=express();//all the properties and methods of express module will be stored in app variable
const port=process.env.PORT || 3000;

//setting the path
const staticpath=path.join(__dirname,'../public');
const templatepath=path.join(__dirname,'../templates/views');
const partialpath=path.join(__dirname,'../templates/partials');

//console.log(path.join(__dirname,'../public'));  -testing

//best way to include bootstrap and jquery in nodejs applications
//root is set look at '/css'

app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")));
//if we submit contact us form then data entered should be encoded and then displayed (ie we get that entered data)
app.use(express.json());//only this line of code is needed if we are using postman otherwise below line is required if we using just mongodb (Compass)
app.use(express.urlencoded({extended:false}));

//make sure you place body-parser before your CRUD handlers!
//app.use(bodyParser.urlencoded({extended:false}));

//middleware

app.use(express.static(staticpath));
//app.use(express.static(__dirname+'../public'));
//set the view engine in express
app.set("view engine","hbs");
//as new folder template is made which contains "views" and "partials" folder in it
//basically below command tells express how to get "views" folder through "templatepath"
app.set("views",templatepath);
//to get partials we first imported hbs through require [look at the top of code]
hbs.registerPartials(partialpath);
//after these below code will not run as express came to know that it has to run the static folder called "public"
//routing
//app.get(path,callback) -syntax
//if path parameter is / then simply path is your homepage
app.get('/',(req,res)=>{
    //here we want to render index.hbs file therefore simply write index inside render
    res.render("index")
    //res.send("hey there");
})
app.get('/task',(req,res)=>{
    //here we want to render index.hbs file therefore simply write index inside render
    res.render("task")
    //res.send("hey there");
})
app.get('/course',(req,res)=>{
    //here we want to render index.hbs file therefore simply write index inside render
    res.render("course")
    //res.send("hey there");//used if we want .html file instead of .hbs file.
})
app.get('/about',(req,res)=>{
    //here we want to render index.hbs file therefore simply write index inside render
    res.render("about")
    //res.send("hey there");
})
app.get('/contact',(req,res)=>{
     res.render("contact")
    })
//create a new task in our database
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

app.post('/task', async (req,res)=>{
    try{
        const registerTask= new Task({
            name:req.body.name,
            description:req.body.description,
            dueDate:req.body.dueDate,
        })
        
        const completed=await registerTask.save();
        res.status(201).render("task");
        }catch(error){
        res.status(400).send(error);
        }
   })

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
app.listen(port,()=>{
    console.log(`server is running at port no. ${port}`)
})

//Note: we are able to run our server on port 3000 only due to adding "dev": "nodemon src/app.js -e js,hbs" in the script section of package.json
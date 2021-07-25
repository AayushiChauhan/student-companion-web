
const mongoose=require('mongoose');

//creating a database
//.connect is a promise function in mongoose
mongoose.connect("mongodb://localhost:27017/studentdb",{//database named studentdb gets created
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
    //if promise is accepted
}).then(()=>{
    console.log('connection was succesfull, congratulations!')
    //if promise is rejected display the error due to which it failed
}).catch((error)=>{
    console.log(error);
})
// aquire the connection (to check if it is successful)
const db = mongoose.connection;
// exporting the database
module.exports=db;

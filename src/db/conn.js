
const mongoose=require('mongoose');
//const ObjectID =require('mongodb').ObjectID;
//const dbname="studentdb";

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
// module.exports={mongoose};
// const getPrimaryKey=(_id)=>{
//     return objectID(_id);
// }

//code written refering that article on mongodb!
// const MongoClient=require('mongodb').MongoClient
// const url = 'mongodb://127.0.0.1:27017'
// const dbName='studentdb'
// const express=require('express')
// const app=express()
// MongoClient.connect(url,{
//     useNewUrlParser:true,
//     useUnifiedTopology: true
// }).then((client)=>{
//     console.log('connection was succesfull, congratulations!')
//     const db = client.db('studentdb')
//     const coursesCollection = db.collection('contact')
//     app.post('./templates/partials/contact', (req, res) => {
//         coursesCollection.insertOne(req.body)
//         .then(result => {
//           console.log(result)
//           res.redirect('/')
//         })
//         .catch(error => console.error(error))
//       })
//       // app.get('/', (req, res) => {
//       //   db.collection('courses').find().toArray()
//       //     .then(results => {
//       //       console.log(results)
//       //     })
//       //     .catch(error => console.error(error))
//       //   // ...
//       // })
// }).catch((error)=>{
//     console.log(error)
// })

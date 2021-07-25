var nodemailer = require("nodemailer");
var remind = require('../index1');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'Aayushi Chauhan', //provide gmail username
        pass: 'aayushi8622' //provide gmail password
    }
});

remind.setMailTransporter(transporter); //configure transporter in the reminder module

var email_sender = 'aayushi8062002@gmail.com'; //sender's email (gmail)
var email_recipient = 'anny8062002@gmail.com'; //recipient's email 


//remind after
var a = remind.after('10 minutes', email_sender, email_recipient, 'Call home');

//remind at
var b = remind.at('13:05:00', email_sender, email_recipient, 'Get ready for team lunch'); //provide time in 24 hour format

//remind every (recurring reminder)
var c = remind.every('15 minutes', email_sender, email_recipient, 'Drink water and work');
//sendReminder('16:49:00',email_sender,email_recipient,"have a great day!");

//cancel reminder
remind.cancel(a);

//cancel recurring reminder
remind.cancelRecurring(c);
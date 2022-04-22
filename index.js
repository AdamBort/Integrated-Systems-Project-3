/**
* PLOT is an app that lets you find and save your favourite crops.
* We use the OpenFarm API to find crop data. See also:
* https://github.com/openfarmcc/OpenFarm/blob/master/docs/api_docs.md 
* We use MongoDB to maintain a list of crops for each user.
*/ 

// get environment variables
require('dotenv').config() 

// SETUP MONGODB
const MONGODB_URI = process.env.MONGODB_URI 
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.ACCOUNT_AUTH; // Your Auth Token from www.twilio.com/console
const phone = process.env.TWILIO_PHONE_NUMBER;

// MongoDB Driver
const { MongoClient } = require('mongodb') 


// axios HTTP client https://www.npmjs.com/package/axios
const axios = require('axios');  
const twilio = require('twilio');
const cron = require('node-cron');
const qs = require('qs');
/* SETUP EXPRESS */
const express = require ('express')   // express framework 
const cors = require ('cors')         // Cross Origin Resource Sharing
const bodyParser = require('body-parser'); // middleware to parse JSON data that is sent from the frontend.
const { send } = require('express/lib/response');
const app = express(); // enable express
app.use( cors() ); // make express attach CORS headers to responses
app.use( express.json() ); // add json capabilities to our express app 

/* Serve up static assets, i.e. the Frontend of the site. */
app.use( '/', express.static('public')) 

app.get('/createMessage', async (req,res) => { 
  /** relay search filters to the openfarm API */
  // console.log(req.query)
  
  const client = new twilio(accountSid, authToken);
  if (req.query.timeScheduled >= 1 && req.query.timeScheduled < 168){
    const newTime = (req.query.timeScheduled * 60) +  0.1;
    const sendWhen = new Date(new Date().getTime() + newTime * 60000);
    const message = await client.messages.create({
      body: req.query.enteredMessage,
      to: '+1'+req.query.phoneNumber, // Text this number
     // from: phone,
      from: process.env.MESSAGING_SID,
      scheduleType: 'fixed',
      sendAt: sendWhen.toISOString(),
       
    })
    .then((message) => {
   
      console.log(message);
      res.send("Reminder set, will occur in "+ req.query.timeScheduled+" hours");
      
    });
  }
  else{
    const message = await client.messages.create({
      body: req.query.enteredMessage,
      to: '+1'+req.query.phoneNumber, // Text this number
     // from: phone,
      from: process.env.MESSAGING_SID,
     
       
    })
    .then((message) => {
   
      console.log(message);
      res.send("Message sent - reminders set for less then 1 hour ahead won't work");
      
    });
  }
 
  
})

  


// axios(config)
// .then(function (response) {
//   console.log(response.data);
// })
// .catch(function (error) {
//   console.log(error);
// });

  // axios.get(

  //     'https://openfarm.cc/api/v1/crops/', 
  //     {params: {filter: req.query.filter}}
  // )
  // .then( results => { 
  //     // check if the crops have images or not before sending them.
  //     let cropsWithImage = results.data.data.filter(
  //         crop=>crop.attributes.main_image_path.includes('s3.amazon')
  //     )
  //     if( cropsWithImage.length) return res.send(cropsWithImage) 
  //     res.send("No Results")  
      
  // })
  // .catch( err=> res.send("Search Error") )


// app.get( '/createMessage', bodyParser.json(), (req,res) => { 
// console.log(req.body.email) // "user@example.com"
//   console.log(req.body.password) // "helloworld"
// const client = new twilio(accountSid, authToken);

//     client.messages.create({
//         body: req.body.enteredMessage,
//         to: '+1'+req.body.phoneNumber, // Text this number
//         from: phone, // From a valid Twilio number
//   })
//   .then((message) => console.log(message.sid));

        


// })






/** Tell Express to start listening. */
const PORT = process.env.PORT || 5000  
app.listen(PORT, () => {
  console.log("We are live on port "+PORT )
})
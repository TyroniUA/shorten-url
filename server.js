'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express();
var shortId = require("shortid");

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI)

app.use(cors());
app.use(bodyParser());
let Schema = mongoose.Schema;
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
let urlSchema = new Schema({
  id: Number,
  url: String
})

let urlModel = mongoose.model('URL', urlSchema);

// use of the static content & rendreing the page
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.post('/api/shorturl/new', (req,res) =>{
 let url = req.body.url
 let urlRegex = /https:|www.|\/|http/g
 let url2 = url.replace(urlRegex, '')
  console.log(url2)
  
  dns.lookup(url2, (err,address)=>{
    if (err){
      console.log('fail')
      res.json({status: 'Your link is not valid. Please provide another'})
    }
    else{
      console.log('passed')
      Finishing()
      
    }
  })

  const Finishing =()=>{
    console.log('start');
     urlModel.find()
    .exec()
    .then(data=>
         {
      let theData = data;
      let newUrl = new urlModel({"id":theData.length, "url": url2});
      theData = theData.filter((obj)=>obj["url"]===url2)
      if(theData.length ===0){
        console.log('Im here...')
        newUrl.save()
        .then(result=>{
          console.log('Success!')
          res.json(result)
        })
        .catch(err=>{
          console.log(err)
          res.json({"error":err})
        })
      } else{
        res.json({"error": `Url already in database as ${theData[0].id}`})
      }
    })
  }
      
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});
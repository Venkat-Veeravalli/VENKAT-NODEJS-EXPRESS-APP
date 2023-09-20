const request = require("request");
const express = require('express');
const path = require('path')
const app = express();
app.use(express.static("public"));
const admin = require('firebase-admin');
var serviceAccount = require("./key.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.set('view engine','ejs');

app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))

const db = admin.firestore();

app.get('/',function (req,res) {
  res.render( __dirname + "/views/" + "dash" );
});
app.get('/dash',function (req,res) {
  res.render( __dirname + "/views/" + "dash" );
});
app.get('/venkat',function (req,res) {
  res.render( __dirname + "/views/" + "venkat" );
});

app.get('/services',function (req,res) {
  res.render( __dirname + "/views/" + "services" );
});

app.get('/about',function (req,res) {
  res.render( __dirname + "/views/" + "about" );
});

app.get('/signup',function (req,res) {
  res.render( __dirname + "/views/" + "signup.ejs" );
});

app.get('/signupsubmit',function (req, res) {
  db.collection("Users")
    .add({
      username: req.query.username,
      email: req.query.email,
      password: req.query.password,
      CPassword: req.query.CPassword,
    })
    .then(() => {
      res.render("signup.ejs");
    });
});

app.get('/home',function (req,res) {
  res.render( __dirname + "/views/" + "home.ejs" );
});

app.get('/loginsubmit',function (req, res) {
  db.collection("Users")
  .where("email", "==" ,req.query.email)
  .where("password", "==" ,req.query.password)
  .get()
  .then((docs) =>{
    if(docs.size>0){
      res.render("home.ejs");
    }else{
      res.render("fail.ejs");
    }
    console.log(docs.size)
  });
});

app.get('/weathersubmit',(req,res) =>{
  const location = req.query.location;
  request(
    'https://api.weatherapi.com/v1/forecast.json?key=1d38e74f95ff438e84b64154220306&q='+location+'&days=7', function (error, response, body){
      if("error" in JSON.parse(body))
      {
        if((JSON.parse(body).error.code.toString()).length > 0)
        {
          res.render("home.ejs");
        }
      }
      else
      {
        
        const country= JSON.parse(body).location.country;
        const loctime = JSON.parse(body).location.localtime;
        const temp_c = JSON.parse(body).current.temp_c;
        const temp_f = JSON.parse(body).current.temp_f;
        const wind_kph = JSON.parse(body).current.wind_kph;
        const humi = JSON.parse(body).current.humidity;
       
        res.render('location',{location:location,country:country,loctime:loctime,temp_c:temp_c,temp_f:temp_f,wind_kph:wind_kph,humi:humi});
      } 
    }
    );
});

app.get('/locsubmit', (req, res) => {
  res.render("weather");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
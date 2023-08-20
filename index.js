const express = require('express');
const app = express();
app.use(express.static("public"));
const admin = require('firebase-admin');
var serviceAccount = require("./ServiceAccountKey.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const db = admin.firestore();

app.get('/signup',function (req,res) {
  res.sendFile( __dirname + "/public/" + "signup.html" );
});



app.get('/signupsubmit',function (req, res) {
  db.collection("Users")
    .add({
      username: req.query.username,
      Email: req.query.Email,
      password: req.query.password,
      CPassword: req.query.CPassword,
      Dob: req.query.dob
    })
    .then(() => {
      res.send("Signup Successfully,please login");
    });
});

app.get('/login',function (req,res) {
  res.sendFile( __dirname + "/public/" + "login.html" );
});

app.get('/loginsubmit',function (req, res) {
  db.collection("Users")
  .where("Email", "==" ,req.query.email)
  .where("password", "==" ,req.query.password)
  .get()
  .then((docs) =>{
    if(docs.size>0){
      res.send("Login Successfully");
    }else{
      res.send("Login Unsuccessfull");
    }
    console.log(docs.size)
  });
});

app.get('/dashboard',function (req,res) {
  res.send("HI");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const passwordHash = require('password-hash');

const app = express();
const port = 3000;


const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/public'));
app.use('/assets', express.static(__dirname + '/public/assets'));

app.get('/', (req, res) => {
  res.render(__dirname + '/views/dash');
});

app.get('/dash', (req, res) => {
  res.render(__dirname + '/views/dash');
});

app.get('/venkat', (req, res) => {
  res.render(__dirname + '/views/venkat');
});

app.get('/services', (req, res) => {
  res.render(__dirname + '/views/services');
});

app.get('/about', (req, res) => {
  res.render(__dirname + '/views/about');
});

app.get('/signup', (req, res) => {
  res.render(__dirname + '/views/signup.ejs');
});

app.post('/signupsubmit', (req, res) => {
  const email = req.body.email;
  const username = req.body.username;

  
  db.collection('UsersNew')
    .where('email', '==', email)
    .get()
    .then((emailDocs) => {
      db.collection('UsersNew')
        .where('username', '==', username)
        .get()
        .then((usernameDocs) => {
          if (emailDocs.size > 0) {
            res.render('wrong');
          } else if (usernameDocs.size > 0) {
            res.render('wrong');
          } else {
          
            db.collection('UsersNew')
              .add({
                username: username,
                email: email,
                password: passwordHash.generate(req.body.password),
                CPassword: passwordHash.generate(req.body.CPassword),
              })
              .then(() => {
                res.render('signup.ejs');
              })
              .catch(() => {
                res.send('Something went wrong.');
              });
          }
        })
        .catch(() => {
          res.send('Something went wrong.');
        });
    })
    .catch(() => {
      res.send('Something went wrong.');
    });
});

app.get('/home', (req, res) => {
  res.render(__dirname + '/views/home.ejs');
});

app.post('/loginsubmit', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.collection('UsersNew')
    .where('email', '==', email)
    .get()
    .then((docs) => {
      if (docs.size === 0) {
        res.render('fail.ejs'); 
      } else {
      
        const userDoc = docs.docs[0];
        const hashedPassword = userDoc.data().password;
        if (passwordHash.verify(password, hashedPassword)) {
          res.render('home.ejs'); 
        } else {
          res.render('fail.ejs');
        }
      }
    })
    .catch(() => {
      res.send('Something went wrong.');
    });
});

app.post('/weathersubmit', (req, res) => {
  const location = req.body.location;
  request(
    'https://api.weatherapi.com/v1/forecast.json?key=1d38e74f95ff438e84b64154220306&q=' +
      location +
      '&days=7',
    function (error, response, body) {
      if ('error' in JSON.parse(body)) {
        if (JSON.parse(body).error.code.toString().length > 0) {
          res.render('home.ejs');
        }
      } else {
        const country = JSON.parse(body).location.country;
        const loctime = JSON.parse(body).location.localtime;
        const temp_c = JSON.parse(body).current.temp_c;
        const temp_f = JSON.parse(body).current.temp_f;
        const wind_kph = JSON.parse(body).current.wind_kph;
        const humi = JSON.parse(body).current.humidity;

        res.render('location', {
          location: location,
          country: country,
          loctime: loctime,
          temp_c: temp_c,
          temp_f: temp_f,
          wind_kph: wind_kph,
          humi: humi,
        });
      }
    }
  );
});

app.post('/locsubmit', (req, res) => {
  res.render('weather');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

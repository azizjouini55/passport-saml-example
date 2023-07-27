let fs = require('fs');
const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const saml = require('passport-saml');
const jwt = require("jsonwebtoken");
const axios = require('axios');


dotenv.load();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


const samlStrategy = new saml.Strategy({
  path:process.env.CALLBACK_URL,
  // URL that goes from the Identity Provider -> Service Provider
  callbackUrl: process.env.CALLBACK_URL,
  // URL that goes from the Service Provider -> Identity Provider
  entryPoint: process.env.ENTRY_POINT,
  // Usually specified as `/shibboleth` from site root
  issuer: process.env.ISSUER,
  identifierFormat: null,
  // Service Provider private key
  encryptionAlgorithm: 'http://www.w3.org/TR/2002/REC-xml-exc-c14n-20020718/',
  privateKey: fs.readFileSync(process.env.PV_KEY,"utf-8" ),
  decryptionPvk: fs.readFileSync(process.env.PV_KEY ,"utf-8" ),
  decryptionCert: fs.readFileSync(process.env.SP_CERT,"utf-8"  ),
  signingCert:fs.readFileSync(process.env.SP_CERT ,"utf-8" ),

  // Identity Provider's public key
  cert: fs.readFileSync(process.env.IDP_CERT, 'utf8'),
  validateInResponseTo: false,
  disableRequestedAuthnContext:  false
}, function(profile, done) {
  return done(null, profile); 
});
passport.use(samlStrategy);


let app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  name : 'codeil',
  secret : process.env.SESSION_SECRET,
  resave :false,
  saveUninitialized: true,
  cookie : {
          maxAge:(1000 * 60 * 100)
  }      
}));
app.use(session());
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    return res.redirect('/login');
}



app.get('/',ensureAuthenticated, 
  (req, res) => { res.send('Authenticated with TUD credentials')}
);

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login/fail', failureFlash: true }),
 
);


//custom routes here using axios 
app.get('/login/py-app/',ensureAuthenticated,
 async  (req, res) => {
  try {
    const response = await axios.get('http://py-app:8081');
    // Process the response from the other microservice
    res.send(response.data)
    //res.json(response.data);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

}
  )
//custom routes
app.post('/login/callback', 
   passport.authenticate('saml', {failureRedirect: '/login/fail' , failureFlash: true}),
  (req, res) => { res.redirect('/');

  }
);

app.get('/login/fail', 
  (req, res) => {
    res.status(401).send('Login failed');
  }
);

app.get('/Shibboleth.sso/Metadata', 
  (req, res) => {
    res.type('application/xml');
    res.status(200).send(samlStrategy.generateServiceProviderMetadata( fs.readFileSync(process.env.SP_CERT, 'utf8'),fs.readFileSync(process.env.SP_CERT, 'utf8')));
  }
);
//general error handler
app.use((err, req, res, next) => {
  console.log("Fatal error: " + JSON.stringify(err));
  next(err);
});

let server = app.listen(process.env.PORT, function () {
  console.log('Listening on port %d', server.address().port)

  
});

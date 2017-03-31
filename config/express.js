var config = require('./config'),
  express = require('express'),
  debug = require('debug')('http'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  flash = require('connect-flash'),
  paypal = require('paypal-rest-sdk'),
  session = require('express-session'),
  http = require('http'),
  path = require('path'),
  fs = require('fs'),
  index = require('../app/controllers/index.server.controller');




module.exports = function() {
  var app = express();

  index.init(config);


  config_options = config.api;




  // var payment = {
  //   "intent": "sale",
  //   "payer": {
  //     "payment_method": "credit_card",
  //     "funding_instruments": [{
  //       "credit_card": {
  //         "type": "visa",
  //         "number": "4321470000325737",
  //         "expire_month": "9",
  //         "expire_year": "2018",
  //         "cvv2": "453",
  //         "first_name": "Md Rezaur",
  //         "last_name": "Rahman"
  //       }
  //     }]
  //   },
  //   "transactions": [{
  //     "amount": {
  //       "total": "3.00",
  //       "currency": "USD"
  //     },
  //     "description": "My awesome payment"
  //   }]
  // };
  //
  // paypal.payment.create(payment, function(error, payment) {
  //   if (error) {
  //     debug(error);
  //   } else {
  //     debug("in payment")
  //       //if(payment.payer.payment_method === 'paypal') {
  //     if (payment.payer.payment_method === 'credit_card') {
  //       debug("payment method is credit card, payment id: " + payment.id + "payment type" + payment)
  //         // req.session.paymentId = payment.id;
  //       var redirectUrl;
  //       for (var i = 0; i < payment.links.length; i++) {
  //         var link = payment.links[i];
  //         debug("links " + payment.links[i].method + " href" + payment.links[i].href)
  //           //  if (link.method === 'REDIRECT') {
  //         redirectUrl = payment.links[i].href;
  //         //}
  //       }
  //       //res.redirect(redirectUrl);
  //       debug("redirect url " + redirectUrl)
  //     }
  //   }
  // });

  app.use(express.static('./public'));

  // app.use(express.static(path.join(__dirname, 'public')));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'OurSuperSecretCookieSecret'
  }));

  app.set('views', './app/views');
  app.set('view engine', 'ejs');

  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Headers', 'x-access-token, token');
    next();
  });


  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  require('../app/routes/users.server.routes.js')(app);
  require('../app/routes/dashboard.server.routes.js')(app);
  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/channels.server.routes.js')(app);
  require('../app/routes/sorders.server.routes.js')(app);




  return app;
};

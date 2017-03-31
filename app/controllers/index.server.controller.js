var paypal = require('paypal-rest-sdk');
var debug = require('debug')('http');

exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('homepage', {
            title: 'Log-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('dashboard');
    }
};


exports.init = function(c){
  config = c;
  paypal.configure(c.api);
  debug("paypal init");
  debug(process.env.NODE_ENV);
  



}

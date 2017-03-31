var User = require('mongoose').model('User');

exports.renderDashboard = function(req, res) {
    //    console.log(req);
    if (req.user) {

        if (req.user.is_admin == "1") {
            res.render('dashboard', {


                profile_url: req.user ? req.user.profile_url : '',
                fullname: req.user ? req.user.fullname : '',
                useremail: req.user ? req.user.email : ''
            });
        } else {
            res.render('profile', {
                userid: req.user ? req.user._id : '',
                profile_url: req.user ? req.user.profile_url : '',
                fullname: req.user ? req.user.fullname : '',
                useremail: req.user ? req.user.email : ''
            });

        }
        console.log(req.user.is_admin);
    } else
        res.render('login', {
            title: 'Log-in Form',
            messages: req.flash('error') || req.flash('info')
        });

};

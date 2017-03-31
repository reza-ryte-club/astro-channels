var User = require('mongoose').model('User'),
    passport = require('passport');
    var debug = require('debug')('http');
    var async = require('async');
    var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;
var randomString = require('random-string');

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Log-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/dashboard');
    }
};

exports.renderRegister = function(req, res, next) {
    if (!req.user) {
        res.render('register', {
            title: 'Register Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};



exports.renderEditUser = function(req, res, next) {
    if (req.user) {
        res.render('editUser', {
            title: 'Register Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};


/*exports.renderProfile = function(req, res, next) {
    if (!req.user) {
        res.render('profile', {
            title: 'Register Form',
            messages: req.flash('error')
        });
    }
    else {
        return res.redirect('/');
    }
};
exports.renderprofile = function(req, res){
   if (!req.user){
        res.render ('profile',{

                    fullname: req.user ? req.user.fullname : '',

                    useremail: req.user ? req.user.email : '',
                    phone: req.user ? req.user.phone : '',

                    });


   }
    else {
        return res.redirect('/');

    }

};*/
exports.register = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function(err) {

            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/login');
            } else
                res.redirect('/login');
        });
    } else {
        return res.redirect('/login');
    }
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};




exports.create = function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};

exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) {
            return next(err);
        } else {
            var totaluser = 0;
            var message = "total active users: "+users.length;
            res.json({"message":message});
        }
    });
};

exports.read = function(req, res) {
    res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
    User.findOne({
            _id: id
        },
        function(err, user) {
            if (err) {
                return next(err);
            } else {
                req.user = user;
                next();
            }
        }
    );
};


exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};
exports.renderAdd = function(req, res, next) {
    if (req.user) {
        res.render('add_user_info', {
            title: 'User add',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/login');
    }



};

// exports.delete = function(req, res, next) {
//     req.user.remove(function(err) {
//         if (err) {
//             return next(err);
//         } else {
//             res.json(req.user);
//         }
//     })
// };


exports.renderAddNewAdmin = function(req, res, next) {
    if (req.user) {
        res.render('AddNewUserAdmin', {

            profile_url: req.user ? req.user.profile_url : '',
            uid: req.user ? req.user.uid : '',
            title: 'User add',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/login');
    }



};





exports.saveOAuthUserProfile = function(req, profile, done) {
    User.findOne({
            email: profile.email
        },
        function(err, user) {
            if (err) {
                //             return done(err);
                console.log(" database err");
            } else {
                if (!user) {

                    var fbUserData = {
                        email: profile.email,
                        provider: profile.provider,
                        providerId: profile.providerId,
                        fullname: profile.fullname,

                    };

                    console.log("new user ! yayyyy");
                    user = new User(fbUserData);
                    user.save(function(err) {
                        if (err) {
                            console.log("user creation failed");
                        }

                        return done(null, user);
                        //return req.res.redirect('/dashboard');




                    });






                } else {
                    console.log("user exists!!");
                    return done(null, user);
                    //return req.res.redirect('/dashboard');

                }
            }
        });
    //     }
    // );
    console.log(profile.providerId);
    console.log(profile.email);
    console.log(profile.fullname);
    console.log(profile.providerData);


    var hello = {
        "moo": "hoo"
    };
    console.log("hello");

};



exports.updateToken = function(id, updatedData) {
    User.findByIdAndUpdate(id, updatedData, function(err, user) {
        if (err) {
            return next(err);
        } else {
            //token update successfull.
        }
    });
};



exports.loginmobile = function(req, res) {
    var email = req.query.email || req.body.email;
    var password = req.query.password || req.body.password;
    var localuser;
    var developerToken;
    var developerKey;
    debug(email);
    debug(password);

    async.series([
        function(cb) {
            debug('1 search by email');

            User.findOne({
                email: email
            }, function(err, user) {

                if (err) {
                    return res.json(err);
                } else {
                    localuser = user;
                    cb();
                }

            })

        },
        function(cb) {
            debug('2 check user existence');

            if (!localuser) {
                return res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (localuser) {
                debug('2.5 user is there');
                cb();
            }
        },
        function(cb) {
            debug('3 check user password for security');
            password = crypto.createHash('md5').update(password).digest("hex");

            if (localuser.password != password) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                debug('3.5 password match');
                cb();
            }

        },
        function(cb) {
            debug('4 Create private key and token');
            developerKey = randomString({
                length: 20
            });

            developerToken = jwt.sign({
                id: localuser._id
            }, developerKey);

            cb()

        },
        function(cb) {
            debug('5 send the security key');
            res.json({
                "success": true,
                "developer-token": developerToken,
                "developer-key": developerKey
            });
            debug('6 mobile login done')
            cb();
        }
    ]);
};




exports.renderDeveloperPortal = function(req,res,next){

      res.render('developers');
  
};



exports.userExists  = function(developerId){
//     console.log('int the exist '+developerId);
    var foundStatus = true;
//     async.series([
//      function(cb) {
//
//     User.findOne({
//         _id: ObjectId(developerId)
//     }).exec(function(error, message) {
//         if (error) {
//             foundStatus = false;
//             debug(error)
//             // res.json({"existance":foundStatus});
//             return foundStatus;
//         } else {
//             if (!message) {
//                 foundStatus = false;
//                 debug(message)
//             }
//             debug('found status'+foundStatus)
//             return foundStatus;
//             // res.json({"existance":foundStatus});
//         }
//     })
//     cb();
//   }
//
// ]);
            return  foundStatus;

};

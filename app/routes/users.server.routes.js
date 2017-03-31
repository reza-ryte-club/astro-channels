var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    randomString = require('random-string');


module.exports = function(app) {
    app.route('/users').post(users.create).get(users.list);

    app.route('/users/:userId').get(users.read).put(users.update);//.delete(users.delete);
    // app.route('/api/userexists').post(users.userExists);
    app.param('userId', users.userByID);

    app.route('/register')
        .get(users.renderRegister)
        .post(users.register);

    /* app.route('/profile')
        .get(users.renderProfile);*/


    app.route('/login')
        .get(users.renderLogin)
        .post(passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/logout', users.logout);
    app.route('/add_user_info').get(users.renderAdd);
    app.route('/AddNewUserAdmin').get(users.renderAddNewAdmin);


    app.get('/oauth/facebook', passport.authenticate('facebook', {
        failureRedirect: '/dashboard',
        scope: ['email']
    }));

    app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/dashboard',
        successRedirect: '/dashboard',
        scope: ['email']
    }));

    //login from mobile api
        app.route('/api/loginmobile').post(users.loginmobile);

    // render developer page
        app.route('/developers').get(users.renderDeveloperPortal);

    // app.route('/loginmobile')
    //     .post(passport.authenticate('local', {
    //         session: false
    //     }), function(req, res) {
    //
    //         console.log(req.user.email);
    //         //console.log(req.private_key);
    //
    //         var private_key = randomString({
    //             length: 20
    //         });
    //
    //         console.log(private_key);
    //         var token = jwt.sign({
    //             id: req.user.id
    //         }, private_key);
    //
    //         console.log(token);
    //
    //         var updateinfo = {
    //             id: req.user.id,
    //             user_token: token,
    //             user_secret: private_key,
    //         };
    //
    //         jwt.verify(token, private_key, function(err, decoded) {
    //             console.log(decoded.id) // bar
    //         });
    //
    //         console.log(updateinfo.id);
    //         //app.put(users.update(updateinfo));
    //         users.updateToken(req.user.id, updateinfo);
    //         //update the token to the user
    //
    //         res.json({
    //             //id: req.user.id,
    //             //username: req.user.username,
    //             token: token,
    //             private_key: private_key
    //         });
    //     });
    //

    /*  curl -X POST -H "Content-Type: application/json" -d '{"email": "tetet", "password": "s28902890"}' localhost:1337/loginmobile */






};

var passport = require('passport'),
    url = require('url'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('../config'),
    users = require('../../app/controllers/users.server.controller');

module.exports = function() {
    passport.use(new FacebookStrategy({
            clientID: '',
            clientSecret: '',
            callbackURL: 'http://astro3.herokuapp.com/oauth/facebook/callback',
            profileFields: ['emails', 'first_name'],
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;
            var nameOfUser = profile.name.givenName + " " + (profile.name.middleName || "") + (profile.name.familyName || "");
            //console.log(profile);
            var providerUserProfile = {
                fullname: nameOfUser,
                email: profile.emails[0].value,
                username: profile.username,
                provider: 'facebook',
                providerId: profile.id,
                providerData: providerData
            };

            users.saveOAuthUserProfile(req, providerUserProfile, done);
        }));
};

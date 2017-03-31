var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;



var UserSchema = new Schema({
    fullname: String,
    email: {
        type: String,
        trim: true,
        unique: true
    },
    username: String,
    facebookId: String,
    facebookToken: String,
    photoUrl: String,

    password: String,
    repass: String,
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
    is_admin: Number,
    user_token: String,
    user_secret: String,
    provider: String,
    providerId: String,
    providerData: {},



    // code for recsys

    // job roles are the roles the user is having now
    // eg: for an HR "recruit","interview" etc could be a
    // job role
    job_role: {
      type: Array,
      'default': []
    },

    // 0 for unknown
    // 1 = student
    // 2 = entry
    // 3 = professional
    // 4 = manager
    // 5 = executive
    // 6 = senior executive (C level jobs)

    career_level: Number,

    // eg: HR
    discipline: String,
    industry: String,
    country: String,
    region: String,
    experience_n_entries_class: Number,
    experience_years_experience: Number,
    experience_years_in_current: Number,
    edu_degree: Number



});

/*
allowed schema
String
Number
Date
Boolean
Buffer
ObjectId
Mixed
Array
*/

UserSchema.pre('save',
    function(next) {
        if (this.password) {
            var md5 = crypto.createHash('md5');
            this.password = md5.update(this.password).digest('hex');
        }

        now = new Date();
        this.updated_at = now;
        if (!this.created_at) {
            this.created_at = now;
        }

        this.username = this.email;

        this.is_admin = 0;

        next();
    }
);


UserSchema.methods.authenticate = function(password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
            username: possibleUsername
        },
        function(err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                } else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            } else {
                callback(null);
            }
        }
    );
};


mongoose.model('User', UserSchema);

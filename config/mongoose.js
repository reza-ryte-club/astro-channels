var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);
    require('../app/models/user.server.model');
    require('../app/models/channel.server.model');
    require('../app/models/sorder.server.model');


    return db;
};

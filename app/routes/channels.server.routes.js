var channels = require('../../app/controllers/channels.server.controller');

module.exports = function(app) {
    app.route('/channel').post(channels.create);
    app.route('/channel/:channelId').delete(channels.deleteThisChannel); 
    app.route('/my-channels').get(channels.getMyChannels); 
    app.route('/all-channels').get(channels.getAllChannels);
};

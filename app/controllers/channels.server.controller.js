var Channel = require('mongoose').model('Channel');
var request = require('request');
var debug = require('debug')('http');

exports.deleteThisChannel = function(req, res, next) {
  if (req.user) {
    Channel.remove({
          users_id: req.user.id,
          channelId: req.params.channelId
      }).exec(function(error, message){
        if (error) {
          console.log(err);
          next(err);
        } else {
          res.json({'message':'deleted'});
        }
      })
    } else {
      var unauthorized= {"message":"unauthorized access reported!"};
      res.json(unauthorized);
    }
};

exports.getAllChannels = function(req, res) {
  request('http://ams-api.astro.com.my/ams/v3/getChannelList',
      function(error, response) {
        var result = JSON.parse(response.body);
        res.json(result);
      });
};

exports.getMyChannels = function(req, res) {
	if (req.user) {
		Channel.find({
      		users_id: req.user.id,
          channelId: { $exists: true }
    	}, function(err, channels) {
      	if (err) {
        	return next(err);
      	} else {
        	res.json(channels);
      	}
    	});
  	} else {
    	var unauthorized= {"message":"unauthorized access reported!"};
    	res.json(unauthorized);
  	}
};


exports.create = function(req, res) {
	if (req.user) {
      var newChannel = new Channel(req.body);
      newChannel.users_id = req.user._id;
      newChannel.save(function(err) {
        if (err) {
          return next(err);
        } else {
          res.json({'message': 'done'});
        }
      });

  	} else {
    	var unauthorized= {"message":"unauthorized access reported!"};
    	res.json(unauthorized);
  	}
};

var Sorder = require('mongoose').model('Sorder');
var request = require('request');
var debug = require('debug')('http');

exports.deleteThisOrder = function(req, res, next) {
  if (req.user) {
    Sorder.remove({
          users_id: req.user.id
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

// exports.getAllChannels = function(req, res) {
//   request('http://ams-api.astro.com.my/ams/v3/getChannelList',
//       function(error, response) {
//         var result = JSON.parse(response.body);
//         res.json(result);
//       });
// };

exports.getMySortedOrder = function(req, res) {
	if (req.user) {
		Sorder.find({
      		users_id: req.user.id
    	}, function(err, sorder) {
      	if (err) {
        	return next(err);
      	} else {
        	res.json(sorder);
      	}
    	});
  	} else {
    	var unauthorized= {"message":"unauthorized access reported!"};
    	res.json(unauthorized);
  	}
};


exports.create = function(req, res) {
	if (req.user) {
      var newSorder = new Sorder(req.body);
      newSorder.users_id = req.user._id;
      newSorder.save(function(err) {
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

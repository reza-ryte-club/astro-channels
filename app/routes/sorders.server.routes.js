// sorted order

var sorders = require('../../app/controllers/sorders.server.controller');

module.exports = function(app) {
    app.route('/sorder').post(sorders.create);
    app.route('/sorder').delete(sorders.deleteThisOrder); 
    app.route('/my-order').get(sorders.getMySortedOrder); 
};

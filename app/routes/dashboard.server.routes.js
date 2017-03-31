var dashboard = require('../../app/controllers/dashboard.server.controller');

module.exports = function(app) {
  app.route('/dashboard').get(dashboard.renderDashboard);//get(mylocations.list);

};
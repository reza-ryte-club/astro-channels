var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SorderSchema = new Schema({
  seq: {
    type: Array
  },
  users_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});


SorderSchema
  .set('minimize', false)
  .set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

var Sorder = mongoose.model('Sorder', SorderSchema);

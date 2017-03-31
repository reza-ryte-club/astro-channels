var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  channelId: {
    type: Number
  },
  is_favorite:{
    type: Boolean
  },
  users_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});


ChannelSchema
  .set('minimize', false)
  .set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

var Channel = mongoose.model('Channel', ChannelSchema);

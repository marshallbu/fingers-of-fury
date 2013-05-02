var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var tableSchema = new Schema({
  session: String,
  url: String,
  created: {type: Date, default: Date.now},
  players: []
});

module.exports = mongoose.model('Table', tableSchema);
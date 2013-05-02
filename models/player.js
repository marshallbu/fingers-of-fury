var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var playerSchema = new Schema({
  name: String,
  created: {type: Date, default: Date.now},
  lastJoined: {type: Date, default: Date.now},
  totalPlays: {type: Number, default: 0},
  wins: {type: Number, default: 0},
  currentGameSession: String
});

module.exports = mongoose.model('Player', playerSchema);
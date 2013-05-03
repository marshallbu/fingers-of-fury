var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var tableSchema = new Schema({
  session: String,
  url: String,
  created: {type: Date, default: Date.now},
  players: [{
    id: String,
    name: String
  }],
  rounds: [{
    round: Number,
    winners: [String],
    moves: [{
      player: String,
      move: String
    }],
    played: { type: Date },
    complete: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('Table', tableSchema);
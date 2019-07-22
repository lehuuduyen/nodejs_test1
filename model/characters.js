const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  weapon: {
    type: String,
    required: true,
  },
  strength: {
    type: Number,
    required: true,
    default: 0
  },
  agility: {
    type: Number,
    required: true,
    default: 0
  },
  knowledge: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

characterSchema.statics.findByName = function(name) {
  return this.findOne({ name: name });
};

const Character = mongoose.model('characters', characterSchema);
module.exports = Character;

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
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


userSchema.statics.findUserByEmail = function(email) {
  return this.findOne({ email: email });
};

userSchema.statics.comparePassword = function (password, hash) {
  return bcrypt.compareSync(password, hash)
};

userSchema.statics.findUserById = async function (id) {
  return await this.findOne({ _id: id });
};

const User = mongoose.model('users', userSchema);
module.exports = User;

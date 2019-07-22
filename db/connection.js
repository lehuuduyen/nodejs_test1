const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const options = {
  dbName: process.env.DBNAME,
  user: 'root',
  pass: process.env.PASSWORD,
  useNewUrlParser: true,
  useCreateIndex: true,
};
module.exports = {

  connection: () => {
    mongoose.connect(process.env.HOST, options).then(
      () => {
        console.log(`connected to db`)
      },
      err => {
        throw new Error(err)
      }
    );
  }

};

const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

mongoose.connect(`${dbURI}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    dbgr('Connected to MongoDB');
  })
  .catch((err) => {
    dbgr('Error connecting to MongoDB', err);
  });

module.exports = mongoose.connection;

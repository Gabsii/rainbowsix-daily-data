const mongoose = require('mongoose');
const credentials = require('./utils/credentials');

mongoose.connect(
  credentials.db_connection_string, 
  { useNewUrlParser: true, useUnifiedTopology: true }, 
  () => console.log("connected to db")
);

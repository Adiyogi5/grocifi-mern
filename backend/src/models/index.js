const mongoose = require("mongoose");
const connection = mongoose.connection;
const db = mongoose.connection.db;

const User = require("./User");


module.exports = {
  User,
  mongoose,
  connection,
  db,
};

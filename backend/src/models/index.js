const mongoose = require("mongoose");
const connection = mongoose.connection;
const db = mongoose.connection.db;
const createFromHexString = mongoose.Types.ObjectId.createFromHexString;

const User = require("./User");
const Role = require("./Role");
const Franchise = require("./Franchise");
const settings = require("./settings");


module.exports = {
  User,
  Role,
  settings,
  Franchise,
  mongoose,
  connection,
  db,
  createFromHexString
};

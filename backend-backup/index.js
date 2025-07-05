const express = require("express");
const app = express();
const mongoose = require("./modules/database");
const cors = require("cors");
const dotenv = require("dotenv").config();
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const apiRoute = require("./routes/index");
const fs = require("fs");

app.use(logger("dev"));
//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 100000 })
);
app.use(express.static(__dirname + "/public"));
app.use(
  cors({
    origin: "*",
  })
);

const PORT = process.env.PORT;

app.use("/api", apiRoute);

app.listen(PORT, () =>
  console.log(`App Is Running On ${process.env.SERVER}: ${PORT}`)
);

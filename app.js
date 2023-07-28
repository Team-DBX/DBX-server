/* eslint-disable no-undef */
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const url = process.env.DB_URL;
const allowedOriginUrl = process.env.ALLLOWED_ORIGIN;

const login = require("./routes/login");
const index = require("./routes/index");
const categories = require("./routes/categories");

const app = express();

const corsOptions = {
  origin: [`${allowedOriginUrl}`],
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

mongoose.connect(url);

app.use("/", index);
app.use("/login", login);
app.use("/categories", categories);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log("err", err);
  res.status(err.status || 500);
  res.json();
});

module.exports = app;

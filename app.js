require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const userRoutes = require("./routes/user");
// Import book router
const bookRoutes = require("./routes/book");

const credentials = {
  user: process.env.USER,
  pw: process.env.PW,
  db: process.env.DB,
  cl: process.env.CL,
};
const origin = `mongodb+srv://${credentials.user}:${credentials.pw}@${credentials.cl}.lywpb.mongodb.net/${credentials.db}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

mongoose
  .connect(origin, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB !"))
  .catch(() => console.log("Connexion to MongoDB failed !"));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*", "http://localhost:3000" );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/users", userRoutes);

// Use book router
app.use("/api/books", bookRoutes);

module.exports = app;

const express = require("express");
const session = require("express-session");

const cors = require("cors");
require("dotenv").config();
const passport = require("./config/passport");

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth"));
app.use("/requests", require("./routes/requests"));

app.listen(5000, () => console.log("Server started on port 5000"));

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

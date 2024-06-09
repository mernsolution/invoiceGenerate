const express = require("express");
const Router = require("./Router/Router.js");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimiter = require("express-rate-limit");
const path = require("path");
const app = new express();
app.use(helmet()); 
app.use(cors()); 
app.use(hpp());

app.use(express.json()); 

//route limiter
const limiter = rateLimiter({
  windowMs: 10 * 60 * 100,
  max: 50000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:5000");
  next();
});


app.use(limiter);
// All backend API routes
app.use("/v1", Router);
app.use(express.static("./client/dist")); 

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

module.exports = app;

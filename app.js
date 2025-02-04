const express = require("express");
const app = express();
require('dotenv').config();
const path = require("node:path");
const usersRouter = require("./routes/usersRouter");

// Template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// Static files
app.use(express.static('public'))


// Routes
app.use("/", usersRouter);


// Catches controller errors or server errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});


// App port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Express form app - listening on port ${PORT}!`);
});


// // Post demo, .params only get dynamic segments
// app.post("/messages/:id", (req, res) => {
//     console.log(req.params)
//     res.send(req.params)
// });

// // Get URL parameters e.g /marv/messages/21
// app.get("/:username/messages/:messageId", (req, res, next) => {
//      // e.g result: {username: 'marv', messageId: '21'}
//     console.log(req.params);
//     res.end();
//     next()
// });

// // Get query parameter data
// app.get("/:username/messages", (req, res) => {
//     console.log("Query:", req.query);
//     res.end();
//   })

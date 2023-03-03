const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
//get mysql node library
let mysql = require('mysql');

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.use(
  express.urlencoded({
    extended: true,
  })
);
/*
//create connection to root connection
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

//connect to the database, if error, then display error in console
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});

*/
app.listen(port, () => {
  console.log(`Server listening at URL: http://localhost:${port}`);
});

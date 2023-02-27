//get mysql node library
let mysql = require('mysql');

//create connection to root connection
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

//connect to the database, if error, then display error in console
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
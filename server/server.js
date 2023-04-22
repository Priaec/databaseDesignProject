const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
//get mysql node library
let mysql = require('mysql');

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);
app.set('view engine', 'ejs');

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
  console.log(`Server listening at URL: http://localhost:${port}`);
});

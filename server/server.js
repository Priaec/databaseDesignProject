const express = require("express");
const app = express();
const port = 3000;

// Use express.json() middleware to parse JSON data in the request body
app.use(express.json());

// Require the MySQL library
const mysql = require('mysql');

// Use the apiRouter for all requests starting with /api
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// Use express.urlencoded middleware to parse URL-encoded data
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Require the body-parser library
const bodyParser = require('body-parser');

// Use body-parser to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Set up the MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'itemdb'
});

// Connect to the MySQL database and log a message on success
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Add an item
app.post('/add-item', (req, res) => {
  const { title, description, category, price } = req.body;
  const query = 'INSERT INTO items (title, description, category, price) VALUES (?, ?, ?, ?)';
  db.query(query, [title, description, category, price], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Search items
app.get('/search', (req, res) => {
  const { category } = req.query;
  const query = 'SELECT * FROM items WHERE category LIKE ?';
  db.query(query, [`%${category}%`], (err, searchResults) => {
    if (err) throw err;
    res.render('index', { searchResults });
  });
});

// Render review page
app.get('/review/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM items WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.render('review', { item: result[0] });
  });
});

// Add review
app.post('/review/:id', (req, res) => {
  const { id } = req.params;
  const { rating, description } = req.body;
  const query = 'INSERT INTO reviews (item_id, rating, description) VALUES (?, ?, ?)';
  db.query(query, [id, rating, description], (err, result) => {
    if (err) throw err;

res.redirect('/');
});
});

// Render index page with empty search results
app.get('/', (req, res) => {
res.render('index', { searchResults: [] });
})
// Start the server and log a message
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

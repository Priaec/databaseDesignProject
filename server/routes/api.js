const express = require('express');
const router = express.Router();
const url = require('url');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const querystring = require('querystring');
const { isModuleNamespaceObject } = require('util/types');
const { ifError } = require('assert');
router.use(express.static('../css'));
router.use(express.static('src'));
let mysql = require('mysql');
const { query } = require('express');
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: true }))

//get the html page
router.get('/', (req,res)=>{
    res.sendFile(__dirname + '../src/signup.html');
});

//post user
router.post('/signup', async (req,res)=>{
    /*Check if username exists*/
    const userName = req.body.username;
    const email = req.body.emailAddress;
    //check if the username or email exists
    const dupValues = [userName, email]
    //query to check for duplicates
    const dupQuery = "SELECT * FROM user WHERE username = ? OR email = ? LIMIT 1";
    const query = "INSERT INTO user(username, password, firstName, lastName, email) VALUES(?,?,?,?,?);";
    //check for duplicates
    try{
        con.query(dupQuery, dupValues, (err, rows)=>{
            if (err)
                throw err
            else if (rows.length > 0)
                return res.status(400).json({message: 'Username and or email already taken'});   
            //we know we are good in terms of no duplicates
            //hash the password away
            const hashedPassword = hash(req.body.password);
            console.log(hashedPassword)
            const values = [req.body.username, hashedPassword,
                req.body.firstName, req.body.lastName, req.body.emailAddress] 
            //insert query
            con.query(query, values, (err, rows)=>{
                if (err)
                    throw err
                //successfully inserted the record
                return res.status(201).json(JSON.stringify(rows));
            });
        }); 
    }
    //if we get error along the way, send back error
    catch(err){
        return res.status(500).json({message: err.message});
    }
});

//logging in to application
router.post('/login', async (req, res)=>{
    //get values from JSON body
    const username = req.body.username;
    const password = req.body.password;
    //error checking username and password go here
    console.log({username: username});
    console.log({password: password});

    if(username == "" || password == "" 
        || typeof(username) == 'undefined'
        || typeof(password) == 'undefined')
    {
        return res.status(200).json({message: 'No input value'});
    }
    //hashing password
    const hashedPassword = hash(password);
    console.log(hashedPassword)
    //form the query
    const query = "SELECT username FROM user WHERE username = ? AND password = ? LIMIT ?";
    const limit = 1;
    const values = [username, hashedPassword, limit];
    //run query
    //data comes back as JSON
    try{    
        con.query(query, values, (err, results, fields)=>{
            if(err)
                return res.status(400).json({message: err.message});
            //check for result, if we get one result, take that result back, otherwise dont take anything
            console.log(results[0])
            if(typeof(results[0]) == 'undefined')
                return res.status(200).json({message: 'Invalid username and password combination'});
            else
                return res.status(201).json();
        });
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
});

//initalize the database for
router.post('/init',  async (req,res)=>{
   //run the foreign key checks query
   con.query('SET FOREIGN_KEY_CHECKS = 0;', (err)=>{
    if (err){
       return res.status(500).json({message: 'Error Removing Foreign Key Oonstraints'})
    }
    //returns all tables in the schema
    con.query('SHOW TABLES', (err, results) => {
        if (err) {
          console.error('Error getting list of tables:', err);
          res.status(500).send('Error dropping tables');
        } else {
          const tables = results.map(result => result[`Tables_in_${con.config.database}`]);
          // Drop each table in the schema
          for (const table of tables) {
            con.query(`DROP TABLE IF EXISTS \`${table}\``, err => {
              if (err) {
                console.error(`Error dropping table ${table}:`, err);
                return res.status(500).json({message: 'Error dropping table'});
              } else {
                console.log(`Table ${table} dropped successfully`);
              }
            });
          }
          console.log('All tables dropped successfully')
          const sql = fs.readFileSync(__dirname + '/comp440.sql').toString();
          //console.log(sql);
          const queries = sql.split(';');
          queries.pop();
          queries.forEach((query)=>{
            console.log({query: query})
            con.query(query, function (err, result) {
                if (err)
                    return res.status(500).json({message: 'Error executing a query'});
            });
        });
        console.log('All queries completed');
        return res.status(200).json({message: 'Initialized'});
        }
    });
  });
});

//hash a string
hash = (str) =>{
    const hash = crypto.createHash('sha256').update(str).digest('hex');
    return hash;
}

//add a new item in the item list
router.post('/add-item', (req, res) => {
  const { title, description, category, price, userName } = req.body;
  console.log({userName: userName})
  const query = 'INSERT INTO items (title, description, category, price, username) VALUES (?, ?, ?, ?, ?)';
  con.query(query, [title, description, category, price, userName], (err, result) => {
    if (err) throw err;
    //res.redirect('/?userName=${userName}&category=');
    const url = '/api/search?category=&userName=' + encodeURIComponent(userName)
    console.log(url)
    res.setHeader('Cache-Control', 'no-cache');
    setTimeout(()=>{
      res.redirect(url);
    }, 1000)
  });
});

// Search items
router.get('/search', async (req, res) => {
  const { category, userName } = req.query;
  let query = 'SELECT * FROM items WHERE category LIKE ?';
  if(category == null || undefined)
    query = 'SELECT * FROM items';
  try{  
    con.query(query, [`%${category}%`], (err, searchResults) => {
      if (err) throw err;
      res.status(200).render('drop', { searchResults , userName: userName, category: ''});
    });
  }
  catch(err){
    res.status(500).json({message: err.message});
  }
});

// Render review page
router.get('/review/:id', (req, res) => {
  //id is the item id, not the review id
  const { id } = req.params;
  const userName = req.query.username;
  const query = 'SELECT * FROM items WHERE id = ?';
  con.query(query, [id], (err, result) => {
    if (err) throw err;
    //run a query for all the reviews associated with that id
    const reviewQuery = 'SELECT reviews.username, rating, reviews.description FROM items JOIN reviews ON item_id = items.id and item_id = ?';
    const item = result[0];
    con.query(reviewQuery, [id], (err, result)=>{
      if (err)
        return res.status(500).json({message: 'Error sending you to review screen'});
      //send back the reviews, including the name of the items
      return res.render('review', {item: item, reviews: result, userName: userName});
    })
  });
});

// Add review
router.post('/review/:id', (req, res) => {
  //id is the id of the item
  const { id } = req.params;
  const { rating, description, username } = req.body;
  //we need to find how many times the user has made a review for this item
  const reviewQuery = 'SELECT COUNT(id) AS review_count FROM reviews WHERE item_id = ? GROUP BY username having username = ?';
  console.log(`SELECT COUNT(id) AS review_count FROM reviews WHERE item_id = ${id}
   GROUP BY username having username = ${username}`)
  con.query(reviewQuery, [id, username], (err, result)=>{
    if(err)
      return res.status(500).json({message: 'Error retrieving count of reviews for given user and item selected'});
    console.log(result);
    let numReviews = 0;
    if(result.length !== 0)
      numReviews = result[0].review_count;
    console.log(`You have ${numReviews} reviews for this item`)
    if (numReviews >= 3){
      return res.redirect(`/api/search?userName=${username}`);
    }
    const query = 'INSERT INTO reviews (item_id, rating, description, username) VALUES (?, ?, ?, ?)';
    //console.log(`INSERT INTO reviews (item_id, rating, description, username) VALUES
    // (${id}, ${rating}, ${description}, ${username})`)
    con.query(query, [id, rating, description, username], (err, result) => {
      if (err) 
        return res.status(500).json({message: 'Error adding review'});
      res.redirect(`/api/search?userName=${username}`);
    });
  });
});

// Render index page with empty search results
router.get('/', (req, res) => {
    res.render('index', { searchResults: [] });
});

//create connection to root connection
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp440"
  });
  
  //connect to the database, if error, then display error in console
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
  });

module.exports = router;

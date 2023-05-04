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
      //res.status(200).render('drop', { searchResults , userName: userName, category: ''});
      //send back the most expensive item for each category, just item name, price, and category
      const maxQuery = 'SELECT title, category, max(price) AS price FROM items GROUP BY category;'
      con.query(maxQuery, (err, maxResults)=>{
        if (err)
          res.status(404).json({message: err.message})
        console.log(maxResults)
        res.status(200).render('drop', {searchResults, userName: userName, category: '', maxResults})
      });
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
  //run a query for who made this review, if it is the user currenty using, then return back to the main screen
  const userItemQuery = 'SELECT * FROM items WHERE username = ? AND id = ?';
  //console.log(`SELECT * FROM items WHERE username = ${username} AND id = ${id}`)
  con.query(userItemQuery, [username, id], (err, result)=>{
    if (err)
      return res.status(500).json({message: 'Error checking if the item is your item'});
    //pull the result, if we get a result back, then it means that the user is attempting to write a review for their own item
    console.log({result: result})
    if(result.length != 0)  //if the user is trying to write a review for their own item, return back without doing anything
      return res.redirect(`/api/search?userName=${username}`);
    //we need to find how many times the user has made a review for this item
    const reviewQuery = 'SELECT COUNT(id) AS review_count FROM reviews WHERE item_id = ? GROUP BY username having username = ?';
    //console.log(`SELECT COUNT(id) AS review_count FROM reviews WHERE item_id = ${id}
    //GROUP BY username having username = ${username}`)
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
      console.log(`INSERT INTO reviews (item_id, rating, description, username) VALUES 
       (${id}, ${rating}, ${description}, ${username})`)
      con.query(query, [id, rating, description, username], (err, result) => {
        if (err) 
          return res.status(500).json({message: `Error adding review ${err.message}`});
        res.redirect(`/api/search?userName=${username}`);
      });
    });
  })
});

// Render Posts Page
router.post('/posts', (req,res)=>{
  const { userName } = req.body;
  //pull the reviews that were excellent from this user 
  const query = "SELECT items.title FROM items INNER JOIN reviews ON items.id = reviews.item_id WHERE reviews.username = ? AND reviews.rating IN ('good', 'excellent');"
  con.query(query, [userName], (err, highRatings)=>{
    if(err)
      res.status(400).json({message: err.message})
    //run query for users who have not written a poor review
    const poorQuery = "SELECT username FROM user WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE reviews.username = user.username AND reviews.rating = 'poor');"
    con.query(poorQuery, (err, poorResults)=>{
      if (err)
        res.status(400).json({message: `Error with reading poor review results-> ${err.message}`})
      res.status(200).render('posts', {userName: userName, highRatings, poorResults})
    });
  });
});

//Render Details Page
router.post('/details', (req,res)=>{
  const { userName } = req.body;
  //Check all users who have only made poor reviews
  const query = "SELECT username FROM user WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE reviews.username = user.username AND rating IN ('excellent', 'good', 'fair'));"
  con.query(query, (err, poorResults)=>{
    if(err)
      res.status(400).json({message: `Error finding query for only poor reviews (8)->${err.message}`})
    const noPoorQuery = "SELECT username FROM user WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE reviews.username = user.username AND rating like 'poor');"
    con.query(noPoorQuery, (err, noPoorResults)=>{
      if(err)
        res.status(400).json({message: `Error finding query for no poor reviews (9)->${err.message}`})
      res.status(200).render('details', { userName, poorResults, noPoorResults })
    });
  });
});

//Render Users Page
router.post('/users', (req,res)=>{
  const { userName } = req.body;
  const query = "SELECT items.id, items.title FROM items JOIN reviews ON items.id = reviews.item_id WHERE reviews.rating = 'excellent' GROUP BY items.id, items.title HAVING COUNT(DISTINCT reviews.username) = (SELECT COUNT(*) FROM user)";
  con.query(query, (err, onlyExcRev)=>{
    if(err)
      res.status(400).json({message: `Error finding query for items only excellent (3)->${err.message}`})
    res.status(200).render('users', { userName, onlyExcRev })
  })
  //res.status(200).render('users', { userName })
})

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

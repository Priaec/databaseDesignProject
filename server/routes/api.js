const express = require('express');
const router = express.Router();
const url = require('url');
const path = require('path');
const querystring = require('querystring');
const { isModuleNamespaceObject } = require('util/types');
const { ifError } = require('assert');
router.use(express.static('../css'));
router.use(express.static('src'));
let mysql = require('mysql');


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
    const values = [req.body.username, req.body.password,
        req.body.firstName, req.body.lastName, req.body.emailAddress] 
    const query = "INSERT INTO user(username, password, firstName, lastName, email) VALUES(?,?,?,?,?);";
    //check for duplicates
    try{
        con.query(dupQuery, dupValues, (err, rows)=>{
            if (err)
                throw err
            else if (rows.length > 0)
                return res.status(400).json({message: 'Username and or email already taken'});   
            //we know we are good in terms of no duplicates
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
    //hashing password
    //form the query
    const query = "SELECT * FROM user WHERE username = ? AND password = ?";
    const values = [username, password];
    //run query
    //data comes back as JSON
    try{    
        con.query(query, values, (err, results, fields)=>{
            if(err)
                return res.status(400).json({message: err.message});
            //console.log(results);
            return res.status(200).json(results);
        });
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
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

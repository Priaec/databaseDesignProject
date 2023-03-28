# databaseDesignProject
Project of two, emphasis on database management and database operations

# Group Members
    Joshua Cohen
    Prabhjee Singh

# How to run project
  1. Install Dependencies listed below
  2. change your directory to _DIR_PATH\databaseDesignProject\server
  3. in the terminal, write: 'node server.js'. Expected output:
    a. Server listening at URL: http://localhost:3000
    b. Connected to Database!
  4. Open your browser and go to http://localhost:3000/api/login.html
    a. This will open you to the login page or the website
    b. If this does not work, make sure step 2 is completed
  5. Interact with the website, it should work as expected
    a. If you have any questions or issues, please report to me

# Connection JSON for node.mysql
Joshua 
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "comp440"
  }

Kabir
  {
    host: "localhost",
    user: "root",
    password: " ",
    database: "test"
  }


# Dependencies
  1. express: 4.18.2
  2. multer: 1.4.5-lts.1
  3. mysql: 2.18.1
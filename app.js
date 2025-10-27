require("dotenv").config();
const express = require("express");
const mysql = require("mysql");

app=express();

app.use(express.urlencoded({ extended: true }));
/*============================*/
const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
});
/*================================*/
connection.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
  } else {
    console.log("connected to MySQL");
  }
});
/*=================================*/
 app.get("/install", (req, res) => {

/*======iphoneProducts======*/
    const createTable = `
    CREATE TABLE IF NOT EXISTS iphoneProducts (
    Product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_url VARCHAR(200) NOT NULL,
    product_name VARCHAR(200) NOT NULL
  )`;
//
connection.query(createTable, (err, result, field) => {
    if (err) {
        console.error("Error creating(at ipone-Product-Table) table:",err.message);
    }else {
        console.log("Table 'iphoneProducts' is ready!");
    }
});
/*==================ProductDescription==============*/
     const createTable2 = `
    CREATE TABLE IF NOT EXISTS ProductDescription(
    Description_id INT PRIMARY KEY,
    Product_id INT NOT NULL,
    Product_brief_description VARCHAR(250) NOT NULL,
    Product_description TEXT NOT NULL,
    Product_img VARCHAR(300) NOT NULL,
    Product_link VARCHAR(200) UNIQUE,
    FOREIGN KEY (Product_id) REFERENCES iphoneProducts(Product_id)
    )`;
//
connection.query(createTable2, (err, result, field) => {
    if (err) {
        console.error("Error creating(at Product-Description-Table) table:",err.message);
    }else {
        console.log("Table 'ProductDescription' is ready!");
    }
});
/*==================ProductPrice===============*/
const createTable3 = `
    CREATE TABLE IF NOT EXISTS ProductPrice( 
    Price_id INT AUTO_INCREMENT PRIMARY KEY,
    Product_id INT NOT NULL,
    Starting_price VARCHAR(100) NOT NULL,
    Price_range VARCHAR(250) NOT NULL,
    FOREIGN KEY (Product_id) REFERENCES iphoneProducts(Product_id)
)`;
//
connection.query(createTable3, (err, result, field) => {
    if (err) {
        console.error("Error creating(at Product-Price-Table) table:",err.message);
    }else{
        console.log("Table 'Product-Price' is ready!");
    }
    });
/*===============User-Table=================*/
const createTable4 = `
    CREATE TABLE IF NOT EXISTS UserTable( 
    user_id INT AUTO_INCREMENT NOT NULL,
    User_name VARCHAR(100) NOT NULL,
    User_password VARCHAR(150) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES iphoneProducts(Product_id)
)`;
//
connection.query(createTable4, (err, result, field) => {
    if (err) {
        console.error("Error creating(at User-Table) table:", err.message);
    }else {
        console.log("Table 'User-Table' is ready!");
    }
    });
    res.end("All tables are created successfully!");
});

/*==============POST==================*/
app.post("/add-all", (req, res) => {
  console.log(req.body);
  //   const product_url = req.body.product_url;
  //   const product_name = req.body.product_name;
  const { product_url, product_name } = req.body;

  let insertproduct = `INSERT INTO iphoneProducts (product_url, product_name) VALUES (?, ?)`;

  connection.query(
    insertproduct,
    [product_url, product_name],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err.message);
        res.send("Error saving product");
        res.end();
      } else {
        console.log("Data inserted:", result.insertId);
        res.send("<h3 style='color:green;'>Product saved successfully!</h3>");
        res.end();
      }
    }
  );
});
/*==============POST-ProductDescription==================*/
app.post("/add-all", (req, res) => {
  console.log(req.body);
  const {
    product_brief_description,
    product_description,
    product_img,
    product_link,
  } = req.body;

  let insertProductDescription = `INSERT INTO ProductDescription ( 
    product_brief_description,
    product_description,
    product_img,
    product_link,) VALUES (?, ?)`;

  connection.query(
    insertProductDescription,
    [product_brief_description, product_description, product_img, product_link],
    (err, result) => {
      if (err) {
        console.error("Insert error:", err.message);
        res.send("Error saving insertProductDescription");
        res.end();
      } else {
        console.log("Data inserted:", result.insertId);
        res.send(
          "<h3 style='color:green;'>insertProductDescription saved successfully!</h3>"
        );
        res.end();
      }
    }
  );
});


/*================================*/
app.listen(3000, (err) => {
    if (err) {
        console.error("Server failed to listen", err.message);
    } else {
        console.log("Server listen at: http://localhost:3000");
    }
});











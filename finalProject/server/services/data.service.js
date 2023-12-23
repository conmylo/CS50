// Import required modules
const mysql = require('mysql');

// Create MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  port: yourPortHere,
  user: 'yourUserHere',
  password: 'yourPasswordHere',
  database: 'todolist'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as ID: ' + connection.threadId);
});


async function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  })
}

module.exports = {executeQuery}

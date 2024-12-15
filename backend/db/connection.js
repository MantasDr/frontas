const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool instead of a single connection
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,  // Ensure that the connection pool waits if all connections are in use
    connectionLimit: 10,       // Set a limit on the number of simultaneous connections
    queueLimit: 0              // No limit to waiting connections
});

module.exports = connection;

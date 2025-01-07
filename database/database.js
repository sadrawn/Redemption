const sqlite = require('sqlite3').verbose();
const { create } = require('domain');
const path = require('path');

// create or open a sqlite3 database
const db = new sqlite.Database(path.join(__dirname, 'database.db'), err => {
    if (err) {
        console.error("Database connection failied !");
    }
    else {
        console.log("Sqlite database connected !");
    }
})

// Function to create a table
function createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      password TEXT,
      type INTEGER
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table created or already exists.');
        }
    });
}

module.exports = {
    db, createTable
};
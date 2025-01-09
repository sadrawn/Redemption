const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { db } = require('../database/database');
const fs = require('fs');
const path = require('path');

// middleware functions 

// Function to hash a password asynchronously
async function hashPassword(password) {
    const saltRounds = 10; // Number of rounds for salting
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Password hashed successfully");
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw err;
    }
}

// Function to check admin login (modified to return a promise)
async function checkAdminLogin(username, password) {
    const SQL = 'SELECT * FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
        db.get(SQL, [username], (err, row) => {
            if (err) {
                console.error("Error fetching user:", err);
                reject(false); // Reject the promise if there's an error
            }
            if (row) {
                // Compare the entered plain password with the hashed password stored in the database
                bcrypt.compare(password, row.password, (err, result) => {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        reject(false); // Reject the promise if comparison fails
                    }
                    resolve(result); // Resolve the promise with the result of comparison
                });
            } else {
                resolve(false); // Resolve with false if no user found
            }
        });
    });
}


// Define routes
router.get('/', (req, res) => {
    fs.readFile(path.resolve(__dirname, '../data/bg.txt'), (err, image) => {
        if (err) {
            console.error('Error reading file data:', err);
            return res.render('index', { bg_image: '' }); // Render with a default image
        }

        const bg_image = `/${image}`;

        // Render after reading the file
        res.render('index', { bg_image });
    });
});

router.get('/cryptography', (req, res) => {
    res.render('Cryptography');
})
//7
router.get('/hktpuwhnl', (req, res) => {
    res.render('Login', { errorMessage: "" });
})



router.post('/hktpuwhnl', async (req, res) => {
    let { username, password } = req.body;
    try {
        // Check if admin login is valid or not using async/await
        const isValid = await checkAdminLogin(username, password);

        if (!isValid) {
            let errorMessage = "Admin login failed.";
            res.status(400).render('login', { errorMessage });
        } else {
            console.log("Admin login successful");
            req.session.login = true;
            req.session.type = 0;
            res.redirect('/admin/dashboard');
        }

    } catch (err) {
        let errorMessage = "An error occurred during login.";
        res.status(500).render('login', { errorMessage });
    }
});


// Export the router
module.exports = router;

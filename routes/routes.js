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

router.get('/login', (req, res) => {
    res.render('login');
})
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

router.get('/signup', (req, res) => {
    res.render('signup');
})
router.get('/cryptography', (req, res) => {
    res.render('Cryptography');
})
//7
router.get('/hktpuwhnl', (req, res) => {
    res.render('Login', { errorMessage: "" });
})



router.post('/hktpuwhnl', async (req, res) => {
    let { username, password, page } = req.body;
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
            if (page) {
                res.redirect(`/admin/${page}`);
            }
            else {
                res.redirect('/admin/dashboard');
            }
        }

    } catch (err) {
        let errorMessage = "An error occurred during login.";
        res.status(500).render('login', { errorMessage });
    }
});

router.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword, type } = req.body;

    // Basic Validation
    if (!username || !email || !password || !confirmPassword) {
        return res.render('signup', { errorMessage: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
        return res.render('signup', { errorMessage: 'Passwords do not match.' });
    }

    // Check if Username or Email Already Exists
    const checkUserSQL = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(checkUserSQL, [username, email], async (err, row) => {
        if (err) {
            console.error(err);
            return res.render('signup', { errorMessage: 'Database error. Please try again.' });
        }

        if (row) {
            return res.render('signup', { errorMessage: 'Username or email already exists.' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert New User
        const insertUserSQL = `INSERT INTO users (username, password, email, type) VALUES (?, ?, ?, ?)`;
        db.run(insertUserSQL, [username, hashedPassword, email, type || 0], (err) => {
            if (err) {
                console.error(err);
                return res.render('signup', { errorMessage: 'Error creating account. Please try again.' });
            }

            // Redirect to Login Page After Successful Signup
            res.redirect('/login');
        });
    });
});

// Export the router
module.exports = router;

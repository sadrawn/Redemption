const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { db } = require('../database/database.js')
// importing middleware functions 
const { getImages, check_session } = require('../middleware');
const bcrypt = require('bcrypt');
const { get } = require('http');

// multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images')); // Set the destination folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Custom filename
    }
});

// Initialize multer with storage
const upload = multer({ storage });

// middleware function for running queries 
function runQuery(SQL, params) {
    return new Promise((resolve, reject) => {
        db.run(SQL, params, function (err) {
            if (err) {
                reject(err);  // Reject the promise if there's an error
            } else {
                resolve(this);  // Resolve the promise with the current row (this) if success
            }
        });
    });
}

// Logout GET route (removed session check)
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect('/');
    });
});

// image directory location for saving or reading image from here 
const imagesDir = path.resolve(__dirname, '../public/images');

router.get('/setting', async (req, res) => {
    try {
        if (!check_session(req)) {
            return res.render('login', { errorMessage: "Unauthorized access!" });
        }

        // Fetch images using the helper function
        const { images, error } = await getImages(imagesDir);

        // Render the admin page with the fetched images
        res.render('adminPage', {
            page: 'setting',
            images,
            imageError: error
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).send("An error occurred");
    }
});

function getUser() {
    return new Promise((resolve, reject) => {
        const SQL = "SELECT * FROM users";
        db.all(SQL, (err, rows) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(rows);
            }
        });
    });
}

// Route to get users
router.get('/users', async (req, res) => {
    try {
        const rows = await getUser();
        return res.render('adminPage', { page: 'users', users: rows });
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.render('adminPage', { page: 'users', message: "Error getting users", users: [] });
    }
});



// Admin page handler (moved below specific routes)
router.get('/:page', (req, res) => {
    const { page } = req.params;
    const validPages = ['dashboard', 'users', 'setting', 'logout'];

    if (!validPages.includes(page)) {
        return res.status(404).render('404');
    }

    if (!check_session(req)) {
        return res.render('login'), { errorMessage: "", page: page };
    }
    const message = "Landing success !";
    console.log("Message:", message);
    res.render('adminPage', {
        page,
        images: [],
        imageError: '',
        message: "Landing successful"
    });
});

// ? POST

// loading image data from the website and writing its name to bg.txt file 
// we will read bg.txt file to load the backgroud image of website

router.post('/setting/image', (req, res) => {
    const { bg_image, action } = req.body;
    console.log(bg_image.toString());
    const filePath = path.join(__dirname, "../data/bg.txt");

    if (action == "set") {
        fs.writeFile(filePath, bg_image, (err) => {
            if (err) {
                console.error('Error adding image name:', err);
                return res.status(500).redirect('/admin/setting');
            }
            res.status(200).redirect('/admin/setting');
        });
    } else if (action == "delete") {
        const imageLoction = path.join(__dirname, '../public/images', bg_image);
        // Check if the file exists
        fs.access(imageLoction, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File not found:', imageLoction);
                return res.status(404).send('File not found.');
            }

            // Delete the file
            fs.unlink(imageLoction, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).send('Error deleting file.');
                }

                console.log('File deleted successfully:', imageLoction);
                res.redirect('/admin/setting');
            });
        });
    }
});

// uploading image that we get from user to directory
router.post('/setting/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No File Uploaded.');
    }
    return res.status(200).redirect("/admin/setting");
})

// Logout POST route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect('/');
    });
});
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
// we should use async when we are using asyncronus middleware function in our route function
router.post('/users/add', async (req, res) => {
    const SQL = "INSERT INTO users (username, email, password, type) VALUES (?, ?, ?, ?)";
    const { username, password } = req.body;

    const email = `${username}@gmail.com`;
    const type = 0;

    try {
        // Wait for the hashed password
        const hashedPassword = await hashPassword(password);

        // Log hashed password to verify
        console.log("Hashed Password:", hashedPassword);

        // Use the hashed password in your SQL query
        db.run(SQL, [username, email, hashedPassword, type], function (err) {
            if (err) {
                console.error('Error inserting user:', err.message);
                return res.status(500).send('Failed to add user.');
            }

            console.log(`User added successfully with ID: ${this.lastID}`);
            res.redirect('/admin/users');
        });
    } catch (err) {
        console.error("Error hashing password or inserting user:", err.message);
        res.status(500).send('Internal server error.');
    }
});

router.post('/users/delete/:id', (req, res) => {
    const userID = req.params.id;
    const SQL = "DELETE FROM users WHERE id = ?";
    db.run(SQL, [userID], (err) => {
        if (err) {
            return res.send("Error deleting user. <a href='/admin/users'>Return to settings</a>");
        }
        return res.redirect('/admin/users');
    });
});

router.post('/users/edit/:id', async (req, res) => {
    const userID = req.params.id;
    const { username, password, email } = req.body;
    const SQL = "UPDATE users SET username = ?, password = ?, email = ?, type = 0 WHERE id = ?";

    try {
        // Hash the password
        const hashedpass = await hashPassword(password);

        // Run the update query using the wrapped db.run
        await runQuery(SQL, [username, hashedpass, email, userID]);

        // Get updated user data
        const rows = await getUser();

        // Render the page with updated user list and success message
        return res.redirect('/admin/users?message=User+updated');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error updating user <a href='/admin/users'>Return to users</a>");
    }
});


module.exports = router;

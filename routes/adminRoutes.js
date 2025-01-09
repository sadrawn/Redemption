const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// importing middleware functions 
const { getImages, check_session } = require('../middleware');

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

// Admin page handler (moved below specific routes)
router.get('/:page', (req, res) => {
    const { page } = req.params;
    const validPages = ['dashboard', 'users', 'setting', 'logout'];

    if (!validPages.includes(page)) {
        return res.status(404).render('404');
    }

    if (!check_session(req)) {
        return res.redirect('/');
    }

    res.render('adminPage', { page, images: [], imageError: '' });
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

module.exports = router;

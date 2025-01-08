const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

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

// Function to check session validity
function check_session(req) {
    return req.session && req.session.login !== false && req.session.type === 0;
}

// Logout POST route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect('/');
    });
});

// Logout GET route (removed session check)
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        res.redirect('/');
    });
});

/**
 * Get a list of image file paths from a specified directory.
 * @param {string} dirPath - The directory path to search for images.
 * @returns {Promise<{images: string[], error: string}>} - An object containing images and an error message (if any).
 */
async function getImages(dirPath) {
    try {
        // Check if the directory exists
        if (!fs.existsSync(dirPath)) {
            console.error("Images directory does not exist:", dirPath);
            return { images: [], error: 'Images directory not found!' };
        }

        // Read files from the directory
        const files = await fs.promises.readdir(dirPath);

        // Filter image files and generate paths
        const images = files
            .filter(file => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(file).toLowerCase()))
            .map(file => `/images/${file}`);

        if (images.length === 0) {
            return { images, error: 'No images found in the directory!' };
        }

        return { images, error: '' };
    } catch (err) {
        console.error("Error reading images directory:", err);
        return { images: [], error: 'An error occurred while fetching images!' };
    }
}
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
            console.log(imageLoction);
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

router.post('/setting/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No File Uploaded.');
    }
    return res.status(200).redirect("/admin/setting");
})
module.exports = router;

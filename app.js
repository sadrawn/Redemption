const express = require('express');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
require('./init.js');
const app = express();

// Generate a strong secret key for sessions
const secretKey = crypto.randomBytes(32).toString('hex');

// Middleware for static files
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: secretKey, // Use the generated secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000 * 60 * 24 // 1 Day
    }
}));

// Render Engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.session = req.session;  // Make session data available in all views
    next();
});
// Import routers
const router = require('./routes/routes'); // General routes
const adminRouter = require('./routes/adminRoutes'); // Admin page routes

// Mount routers
app.use('/', router);
app.use('/admin', adminRouter);

// Start the server
const IP = 'localhost';
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://${IP}:${PORT}`);
});

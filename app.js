const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Render Engine 
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

// Import the router
const router = require('./router'); // Ensure the path is correct

// Use the router
app.use('/', router);


// Start the server
const IP = 'localhost';
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://${IP}:${PORT}`);
});

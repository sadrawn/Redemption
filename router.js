const express = require('express');
const router = express.Router();

// define routes 

router.get('/', (req, res) => {
    res.send('This is index shit');
})


module.exports = router;
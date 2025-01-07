const express = require('express');
const router = express.Router();


// Define routes
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/cryptography', (req, res) => {
    res.render('Cryptography');
})
//7
router.get('/hktpuwhnl', (req, res) => {
    res.render('Login');
})

router.post('/hktpuwhnl', (req, res) => {
    //19
    const AdminUser = 'twfbg';
    //17
    const AdminPassword = 'rudze';
    const { username, password } = req.body;
    if (username == AdminUser && password == AdminPassword) {
        res.render('adminPage');    
    }
    else {
        res.send('Fuck off');
    }
})
// Export the router
module.exports = router;

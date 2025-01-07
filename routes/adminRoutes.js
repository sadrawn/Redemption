const express = require('express');
const router = express.Router();

function check_session(req) {
    console.log(req.session.login);
    if (req.session.login == false) {
        return false;
    }
    if (req.session.type != 0) {
        return false;
    }
    return true;
}
// Admin page handler
router.get('/:page', (req, res) => {
    const { page } = req.params; // Retrieve page parameter from URL
    const validPages = ['/', 'dashboard', 'users', 'setting', 'logout']; // List of valid pages

    if (!validPages.includes(page)) {
        return res.status(404).render('404');
    }

    // Render the same admin page with dynamic content based on the page parameter
    res.render('adminPage', { page });
});
router.get('/logout', (req, res) => {
    if (!check_session(req)) {
        return res.render('login', { errorMessage: "login failed!" });
    }
    res.render('adminPage');
});



module.exports = router;

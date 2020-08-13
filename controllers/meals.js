const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home Page', loggedIn: loggedIn } );
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Create Your Account', loggedIn: loggedIn });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', loggedIn: loggedIn });
});

router.get('/meals', (req, res) => {
    res.render('meals', { title: 'Meal Packages', loggedIn: loggedIn });
});

router.get('/signedin', (req, res) => {
    res.render('signedin', { title: 'signed in', loggedIn: loggedIn });
});

router.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin Page'});
});

router.get('/shoppingCart', (req, res) => {
    res.render('shoppingCart', { title: 'Shopping Cart' });
});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
    console.log("Session destroyed!");
});

module.exports = router;
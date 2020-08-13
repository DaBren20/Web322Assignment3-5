const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home Page'} );
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Create Your Account'});
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login'});
});

router.get('/meals', (req, res) => {
    res.render('meals', { title: 'Meal Packages'});
});

router.get('/signedin', (req, res) => {
    res.render('signedin', { title: 'signed in'});
});

router.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin Page'});
});

router.get('/update', (req, res) => {
    res.render('update', { title: 'Update' });
});

router.get('/shoppingCart', (req, res) => {
    res.render('shoppingCart', { title: 'Shopping Cart' });
});

router.get('/edit', (req, res) => {
    res.render('edit', { title: 'Pick a meal to edit' });
});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
    console.log("Session destroyed!");
});

module.exports = router;